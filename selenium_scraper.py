"""
Requests + BeautifulSoup scraper for university fees and courses.
Lightweight alternative to Selenium - good for static/server-rendered pages.
Falls back gracefully when JS-rendered content isn't available.
"""
import json
import re
import logging
import time
import requests
from bs4 import BeautifulSoup

logging.basicConfig(level=logging.INFO, format='%(asctime)s [REQ] %(message)s')
log = logging.getLogger(__name__)

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (X11; Linux aarch64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.9',
}

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


def extract_tables_bs(soup):
    tables_data = []
    for table in soup.find_all('table')[:10]:
        table_rows = []
        for row in table.find_all('tr')[:100]:
            cells = row.find_all(['td', 'th'])
            cell_texts = [c.get_text(strip=True) for c in cells if c.get_text(strip=True)]
            if cell_texts:
                table_rows.append(cell_texts)
        if table_rows:
            tables_data.append(table_rows)
    return tables_data


def scrape_url_requests(url, session):
    result = {
        'url': url, 'status': 'error', 'title': '',
        'fees': [], 'courses': [], 'tables': [], 'raw_text_snippet': '',
    }
    try:
        log.info(f"  Fetching: {url}")
        resp = session.get(url, timeout=20, allow_redirects=True)
        if resp.status_code >= 400:
            result['status'] = f'http_{resp.status_code}'
            return result

        soup = BeautifulSoup(resp.text, 'lxml')
        result['title'] = soup.title.string if soup.title else ''

        for tag in soup(['script', 'style', 'nav', 'footer', 'header']):
            tag.decompose()

        page_text = soup.get_text(separator='\n', strip=True)
        result['raw_text_snippet'] = page_text[:2000]
        result['fees'] = extract_fee_info(page_text)
        result['courses'] = extract_courses(page_text)
        result['tables'] = extract_tables_bs(soup)
        result['status'] = 'success'

    except requests.Timeout:
        result['status'] = 'timeout'
        log.warning(f"  Timeout: {url}")
    except requests.ConnectionError:
        result['status'] = 'connection_error'
        log.warning(f"  Connection error: {url}")
    except Exception as e:
        result['status'] = f'error: {str(e)[:100]}'
        log.warning(f"  Error: {url} - {str(e)[:100]}")

    return result


def scrape_university_requests(session, uni):
    log.info(f"Scraping: {uni['name']} ({uni['type']})")
    uni_result = {
        'name': uni['name'],
        'short_name': uni['short_name'],
        'state': uni['state'],
        'city': uni['city'],
        'type': uni['type'],
        'website': uni['website'],
        'all_fees': [], 'all_courses': [], 'all_tables': [],
        'pages_scraped': [], 'errors': [],
    }

    home = scrape_url_requests(uni['website'], session)
    uni_result['pages_scraped'].append(home)
    uni_result['all_fees'].extend(home.get('fees', []))
    uni_result['all_courses'].extend(home.get('courses', []))
    uni_result['all_tables'].extend(home.get('tables', []))

    for url in uni.get('fees_urls', []):
        time.sleep(1)
        page = scrape_url_requests(url, session)
        uni_result['pages_scraped'].append(page)
        uni_result['all_fees'].extend(page.get('fees', []))
        uni_result['all_tables'].extend(page.get('tables', []))
        if page['status'] != 'success':
            uni_result['errors'].append(f"Fee page error: {url} - {page['status']}")

    for url in uni.get('courses_urls', []):
        time.sleep(1)
        page = scrape_url_requests(url, session)
        uni_result['pages_scraped'].append(page)
        uni_result['all_courses'].extend(page.get('courses', []))
        if page['status'] != 'success':
            uni_result['errors'].append(f"Course page error: {url} - {page['status']}")

    uni_result['all_fees'] = list(dict.fromkeys(uni_result['all_fees']))
    uni_result['all_courses'] = sorted(set(uni_result['all_courses']))
    log.info(f"  Found {len(uni_result['all_fees'])} fee entries, {len(uni_result['all_courses'])} courses")
    return uni_result


def run_selenium_scraper(universities, output_path='selenium_results.json'):
    """Entry point - uses requests+BS4 (renamed for compatibility with orchestrator)."""
    log.info(f"Starting Requests/BS4 scraper for {len(universities)} universities")
    session = requests.Session()
    session.headers.update(HEADERS)
    results = []

    for i, uni in enumerate(universities):
        log.info(f"[{i+1}/{len(universities)}] Processing {uni['short_name']}...")
        try:
            result = scrape_university_requests(session, uni)
            results.append(result)
        except Exception as e:
            log.error(f"Failed to scrape {uni['name']}: {e}")
            results.append({
                'name': uni['name'], 'short_name': uni['short_name'],
                'state': uni['state'], 'city': uni['city'],
                'type': uni['type'], 'website': uni['website'],
                'all_fees': [], 'all_courses': [], 'all_tables': [],
                'errors': [str(e)],
            })

    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(results, f, indent=2, ensure_ascii=False)
    log.info(f"Requests/BS4 results saved to {output_path}")
    return results


if __name__ == '__main__':
    from university_data import UNIVERSITIES
    run_selenium_scraper(UNIVERSITIES)
