#!/usr/bin/env python3
import json
from pathlib import Path

# Existing AP college codes
existing_codes = {
    'ABRK', 'ACEE', 'ADIT', 'ADTP', 'AITK', 'AITS', 'AITT', 'ALIT', 'ALTS', 'AMRN',
    'AMRT', 'ANIL', 'ANSN', 'ASIP', 'ASTC', 'ASVR', 'AUCE', 'AUDI', 'BABA', 'BAPT',
    'BEMA', 'BRNK', 'BVCE', 'BVCR', 'BVRM', 'BVSR', 'BVTS', 'BWEC', 'CECC', 'CENT',
    'CHBR', 'CHDL', 'CHKN', 'CIET', 'CITY', 'CRRE', 'CVRT', 'DHAN', 'DIET', 'DJRC',
    'DLBC', 'DNRE', 'DSIT', 'ESWR', 'GDLV', 'GDMM', 'GECG', 'GIER', 'GIET', 'GITM',
    'GITS', 'GLIM', 'GMRI', 'GPRE', 'GTMW', 'GTNN', 'GVIC', 'GVPC', 'GVPE', 'GVPT',
    'GVPW', 'HITE', 'IDEL', 'IITM', 'ISTS', 'JGNN', 'JNTA', 'JNTK', 'JNTP', 'JONY',
    'KCIT', 'KECW', 'KHIT', 'KLMW', 'KLUN', 'KMMT', 'KORK', 'KSRM', 'KUPM', 'KVSR',
    'LBCE', 'LENO', 'LIET', 'LIMT', 'MICT', 'MIET', 'MITS', 'MJRT', 'MLEW', 'MPLW',
    'MRCL', 'MTIE', 'MVRG', 'NEWS', 'NEWT', 'NIST', 'NMRE', 'NRIA', 'NRIT', 'NSPE',
    'NSRT', 'PCEK', 'PIIT', 'PITT', 'PITW', 'PKSK', 'PPDV', 'PPSV', 'PRAG', 'PREC',
    'PSCV', 'PVKK', 'PYDE', 'QISE', 'QUBA', 'RAGU', 'RAVW', 'RCEE', 'RGAN', 'RGIT',
    'RIET', 'RKCE', 'RPRA', 'RSRN', 'RVRJ', 'SANK', 'SDTN', 'SEAT', 'SGEC', 'SGIT',
    'SGVP', 'SIMH', 'SIST', 'SMGG', 'SREC', 'SRIN', 'SRIT', 'SRKI', 'SRKR', 'SRMA',
    'SRTS', 'SSCC', 'SSSE', 'STMV', 'SVCN', 'SVHE', 'SVIK', 'SVPP', 'SVUC', 'SWRN',
    'TECH', 'TMLN', 'UCEK', 'UCEN', 'UNIV', 'URCE', 'VEMU', 'VETS', 'VGTN', 'VIEW',
    'VIGF', 'VISM', 'VISW', 'VITB', 'VITW', 'VLIT', 'VNRC', 'VRSE', 'VSMR', 'VSPT',
    'VTAP', 'VVGV', 'VVIT', 'WISE', 'WSTM'
}

# Telangana locations to exclude
telangana_locations = {
    'Hyderabad', 'Ghatkesar', 'Ibrahimpatnam', 'Ibrahimpatan', 'Gandipet', 'Miyapur',
    'Moinabad', 'Bachupally', 'Patancheru', 'Nadergul', 'Kandlakoya', 'Kukatpally',
    'Maisammaguda', 'Suraram', 'Dundigal', 'Shamirpet', 'Batasingaram', 'Bowrampet',
    'Abids', 'Hayathnagar', 'Narayanaguda', 'Dilsukhnagar', 'Mirpet', 'Chevella',
    'Yenkapally', 'Himayatsagar', 'Dhulapally', 'Peerancheru', 'Bibinagar', 'Koheda',
    'Chilkur', 'Warangal', 'Hanamkonda', 'Hasanparthy', 'Khammam', 'Sathupally',
    'Nalgonda', 'Karimnagar', 'Mahabubnagar', 'Jangaon', 'Shadnagar', 'Siddipet',
    'Kuntloor', 'Station Ghanpur', 'Medchal', 'Choutuppal', 'Suryapet', 'Bommalaramaram',
    'Jagityal', 'Yacharam', 'Peddapally', 'Mankal', 'Kesara', 'Nizamabad', 'Kodada',
    'Narsampet', 'Geesugonda', 'Kandi', 'Kothagudem', 'Darussalam', 'Bogaram', 'Madhira',
    'Masabtank', 'Lemoor', 'Langarhouse', 'Mohabbatnagar', 'Aloor', 'Chikatimamidi',
    'Alampur', 'Bommakal', 'Armoor', 'Shabad', 'Wanaparthy', 'Maheswaram', 'Huzurabad'
}

