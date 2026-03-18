#!/usr/bin/env python3
"""Full audit: Requests/BS4 for all universities, Playwright for failures."""
import json
import time
import asyncio
import logging

logging.basicConfig(level=logging.INFO, format='%(asctime)s %(message)s')
log = logging.getLogger(__name__)

from university_data import UNIVERSITIES
from selenium_scraper import run_selenium_scraper
from generate_excel_report import generate_report

OUTPUT_DIR = '/sessions/wizardly-zen-brahmagupta/mnt/telugucolleges'
SEL_JSON = '/sessions/wizardly-zen-brahmagupta/selenium_results.json'
PW_JSON = '/sessions/wizardly-zen-brahmagupta/playwright_results.json'
REPORT = f'{OUTPUT_DIR}/University_Audit_AP_Telangana.xlsx'

# Phase 1: Requests/BS4 scraper (fast, reliable)
print("=" * 60)
print("PHASE 1: Requests/BeautifulSoup scraper (all universities)")
print("=" * 60)
t0 = time.time()
sel_results = run_selenium_scraper(UNIVERSITIES, SEL_JSON)
print(f"\nPhase 1 completed in {time.time()-t0:.1f}s")
for r in sel_results:
    print(f"  {r['short_name']:12s} | fees: {len(r['all_fees']):3d} | courses: {len(r['all_courses']):3d} | errors: {len(r.get('errors', []))}")

# Phase 2: Playwright for universities that had issues
failed_unis = [u for u, r in zip(UNIVERSITIES, sel_results)
               if not r['all_fees'] and not r['all_courses']]

if failed_unis:
    print(f"\n{'='*60}")
    print(f"PHASE 2: Playwright scraper ({len(failed_unis)} universities needing retry)")
    print("=" * 60)
    t0 = time.time()
    try:
        from playwright.async_api import async_playwright

        async def pw_scrape_failed():
            from playwright_scraper import extract_fee_info, extract_courses, extract_tables_pw
            results = []
            async with async_playwright() as pw:
                browser = await pw.chromium.launch(
                    headless=True,
                    executable_path='/sessions/wizardly-zen-brahmagupta/.cache/ms-playwright/chromium-1208/chrome-linux/chrome',
                )
                ctx = await browser.new_context(
                    user_agent='Mozilla/5.0 (X11; Linux aarch64) AppleWebKit/537.36',
                    viewport={'width': 1920, 'height': 1080},
                )
                page = await ctx.new_page()
                page.set_default_timeout(20000)

                for uni in failed_unis:
                    log.info(f"  PW retry: {uni['short_name']}")
                    uni_result = {
                        'name': uni['name'], 'short_name': uni['short_name'],
                        'state': uni['state'], 'city': uni['city'],
                        'type': uni['type'], 'website': uni['website'],
                        'all_fees': [], 'all_courses': [], 'all_tables': [],
                        'errors': [],
                    }
                    urls = [uni['website']] + uni.get('fees_urls', []) + uni.get('courses_urls', [])
                    seen = set()
                    for url in urls:
                        if url in seen:
                            continue
                        seen.add(url)
                        try:
                            resp = await page.goto(url, wait_until='domcontentloaded', timeout=20000)
                            await page.wait_for_timeout(3000)
                            text = await page.inner_text('body')
                            uni_result['all_fees'].extend(extract_fee_info(text))
                            uni_result['all_courses'].extend(extract_courses(text))
                            tables = await extract_tables_pw(page)
                            uni_result['all_tables'].extend(tables)
                        except Exception as e:
                            uni_result['errors'].append(f"{url}: {str(e)[:80]}")

                    uni_result['all_fees'] = list(dict.fromkeys(uni_result['all_fees']))
                    uni_result['all_courses'] = sorted(set(uni_result['all_courses']))
                    results.append(uni_result)
                    log.info(f"    Found {len(uni_result['all_fees'])} fees, {len(uni_result['all_courses'])} courses")

                await browser.close()
            return results

        pw_results = asyncio.run(pw_scrape_failed())
        with open(PW_JSON, 'w') as f:
            json.dump(pw_results, f, indent=2, ensure_ascii=False)
        print(f"Phase 2 completed in {time.time()-t0:.1f}s")
        for r in pw_results:
            print(f"  {r['short_name']:12s} | fees: {len(r['all_fees']):3d} | courses: {len(r['all_courses']):3d}")
    except Exception as e:
        print(f"Playwright phase failed (non-critical): {e}")
        pw_results = []
        with open(PW_JSON, 'w') as f:
            json.dump([], f)
else:
    print("\nAll universities got data from Phase 1, skipping Playwright.")
    with open(PW_JSON, 'w') as f:
        json.dump([], f)

# Phase 3: Generate Excel
print(f"\n{'='*60}")
print("PHASE 3: Generating Excel audit report")
print("=" * 60)
generate_report(REPORT, SEL_JSON, PW_JSON)
print(f"\nReport: {REPORT}")
print("AUDIT COMPLETE!")
