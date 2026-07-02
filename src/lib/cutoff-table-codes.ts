/**
 * GENERATED — college codes that have at least one entry in the historical
 * cutoff tables (AP_CUTOFFS / TS_CUTOFFS). This is the *client-safe* twin of
 * `CUTOFF_DATA_CODES` in cutoff-presence.ts: it lists just the codes without
 * importing the multi-MB tables, so modules that are pulled into client
 * bundles (e.g. comparison-pairs.ts via /compare) can be table-aware.
 *
 * Regenerate whenever ap-cutoffs.ts / ts-cutoffs.ts gain or lose colleges:
 *   python3 -c "import re;codes=sorted({m for f in ['src/lib/ap-cutoffs.ts','src/lib/ts-cutoffs.ts'] for m in re.findall(r'\"([A-Z][A-Z0-9]*)\":\{\"20', open(f).read())});print(len(codes))"
 * (or re-run the generation snippet in the repo history for this file).
 */
export const CUTOFF_TABLE_CODES: ReadonlySet<string> = new Set<string>([
  "AARM", "ABRK", "ACEE", "ACEG", "ACEM", "ACET", "ACPS", "ADIT", "ADTP", "AECN", "AITH", "AITK",
  "AITS", "AITT", "AKIT", "ALIT", "ALTS", "AMRN", "ANCUSF", "ANIL", "ANMB", "ANRK", "ANRP", "ANSN",
  "ANUG", "ANURSF", "APCS", "APUCPU", "ARJN", "ARTB", "ARYA", "ASIP", "ASKW", "ASKWOC", "ASRA", "ASTC",
  "ASVR", "AUCE", "AUCESF", "AUCP", "AUCPSF", "AUEWSF", "AURC", "AURG", "AURH", "AURK", "AVEN", "AVEV",
  "AVHP", "AVIH", "AVNI", "BABA", "BALA", "BCET", "BCOP", "BECB", "BEMA", "BESTPU", "BIET", "BIPS",
  "BIPT", "BITL", "BITN", "BITS", "BLMP", "BNPW", "BOMA", "BOMP", "BOSE", "BPCP", "BRAUSF", "BREW",
  "BRIG", "BRIL", "BRNK", "BRWN", "BSKR", "BVCE", "BVCR", "BVRI", "BVRM", "BVRW", "BVSR", "BVTS",
  "BWEC", "CABP", "CAMS", "CARE", "CASR", "CBCP", "CBIT", "CCVY", "CDTK", "CECC", "CENUPU", "CEVP",
  "CFSB", "CFSP", "CFSR", "CHBR", "CHDL", "CHET", "CHKN", "CHTN", "CHTP", "CHTS", "CIET", "CIPH",
  "CITY", "CLPT", "CMRG", "CMRK", "CMRM", "CMRN", "CMRP", "CRIT", "CRRE", "CRRP", "CVMP", "CVRH",
  "CVRT", "CVSR", "CVST", "DARE", "DHAN", "DIET", "DIPS", "DJRC", "DLBC", "DNRE", "DNVP", "DRKC",
  "DRKI", "DSIT", "ELEN", "ELRU", "ESUT", "ESWR", "GATE", "GATP", "GBCP", "GBNP", "GCPK", "GCTC",
  "GDLV", "GECG", "GGIB", "GGURPU", "GIER", "GIET", "GITS", "GJCP", "GKCS", "GKEM", "GLND", "GLOB",
  "GLWC", "GMRI", "GNIT", "GNPT", "GNTW", "GPRE", "GPRP", "GRCP", "GRRR", "GTMW", "GTNN", "GURU",
  "GVIC", "GVPE", "GVPT", "GVPW", "GVRS", "HIND", "HIPS", "HITE", "HITM", "HMIP", "HOLY", "IARE",
  "IDEL", "IITM", "IITT", "INDI", "INDP", "INDU", "ISTS", "ISTSOC", "JANG", "JAYA", "JBCP", "JBIT",
  "JCPN", "JIPS", "JJPM", "JMIP", "JMTS", "JNKFSF", "JNKPSF", "JNKR", "JNMB", "JNPASF", "JNPL", "JNTA",
  "JNTC", "JNTH", "JNTHMT", "JNTHSF", "JNTK", "JNTKSF", "JNTKSS", "JNTM", "JNTN", "JNTP", "JNTPH", "JNTPSF",
  "JNTR", "JNTS", "JNTV", "JNWN", "JNYP", "JOGI", "JONY", "JPNE", "KCEA", "KCIT", "KDDW", "KGRH",
  "KGRR", "KHIT", "KHMP", "KIEK", "KIET", "KIEW", "KISR", "KITG", "KITS", "KITW", "KLMW", "KLRT",
  "KMCE", "KMEC", "KMIT", "KMMT", "KMTS", "KNRR", "KORM", "KPRC", "KPRT", "KRCP", "KRUESF", "KRUP",
  "KSGI", "KSRM", "KTKM", "KTSP", "KUCE", "KUCESF", "KUCP", "KUEWSF", "KUPM", "KUWL", "KVKP", "KVSP",
  "KVSR", "LBCE", "LENO", "LIET", "LIMT", "LOYL", "MAMN", "MAMW", "MAXP", "MBUTPU", "MDRK", "MDRP",
  "MECS", "METH", "MGHA", "MGIT", "MGUNSF", "MHRJ", "MHVR", "MICT", "MIET", "MINA", "MIPK", "MIPM",
  "MITS", "MJRT", "MLEW", "MLID", "MLRD", "MLRP", "MLRS", "MNRP", "MNRT", "MOTK", "MOTP", "MPLG",
  "MRCE", "MRCL", "MRCP", "MRCW", "MREC", "MREM", "MREW", "MRIP", "MRIT", "MRPC", "MRTN", "MSEW",
  "MTEC", "MTIE", "MTPG", "MVRG", "MVRS", "MVSR", "NARN", "NBKR", "NCOP", "NEWS", "NEWT", "NGIT",
  "NGMA", "NICP", "NIET", "NIPH", "NIST", "NNRG", "NRCM", "NREC", "NRIA", "NRIT", "NRML", "NRNG",
  "NSPE", "NSRE", "NSRT", "NTJP", "NVRT", "OMGP", "OUCE", "OUCESF", "OUCT", "OUCTSF", "PACE", "PALV",
  "PATH", "PCEK", "PCOP", "PETW", "PIIT", "PINN", "PIPS", "PITT", "PITW", "PKSK", "PLMU", "PNRP",
  "PPDV", "PPSV", "PRAG", "PREC", "PRIK", "PRIW", "PSCV", "PUCE", "PULI", "PURD", "PVKK", "PVKKOC",
  "PYDE", "QISE", "QISP", "RAGU", "RAVW", "RBVW", "RCEE", "RGAN", "RGIT", "RIET", "RITW", "RKCE",
  "RPRA", "RSRN", "RUCESF", "RVIT", "RVJC", "SAIS", "SANK", "SASI", "SATS", "SAVE", "SAVEOC", "SBIT",
  "SCIT", "SCPB", "SCTP", "SDCP", "SDES", "SDEW", "SDGI", "SDIP", "SDTN", "SEAT", "SGEC", "SGIT",
  "SGVP", "SHIP", "SIEI", "SIEN", "SIMH", "SIPC", "SISG", "SIST", "SKIH", "SKUASF", "SMPS", "SMSK",
  "SNIS", "SNTI", "SNVM", "SPCN", "SPEC", "SPHN", "SPKG", "SPLP", "SPMUSF", "SPOP", "SRCP", "SREC",
  "SREE", "SRET", "SRHP", "SRIN", "SRIP", "SRIT", "SRIW", "SRKI", "SRKR", "SRMUPU", "SRSP", "SRSR",
  "SRTS", "SRYS", "SSCC", "SSCE", "SSJP", "SSRP", "SSSE", "STLW", "STMV", "SUCE", "SUNL", "SVCE",
  "SVCK", "SVCN", "SVCP", "SVCT", "SVEP", "SVES", "SVET", "SVHE", "SVHU", "SVIK", "SVIP", "SVIT",
  "SVNP", "SVPP", "SVSE", "SVSP", "SVUC", "SVUCSS", "SWRN", "TALP", "TCEK", "TCTK", "TECH", "TEJA",
  "TKEM", "TKRC", "TKRP", "TMLN", "TMLP", "TPCE", "TPCP", "TRNP", "TRPM", "TRRM", "TUCE", "UCPB",
  "UNIV", "URCE", "VAGE", "VAGP", "VASV", "VBIT", "VCET", "VCOP", "VCPG", "VCPN", "VCTN", "VEMU",
  "VETS", "VGNP", "VGNT", "VGPC", "VGSE", "VGSP", "VGTN", "VGWL", "VHNI", "VIEW", "VIPN", "VIPS",
  "VISA", "VISM", "VISW", "VITAPU", "VITAPUMT", "VITB", "VITK", "VITS", "VITW", "VIVP", "VJAM", "VJEC",
  "VJIT", "VJYA", "VJYH", "VKAS", "VKSP", "VLIT", "VMEG", "VMRH", "VMTW", "VNIP", "VNIW", "VNRC",
  "VPCV", "VPRG", "VPWL", "VREC", "VRIT", "VRSE", "VRSP", "VSLP", "VSMR", "VSNU", "VSPT", "VSVT",
  "VVGV", "VVIP", "VVIT", "VVKN", "WISE", "WITS", "WSTM", "YGVU", "YSRA",
]);
