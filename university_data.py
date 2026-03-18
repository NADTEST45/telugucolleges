"""
University & Deemed University data for AP & Telangana
Contains official website URLs, types, and metadata
"""

UNIVERSITIES = [
    # === ANDHRA PRADESH - DEEMED UNIVERSITIES ===
    {
        "name": "GITAM (Gandhi Institute of Technology and Management)",
        "short_name": "GITAM",
        "state": "Andhra Pradesh",
        "city": "Visakhapatnam",
        "type": "Deemed University",
        "website": "https://www.gitam.edu",
        "fees_urls": [
            "https://www.gitam.edu/admissions/fee-structure",
            "https://www.gitam.edu/programmes",
        ],
        "courses_urls": [
            "https://www.gitam.edu/programmes",
            "https://www.gitam.edu/academics",
        ],
    },
    {
        "name": "Koneru Lakshmaiah Education Foundation (KL University)",
        "short_name": "KL University",
        "state": "Andhra Pradesh",
        "city": "Vijayawada",
        "type": "Deemed University",
        "website": "https://www.kluniversity.in",
        "fees_urls": [
            "https://www.kluniversity.in/admissions/fee-structure.aspx",
            "https://www.kluniversity.in/admissions.aspx",
        ],
        "courses_urls": [
            "https://www.kluniversity.in/programmes.aspx",
            "https://www.kluniversity.in/academics.aspx",
        ],
    },
    {
        "name": "Vignan's Foundation for Science, Technology & Research",
        "short_name": "VFSTR",
        "state": "Andhra Pradesh",
        "city": "Guntur",
        "type": "Deemed University",
        "website": "https://www.vignan.ac.in",
        "fees_urls": [
            "https://www.vignan.ac.in/admissions/fee-structure",
            "https://www.vignan.ac.in/admissions",
        ],
        "courses_urls": [
            "https://www.vignan.ac.in/programmes",
            "https://www.vignan.ac.in/academics",
        ],
    },
    {
        "name": "Sri Sathya Sai Institute of Higher Learning",
        "short_name": "SSSIHL",
        "state": "Andhra Pradesh",
        "city": "Anantapur",
        "type": "Deemed University",
        "website": "https://www.sssihl.edu.in",
        "fees_urls": [
            "https://www.sssihl.edu.in/admissions",
        ],
        "courses_urls": [
            "https://www.sssihl.edu.in/academics/programmes",
            "https://www.sssihl.edu.in/academics",
        ],
    },
    {
        "name": "Rashtriya Sanskrit Vidyapeetha",
        "short_name": "RSVP",
        "state": "Andhra Pradesh",
        "city": "Tirupati",
        "type": "Central University (formerly Deemed)",
        "website": "https://www.rsvidyapeetha.ac.in",
        "fees_urls": [
            "https://www.rsvidyapeetha.ac.in/admissions",
        ],
        "courses_urls": [
            "https://www.rsvidyapeetha.ac.in/academics",
        ],
    },
    # === ANDHRA PRADESH - STATE UNIVERSITIES ===
    {
        "name": "Andhra University",
        "short_name": "AU",
        "state": "Andhra Pradesh",
        "city": "Visakhapatnam",
        "type": "State University",
        "website": "https://www.andhrauniversity.edu.in",
        "fees_urls": [
            "https://www.andhrauniversity.edu.in/admissions",
        ],
        "courses_urls": [
            "https://www.andhrauniversity.edu.in/academics",
            "https://www.andhrauniversity.edu.in/departments",
        ],
    },
    {
        "name": "Acharya Nagarjuna University",
        "short_name": "ANU",
        "state": "Andhra Pradesh",
        "city": "Guntur",
        "type": "State University",
        "website": "https://www.nagarjunauniversity.ac.in",
        "fees_urls": [
            "https://www.nagarjunauniversity.ac.in/admissions",
        ],
        "courses_urls": [
            "https://www.nagarjunauniversity.ac.in/departments",
        ],
    },
    {
        "name": "Sri Venkateswara University",
        "short_name": "SVU",
        "state": "Andhra Pradesh",
        "city": "Tirupati",
        "type": "State University",
        "website": "https://www.svuniversity.edu.in",
        "fees_urls": [
            "https://www.svuniversity.edu.in/admissions",
        ],
        "courses_urls": [
            "https://www.svuniversity.edu.in/academics",
        ],
    },
    {
        "name": "Yogi Vemana University",
        "short_name": "YVU",
        "state": "Andhra Pradesh",
        "city": "Kadapa",
        "type": "State University",
        "website": "https://www.yogivemanauniversity.ac.in",
        "fees_urls": [
            "https://www.yogivemanauniversity.ac.in/admissions.php",
        ],
        "courses_urls": [
            "https://www.yogivemanauniversity.ac.in/departments.php",
        ],
    },
    {
        "name": "Krishna University",
        "short_name": "KRU",
        "state": "Andhra Pradesh",
        "city": "Machilipatnam",
        "type": "State University",
        "website": "https://www.krishnauniversity.ac.in",
        "fees_urls": [
            "https://www.krishnauniversity.ac.in/admissions",
        ],
        "courses_urls": [
            "https://www.krishnauniversity.ac.in/departments",
        ],
    },
    {
        "name": "Vikrama Simhapuri University",
        "short_name": "VSU",
        "state": "Andhra Pradesh",
        "city": "Nellore",
        "type": "State University",
        "website": "https://www.simhapuriuniv.ac.in",
        "fees_urls": [
            "https://www.simhapuriuniv.ac.in/admissions",
        ],
        "courses_urls": [
            "https://www.simhapuriuniv.ac.in/departments",
        ],
    },
    {
        "name": "Adikavi Nannaya University",
        "short_name": "AKNU",
        "state": "Andhra Pradesh",
        "city": "Rajamahendravaram",
        "type": "State University",
        "website": "https://www.aknu.edu.in",
        "fees_urls": [
            "https://www.aknu.edu.in/admissions",
        ],
        "courses_urls": [
            "https://www.aknu.edu.in/departments",
        ],
    },
    {
        "name": "Rayalaseema University",
        "short_name": "RU",
        "state": "Andhra Pradesh",
        "city": "Kurnool",
        "type": "State University",
        "website": "https://www.rayalaseemauniversity.ac.in",
        "fees_urls": [
            "https://www.rayalaseemauniversity.ac.in/admissions",
        ],
        "courses_urls": [
            "https://www.rayalaseemauniversity.ac.in/departments",
        ],
    },
    {
        "name": "SRM University AP",
        "short_name": "SRM AP",
        "state": "Andhra Pradesh",
        "city": "Amaravati",
        "type": "Private University",
        "website": "https://srmap.edu.in",
        "fees_urls": [
            "https://srmap.edu.in/admissions/fee-structure/",
        ],
        "courses_urls": [
            "https://srmap.edu.in/programmes/",
        ],
    },
    {
        "name": "VIT-AP University",
        "short_name": "VIT-AP",
        "state": "Andhra Pradesh",
        "city": "Amaravati",
        "type": "Private University",
        "website": "https://vitap.ac.in",
        "fees_urls": [
            "https://vitap.ac.in/admissions/fee-structure/",
        ],
        "courses_urls": [
            "https://vitap.ac.in/programmes/",
        ],
    },
    # === TELANGANA - DEEMED UNIVERSITIES ===
    {
        "name": "IIIT Hyderabad",
        "short_name": "IIIT-H",
        "state": "Telangana",
        "city": "Hyderabad",
        "type": "Deemed University",
        "website": "https://www.iiit.ac.in",
        "fees_urls": [
            "https://www.iiit.ac.in/admissions/",
        ],
        "courses_urls": [
            "https://www.iiit.ac.in/academics/",
        ],
    },
    {
        "name": "ICFAI Foundation for Higher Education",
        "short_name": "IFHE",
        "state": "Telangana",
        "city": "Hyderabad",
        "type": "Deemed University",
        "website": "https://www.ifheindia.org",
        "fees_urls": [
            "https://www.ifheindia.org/Admissions/Fee-Structure",
            "https://ibsindia.org/fee-structure/",
        ],
        "courses_urls": [
            "https://www.ifheindia.org/Programmes",
        ],
    },
    {
        "name": "NALSAR University of Law",
        "short_name": "NALSAR",
        "state": "Telangana",
        "city": "Hyderabad",
        "type": "State University",
        "website": "https://www.nalsar.ac.in",
        "fees_urls": [
            "https://www.nalsar.ac.in/admissions",
        ],
        "courses_urls": [
            "https://www.nalsar.ac.in/programmes",
        ],
    },
    # === TELANGANA - STATE / CENTRAL UNIVERSITIES ===
    {
        "name": "Osmania University",
        "short_name": "OU",
        "state": "Telangana",
        "city": "Hyderabad",
        "type": "State University",
        "website": "https://www.osmania.ac.in",
        "fees_urls": [
            "https://www.osmania.ac.in/admissions",
        ],
        "courses_urls": [
            "https://www.osmania.ac.in/Departments-list.php",
        ],
    },
    {
        "name": "Jawaharlal Nehru Technological University Hyderabad",
        "short_name": "JNTUH",
        "state": "Telangana",
        "city": "Hyderabad",
        "type": "State University",
        "website": "https://jntuh.ac.in",
        "fees_urls": [
            "https://jntuh.ac.in/admissions",
        ],
        "courses_urls": [
            "https://jntuh.ac.in/academics",
        ],
    },
    {
        "name": "Kakatiya University",
        "short_name": "KU",
        "state": "Telangana",
        "city": "Warangal",
        "type": "State University",
        "website": "https://www.kakatiya.ac.in",
        "fees_urls": [
            "https://www.kakatiya.ac.in/admissions.htm",
        ],
        "courses_urls": [
            "https://www.kakatiya.ac.in/departments.htm",
        ],
    },
    {
        "name": "Telangana University",
        "short_name": "TU",
        "state": "Telangana",
        "city": "Nizamabad",
        "type": "State University",
        "website": "https://www.telanganauniversity.ac.in",
        "fees_urls": [
            "https://www.telanganauniversity.ac.in/admissions",
        ],
        "courses_urls": [
            "https://www.telanganauniversity.ac.in/departments",
        ],
    },
    {
        "name": "Palamuru University",
        "short_name": "PU",
        "state": "Telangana",
        "city": "Mahbubnagar",
        "type": "State University",
        "website": "https://www.palamuruuniversity.ac.in",
        "fees_urls": [
            "https://www.palamuruuniversity.ac.in/admissions.php",
        ],
        "courses_urls": [
            "https://www.palamuruuniversity.ac.in/departments.php",
        ],
    },
    {
        "name": "Satavahana University",
        "short_name": "SU",
        "state": "Telangana",
        "city": "Karimnagar",
        "type": "State University",
        "website": "https://www.satavahana.ac.in",
        "fees_urls": [
            "https://www.satavahana.ac.in/admissions",
        ],
        "courses_urls": [
            "https://www.satavahana.ac.in/departments",
        ],
    },
    {
        "name": "Mahatma Gandhi University",
        "short_name": "MGU",
        "state": "Telangana",
        "city": "Nalgonda",
        "type": "State University",
        "website": "https://www.mguniversity.ac.in",
        "fees_urls": [
            "https://www.mguniversity.ac.in/admissions",
        ],
        "courses_urls": [
            "https://www.mguniversity.ac.in/departments",
        ],
    },
    {
        "name": "University of Hyderabad",
        "short_name": "UoH",
        "state": "Telangana",
        "city": "Hyderabad",
        "type": "Central University",
        "website": "https://uohyd.ac.in",
        "fees_urls": [
            "https://uohyd.ac.in/admissions/",
        ],
        "courses_urls": [
            "https://uohyd.ac.in/schools-departments/",
        ],
    },
    {
        "name": "English and Foreign Languages University",
        "short_name": "EFLU",
        "state": "Telangana",
        "city": "Hyderabad",
        "type": "Central University",
        "website": "https://www.efluniversity.ac.in",
        "fees_urls": [
            "https://www.efluniversity.ac.in/admissions",
        ],
        "courses_urls": [
            "https://www.efluniversity.ac.in/schools",
        ],
    },
    {
        "name": "Maulana Azad National Urdu University",
        "short_name": "MANUU",
        "state": "Telangana",
        "city": "Hyderabad",
        "type": "Central University",
        "website": "https://www.manuu.edu.in",
        "fees_urls": [
            "https://www.manuu.edu.in/admissions",
        ],
        "courses_urls": [
            "https://www.manuu.edu.in/schools-departments",
        ],
    },
]
