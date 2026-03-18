"""
Playwright-based scraper for university fees and courses.
Handles modern SPAs, dynamic content, and PDF links better than Selenium.
"""
import json
import re
import logging
import asyncio
from pathlib import Path
from playwright.async_api import async_playwright, TimeoutError as PWTimeout

logging.basicConfig(level=logging.INFO, format='%(asctime)s [PW] %(message)s')
log = logging.getLogger(__name__)

FEE_KEYWORDS = [
    'fee', 'fees', 'tuition', 'cost', 'charges', 'payment',
    'semester', 'annual', 'hostel', 'examination', 'admission fee',
    'fee structure', 'per annum', 'per year', 'lakh', 'lakhs',
    '₹', 'rs', 'inr', 'rupees'
]

COURSE_KEYWORDS = [
    'b.tech', 'btech', 'm.tech', 'mtech', 'mba', 'mca', 'bba', 'bca',
    'b.sc', 'bsc', 'm.sc', 'msc', 'b.a', 'ba', 'm.a', 'ma',
    'b.com', 'bcom', 'm.com', 'mcom', 'ph.d', 'phd', 'diploma',
    'b.pharm', 'bpharm', 'm.pharm', 'mpharm', 'mbbs', 'md', 'bds',
    'llb', 'llm', 'b.ed', 'bed', 'm.ed', 'med',
    'programme', 'program', 'course', 'department', 'school of',
    'faculty of', 'undergraduate', 'postgraduate', 'doctoral',
]


def extract_fee_info(text):
    fees = []
    lines = text.split('\n')
    for i, line in enumerate(lines):
        line_lower = line.lower().strip()
        if not line_lower:
            continue
        has_fee_kw = any(kw in line_lower for kw in FEE_KEYWORDS)
        has_number = bool(re.search(r'[\d,]+\.?\d*', line))
        if has_fee_kw and has_number:
            clean = re.sub(r'\s+', ' ', line.strip())
            if 10 < len(clean) < 500:
                fees.append(clean)
        elif has_fee_kw and i + 1 < len(lines):
            next_line = lines[i + 1].strip()
            if re.search(r'[\d,]+\.?\d*', next_line):
                combined = re.sub(r'\s+', ' ', f"{line.strip()} - {next_line}")
                if len(combined) < 500:
                    fees.append(combined)
    return list(dict.fromkeys(fees))[:50]


def extract_courses(text):
    courses = set()
    lines = text.split('\n')
    for line in lines:
        line_lower = line.lower().strip()
        if not line_lower or len(line_lower) < 3:
            continue
        if any(kw in line_lower for kw in COURSE_KEYWORDS):
            clean = re.sub(r'\s+', ' ', line.strip())
            if 5 < len(clean) < 200:
                courses.add(clean)
    patterns = [
        r'(?:B\.?Tech|M\.?Tech|MBA|MCA|BBA|BCA|B\.?Sc|M\.?Sc|B\.?A|M\.?A|B\.?Com|M\.?Com|Ph\.?D|MBBS|BDS|LLB|LLM|B\.?Ed|M\.?Ed|B\.?Pharm|M\.?Pharm)\s*[\(\.\-]?\s*\w[\w\s\&\,\.\-]*',
    ]
    for pat in patterns:
        for m in re.findall(pat, text, re.IGNORECASE):
            clean = re.sub(r'\s+', ' ', m.strip())
            if 5 < len(clean) < 200:
                courses.add(clean)
    return sorted(list(courses))[:100]


async def extract_tables_pw(page):
    tables_data = []
    try:
        tables = await page.query_selector_all('table')
        for table in tables[:10]:
            rows = await table.query_selector_all('tr')
            table_rows = []
            for row in rows[:100]:
                cells = await row.query_selector_all('td, th')
                cell_texts = []
                for c in cells:
                    txt = (await c.inner_text()).strip()
                    if txt:
                        cell_texts.append(txt)
                if cell_texts:
                    table_rows.append(cell_texts)
            if table_rows:
                tables_data.append(table_rows)
    except Exception:
        pass
    return tables_data


async def discover_fee_links(page, base_url):
    """Find links that might lead to fee/course pages."""
    links = []
    try:
        anchors = await page.query_selector_all('a[href]')
        for a in anchors:
            href = await a.get_attribute('href')
            text = (await a.inner_text()).strip().lower()
            if not href:
                continue
            fee_link_kws = ['fee', 'tuition', 'cost', 'admission', 'programme',
                            'program', 'course', 'academic', 'department']
            if any(kw in text for kw in fee_link_kws) or any(kw in href.lower() for kw in fee_link_kws):
                if href.startswith('/'):
                    from urllib.parse import urljoin
                    href = urljoin(base_url, href)
                if href.startswith('http'):
                    links.append({'url': href, 'text': text})
    except Exception:
        pass
    return links[:20]