# AP location to district mapping
location_to_district = {
    'Visakhapatnam': 'Visakhapatnam', 'Bheemunipatnam': 'Visakhapatnam',
    'Vizianagaram': 'Vizianagaram', 'Bobbili': 'Vizianagaram',
    'Srikakulam': 'Srikakulam', 'Tekkali': 'Srikakulam', 'Palasa': 'Srikakulam',
    'Kakinada': 'East Godavari', 'Peddapuram': 'East Godavari', 'Ramachandrapuram': 'East Godavari', 'Mummidivaram': 'East Godavari',
    'Rajahmundry': 'East Godavari', 'Amalapuram': 'East Godavari', 'Palakole': 'East Godavari',
    'Bhimavaram': 'West Godavari', 'Tadepalligudem': 'West Godavari', 'Nallajerla': 'West Godavari', 'Narsapuram': 'West Godavari',
    'Eluru': 'Eluru',
    'Vijayawada': 'NTR District', 'Gannavaram': 'NTR District', 'Paritala': 'NTR District', 'Mylavaram': 'NTR District',
    'Telaprolu': 'NTR District', 'Jupudi': 'NTR District', 'Agiripally': 'NTR District', 'Jaggaiahpeta': 'NTR District',
    'Cheyyeru': 'NTR District',
    'Guntur': 'Guntur', 'Narsaraopet': 'Guntur', 'Sattenapally': 'Guntur', 'Tenali': 'Guntur', 'Ponnur': 'Guntur', 'Vadlamudi': 'Guntur', 'Lankapalli': 'Guntur',
    'Bapatla': 'Bapatla', 'Chirala': 'Bapatla',
    'Ongole': 'Prakasam', 'Kanigiri': 'Prakasam',
    'Nellore': 'Nellore', 'Gudur': 'Nellore', 'Kavali': 'Nellore', 'Vakadu': 'Nellore', 'Vinjamur': 'Nellore', 'Rangampeta': 'Nellore',
    'Tirupathi': 'Tirupati', 'Renigunta': 'Tirupati', 'Sri Kalahasthi': 'Tirupati', 'Puttur': 'Tirupati',
    'Kadapa': 'Kadapa', 'Rajampeta': 'Kadapa', 'Pulivendula': 'Kadapa', 'Proddatur': 'Kadapa', 'Mydukur': 'Kadapa',
    'Kurnool': 'Kurnool', 'Nandyal': 'Kurnool', 'Allagadda': 'Kurnool', 'Orvakal': 'Kurnool',
    'Anantapur': 'Anantapur', 'Tadipatri': 'Anantapur', 'Hindupur': 'Anantapur',
    'Macherla': 'Palnadu',
    'Piler': 'Annamayya',
    'Gollaprolu': 'East Godavari',
    'Anakapalle': 'Anakapalle'
}

# District to region mapping
district_to_region = {
    'Visakhapatnam': 'AU', 'Vizianagaram': 'AU', 'Srikakulam': 'AU', 'East Godavari': 'AU',
    'West Godavari': 'JNTUK', 'Guntur': 'JNTUK', 'Prakasam': 'JNTUK', 'NTR District': 'JNTUK',
    'Bapatla': 'JNTUK', 'Palnadu': 'JNTUK', 'Eluru': 'JNTUK', 'Anakapalle': 'AU',
    'Nellore': 'JNTUA/SVU', 'Tirupati': 'JNTUA/SVU', 'Kadapa': 'JNTUA/SVU',
    'Kurnool': 'JNTUA/SVU', 'Anantapur': 'JNTUA/SVU', 'Annamayya': 'JNTUA/SVU'
}

# College type mapping based on code patterns
def infer_college_type(name, code):
    """Infer college type from name"""
    name_lower = name.lower()
    if 'university' in name_lower:
        return 'Private University'
    elif 'deemed' in name_lower:
        return 'Deemed University'
    elif 'iit' in code.lower() or 'nit' in code.lower():
        return 'National Institute'
    else:
        return 'PVT'  # Default to Private

# Load the B.Tech data
data_path = Path('/sessions/amazing-epic-brown/mnt/Desktop/telugucolleges/src/lib/ap_btech_data.json')

with open(data_path, 'r') as f:
    colleges = json.load(f)

# Process colleges
missing_colleges = []
ap_colleges_processed = set()

for college in colleges:
    code = college.get('code', '').strip()
    name = college.get('name', '').strip()
    district = college.get('district', '').strip()

    # Skip if no code or already in database
    if not code or code in existing_codes:
        continue

    # Extract location from name (typically after the last dash)
    location = None
    if ' - ' in name:
        location = name.split(' - ')[-1].strip()

    # Check if location is in Telangana (exclude)
    if location and location in telangana_locations:
        continue

    # Map district code to district name
    district_name = None
    if location and location in location_to_district:
        district_name = location_to_district[location]

    # If we found a district, this is likely an AP college
    if district_name:
        # Get region
        region = district_to_region.get(district_name, 'Unknown')

        # Infer college type
        college_type = infer_college_type(name, code)

        missing_colleges.append({
            'code': code,
            'name': name,
            'location': location,
            'district': district_name,
            'region': region,
            'type': college_type
        })
        ap_colleges_processed.add(code)

# Sort by district and name
missing_colleges.sort(key=lambda x: (x['district'], x['name']))

# Output results
print("\n" + "="*80)
print(f"MISSING AP COLLEGES ANALYSIS")
print("="*80)
print(f"\nTotal colleges in data: {len(colleges)}")
print(f"Existing AP college codes: {len(existing_codes)}")
print(f"Missing AP colleges (not in database): {len(missing_colleges)}\n")

if missing_colleges:
    print("Missing AP Colleges (grouped by district):\n")
    current_district = None
    for college in missing_colleges:
        if college['district'] != current_district:
            current_district = college['district']
            print(f"\n{current_district} ({college['region']} region):")
            print("-" * 80)

        print(f"  {college['code']:8} | {college['name']:50} | {college['location']:20}")

# Write to JSON file
output_file = Path('/sessions/amazing-epic-brown/mnt/Desktop/telugucolleges/missing_ap_colleges.json')
with open(output_file, 'w') as f:
    json.dump(missing_colleges, f, indent=2, ensure_ascii=False)

print("\n" + "="*80)
print(f"JSON output written to: {output_file}")
print("="*80 + "\n")

# Print JSON
print("\nJSON Output:\n")
print(json.dumps(missing_colleges, indent=2, ensure_ascii=False))