async def scrape_url_pw(page, url):
    result = {
        'url': url,
        'status': 'error',
        'title': '',
        'fees': [],
        'courses': [],
        'tables': [],
        'raw_text_snippet': '',
        'discovered_links': [],
    }
    try:
        log.info(f"  Fetching: {url}")
        resp = await page.goto(url, wait_until='domcontentloaded', timeout=30000)
        if resp and resp.status >= 400:
            result['status'] = f'http_{resp.status}'
            return result

        await page.wait_for_timeout(3000)

        # Auto-scroll to trigger lazy loading
        await page.evaluate("""
            async () => {
                await new Promise(r => {
                    let total = 0;
                    const dist = 300;
                    const timer = setInterval(() => {
                        window.scrollBy(0, dist);
                        total += dist;
                        if (total >= document.body.scrollHeight) {
                            clearInterval(timer);
                            window.scrollTo(0, 0);
                            r();
                        }
                    }, 100);
                    setTimeout(() => { clearInterval(timer); r(); }, 5000);
                });
            }
        """)
        await page.wait_for_timeout(1000)

        result['title'] = await page.title() or ''
        page_text = await page.inner_text('body')

        result['raw_text_snippet'] = page_text[:2000]
        result['fees'] = extract_fee_info(page_text)
        result['courses'] = extract_courses(page_text)
        result['tables'] = await extract_tables_pw(page)
        result['discovered_links'] = await discover_fee_links(page, url)
        result['status'] = 'success'

        # Try expanding accordions / tabs
        try:
            expandables = await page.query_selector_all(
                '[class*="accordion"], [class*="expand"], [class*="collapse"], '
                '[role="tab"], [data-toggle], details summary'
            )
            for elem in expandables[:10]:
                try:
                    await elem.click()
                    await page.wait_for_timeout(500)
                except Exception:
                    pass
            updated_text = await page.inner_text('body')
            if len(updated_text) > len(page_text):
                result['fees'] = extract_fee_info(updated_text)
                result['courses'] = extract_courses(updated_text)
                result['tables'] = await extract_tables_pw(page)
        except Exception:
            pass

    except PWTimeout:
        result['status'] = 'timeout'
        log.warning(f"  Timeout: {url}")
    except Exception as e:
        result['status'] = f'error: {str(e)[:100]}'
        log.warning(f"  Error: {url} - {str(e)[:100]}")

    return result


async def scrape_university_pw(page, uni):
    log.info(f"Scraping: {uni['name']} ({uni['type']})")
    uni_result = {
        'name': uni['name'],
        'short_name': uni['short_name'],
        'state': uni['state'],
        'city': uni['city'],
        'type': uni['type'],
        'website': uni['website'],
        'all_fees': [],
        'all_courses': [],
        'all_tables': [],
        'pages_scraped': [],
        'discovered_links': [],
        'errors': [],
    }

    home = await scrape_url_pw(page, uni['website'])
    uni_result['pages_scraped'].append(home)
    uni_result['all_fees'].extend(home.get('fees', []))
    uni_result['all_courses'].extend(home.get('courses', []))
    uni_result['all_tables'].extend(home.get('tables', []))
    uni_result['discovered_links'].extend(home.get('discovered_links', []))

    for url in uni.get('fees_urls', []):
        pg = await scrape_url_pw(page, url)
        uni_result['pages_scraped'].append(pg)
        uni_result['all_fees'].extend(pg.get('fees', []))
        uni_result['all_tables'].extend(pg.get('tables', []))
        uni_result['discovered_links'].extend(pg.get('discovered_links', []))
        if pg['status'] != 'success':
            uni_result['errors'].append(f"Fee page: {url} - {pg['status']}")

    for url in uni.get('courses_urls', []):
        pg = await scrape_url_pw(page, url)
        uni_result['pages_scraped'].append(pg)
        uni_result['all_courses'].extend(pg.get('courses', []))
        uni_result['discovered_links'].extend(pg.get('discovered_links', []))
        if pg['status'] != 'success':
            uni_result['errors'].append(f"Course page: {url} - {pg['status']}")

    # Follow up to 5 discovered links for additional fee/course data
    seen_urls = set(uni.get('fees_urls', []) + uni.get('courses_urls', []) + [uni['website']])
    extra_links = [l for l in uni_result['discovered_links']
                   if l['url'] not in seen_urls and l['url'].startswith('http')][:5]
    for link in extra_links:
        seen_urls.add(link['url'])
        pg = await scrape_url_pw(page, link['url'])
        uni_result['all_fees'].extend(pg.get('fees', []))
        uni_result['all_courses'].extend(pg.get('courses', []))

    uni_result['all_fees'] = list(dict.fromkeys(uni_result['all_fees']))
    uni_result['all_courses'] = sorted(set(uni_result['all_courses']))
    del uni_result['discovered_links']

    log.info(f"  Found {len(uni_result['all_fees'])} fee entries, {len(uni_result['all_courses'])} courses")
    return uni_result


async def _run(universities, output_path):
    results = []
    async with async_playwright() as pw:
        browser = await pw.chromium.launch(
            headless=True,
            executable_path='/sessions/wizardly-zen-brahmagupta/.cache/ms-playwright/chromium-1208/chrome-linux/chrome',
        )
        ctx = await browser.new_context(
            user_agent='Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            viewport={'width': 1920, 'height': 1080},
        )
        page = await ctx.new_page()

        for i, uni in enumerate(universities):
            log.info(f"[{i+1}/{len(universities)}] Processing {uni['short_name']}...")
            try:
                result = await scrape_university_pw(page, uni)
                results.append(result)
            except Exception as e:
                log.error(f"Failed: {uni['name']}: {e}")
                results.append({
                    'name': uni['name'],
                    'short_name': uni['short_name'],
                    'state': uni['state'],
                    'city': uni['city'],
                    'type': uni['type'],
                    'website': uni['website'],
                    'all_fees': [],
                    'all_courses': [],
                    'all_tables': [],
                    'errors': [str(e)],
                })

        await browser.close()

    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(results, f, indent=2, ensure_ascii=False)
    log.info(f"Playwright results saved to {output_path}")
    return results


def run_playwright_scraper(universities, output_path='playwright_results.json'):
    log.info(f"Starting Playwright scraper for {len(universities)} universities")
    return asyncio.run(_run(universities, output_path))


if __name__ == '__main__':
    from university_data import UNIVERSITIES
    run_playwright_scraper(UNIVERSITIES)
