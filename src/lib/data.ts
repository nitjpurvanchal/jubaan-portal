export type CircuitSite = {
  slug: string;
  name: string;
  state: string;
  tagline: string;
  description: string;
  significance: string[];
  bestTime: string;
};

export const circuitSites: CircuitSite[] = [
  {
    slug: "bodh-gaya",
    name: "Bodh Gaya",
    state: "Bihar",
    tagline: "Where the Buddha attained enlightenment",
    description:
      "The spiritual heart of Buddhism. Under the Bodhi tree here, Prince Siddhartha became the Buddha over 2,500 years ago. The Mahabodhi Temple, a UNESCO World Heritage Site, rises beside the sacred tree, and monasteries from a dozen nations ring the town.",
    significance: [
      "Mahabodhi Temple — UNESCO World Heritage Site",
      "The Bodhi Tree — descendant of the original tree of enlightenment",
      "Great Buddha Statue and monasteries of many nations",
    ],
    bestTime: "October – March",
  },
  {
    slug: "sarnath",
    name: "Sarnath",
    state: "Uttar Pradesh",
    tagline: "Where the first sermon turned the Wheel of Dharma",
    description:
      "At the deer park of Sarnath, the Buddha delivered his first sermon — the Dhammacakkappavattana Sutta — setting the Wheel of Dharma in motion. Emperor Ashoka raised pillars and stupas here; the lion capital found at Sarnath is now India's national emblem.",
    significance: [
      "Dhamek Stupa — marking the spot of the first sermon",
      "Ashoka Pillar — its lion capital is India's national emblem",
      "Sarnath Archaeological Museum's famed Buddha sculptures",
    ],
    bestTime: "October – March",
  },
  {
    slug: "nalanda",
    name: "Nalanda",
    state: "Bihar",
    tagline: "The world's first residential university",
    description:
      "Nalanda Mahavihara drew ten thousand scholars from across Asia — from China to Persia — to study logic, medicine, astronomy and Buddhist philosophy. Its red-brick ruins and museum still whisper of a golden age of learning.",
    significance: [
      "Ruins of Nalanda Mahavihara — UNESCO World Heritage Site",
      "Nalanda Archaeological Museum",
      "Xuanzang Memorial Hall honouring the Chinese pilgrim-scholar",
    ],
    bestTime: "October – March",
  },
  {
    slug: "rajgir",
    name: "Rajgir",
    state: "Bihar",
    tagline: "The Buddha's retreat among five hills",
    description:
      "The ancient capital of Magadha, cradled by five hills. The Buddha spent many rainy seasons here, preached at Vulture's Peak (Gridhakuta), and King Bimbisara gifted him the Bamboo Grove — the first Buddhist monastery.",
    significance: [
      "Gridhakuta (Vulture's Peak) — the Buddha's favourite retreat",
      "Venuvana — the first monastery, gifted by King Bimbisara",
      "Vishwa Shanti Stupa atop Ratnagiri hill",
    ],
    bestTime: "October – March",
  },
  {
    slug: "vaishali",
    name: "Vaishali",
    state: "Bihar",
    tagline: "The world's earliest republic",
    description:
      "The Licchavi republic of Vaishali — often called the world's first republic — hosted the Buddha several times. He praised its democratic traditions, and here the order of nuns (Bhikkhuni Sangha) was founded with Mahapajapati Gotami.",
    significance: [
      "Ashokan pillar with its single lion capital",
      "Relic Stupa — among the earliest stupas ever built",
      "Birthplace of the Bhikkhuni Sangha",
    ],
    bestTime: "October – March",
  },
  {
    slug: "kesaria",
    name: "Kesaria",
    state: "Bihar",
    tagline: "The tallest Buddhist stupa in the world",
    description:
      "Rising 104 feet over the plains of East Champaran, the Kesaria Stupa is the tallest excavated Buddhist stupa anywhere — a towering brick mandala of terraces and niches that once held Buddha images.",
    significance: [
      "Tallest excavated Buddhist stupa in the world (104 ft)",
      "Believed to mark a spot where the Buddha rested",
      "Terraced architecture with hundreds of Buddha niches",
    ],
    bestTime: "October – March",
  },
  {
    slug: "kushinagar",
    name: "Kushinagar",
    state: "Uttar Pradesh",
    tagline: "Where the Buddha attained Mahaparinirvana",
    description:
      "In a quiet sal grove at Kushinagar, the Buddha passed into Mahaparinirvana. The reclining Buddha statue at the Mahaparinirvana Temple and the Ramabhar Stupa marking the cremation site draw pilgrims from every Buddhist nation.",
    significance: [
      "Mahaparinirvana Temple with the 6-metre reclining Buddha",
      "Ramabhar Stupa — the Buddha's cremation site",
      "Mathakuar Shrine — the Buddha's last sermon spot",
    ],
    bestTime: "October – March",
  },
  {
    slug: "shravasti",
    name: "Shravasti",
    state: "Uttar Pradesh",
    tagline: "Twenty-five rainy seasons of teaching",
    description:
      "Capital of the Kosala kingdom, where the Buddha spent 25 rainy seasons — more than anywhere else. The Jetavana monastery, gifted by the merchant Anathapindika, was the scene of many beloved discourses and the famous Twin Miracle.",
    significance: [
      "Jetavana Monastery — gifted by Anathapindika",
      "Anandabodhi tree — planted from the original Bodhi tree",
      "Scene of the Buddha's Twin Miracle",
    ],
    bestTime: "October – March",
  },
];

export type AnnualEvent = {
  title: string;
  date: string; // ISO
  flagship: boolean;
  note: string;
  image: string; // local path under /images/real/festivals
  attributionUrl: string; // Wikimedia Commons file page
};

export const annualEvents: AnnualEvent[] = [
  {
    title: "Club Introduction & Membership Drive",
    date: "2026-08-10",
    flagship: false,
    note: "Start of odd semester",
    image: "/images/real/festivals/club-introduction.jpg",
    attributionUrl: "https://commons.wikimedia.org/wiki/File:Folk_Performance_in_St_Aloysius_University_27.jpg",
  },
  {
    title: "Santhal Movement — Heritage Session",
    date: "2026-08-24",
    flagship: false,
    note: "Tribal resistance & culture",
    image: "/images/real/festivals/santhal-movement.jpg",
    attributionUrl: "https://commons.wikimedia.org/wiki/File:Baha_Dance_by_Santhal_tribe.jpg",
  },
  {
    title: "Ramdhari Singh Dinkar Jayanti",
    date: "2026-09-23",
    flagship: false,
    note: "Poetry & literary session",
    image: "/images/real/festivals/ramdhari-singh-dinkar.jpg",
    attributionUrl: "https://commons.wikimedia.org/wiki/File:Ramdhari_Singh_Dinkar_1999_stamp_of_India.jpg",
  },
  {
    title: "Jayprakash Narayan Jayanti",
    date: "2026-10-11",
    flagship: false,
    note: "Talks & discussions",
    image: "/images/real/festivals/jayprakash-narayan.jpg",
    attributionUrl: "https://commons.wikimedia.org/wiki/File:Jayaprakash_Narayan_2001_stamp_of_India.jpg",
  },
  {
    title: "Navratri & Ramleela",
    date: "2026-10-20",
    flagship: true,
    note: "Sita–Ram Vivah themed drama",
    image: "/images/real/festivals/navratri-ramleela.jpg",
    attributionUrl: "https://commons.wikimedia.org/wiki/File:A_rasa_garba_dandiya_dance,_Navratri_tradition.jpg",
  },
  {
    title: "Chhath Puja — Heritage Evening",
    date: "2026-11-15",
    flagship: true,
    note: "Chhath season",
    image: "/images/real/festivals/chhath-puja.jpg",
    attributionUrl: "https://commons.wikimedia.org/wiki/File:Offering_to_Sun_God_-_Chhath_Puja_Ceremony_-_Baja_Kadamtala_Ghat_-_Kolkata_2013-11-09_4264.JPG",
  },
  {
    title: "Jharkhand Foundation Day",
    date: "2026-11-15",
    flagship: true,
    note: "Tribal art, music & dance",
    image: "/images/real/festivals/jharkhand-foundation-day.jpg",
    attributionUrl: "https://commons.wikimedia.org/wiki/File:Santhal_tribes_dancing_in_BAHA_PARAB_(Sarhul_festival).jpg",
  },
  {
    title: "Janjatiya Gaurav Diwas / Birsa Munda Day",
    date: "2026-11-15",
    flagship: true,
    note: "Tribal heritage tribute",
    image: "/images/real/festivals/janjatiya-gaurav-diwas.jpg",
    attributionUrl: "https://commons.wikimedia.org/wiki/File:Birsa_Munda_Statue_at_Naya_More.jpg",
  },
  {
    title: "Dev Deepawali",
    date: "2026-11-25",
    flagship: false,
    note: "Lamps, rangoli & folk songs",
    image: "/images/real/festivals/dev-deepawali.jpg",
    attributionUrl: "https://commons.wikimedia.org/wiki/File:Ghats_of_Varanasi_Getting_ready_for_Dev_Deepawali_03.jpg",
  },
  {
    title: "Good Governance Day / Atal Bihari Vajpayee Jayanti",
    date: "2026-12-25",
    flagship: false,
    note: "Governance & leadership",
    image: "/images/real/festivals/atal-bihari-vajpayee.jpg",
    attributionUrl: "https://commons.wikimedia.org/wiki/File:Atal_Bihari_Vajpayee_2002-06-12.jpg",
  },
  {
    title: "Makar Sankranti Celebration",
    date: "2027-01-14",
    flagship: false,
    note: "Harvest traditions",
    image: "/images/real/festivals/makar-sankranti.jpg",
    attributionUrl: "https://commons.wikimedia.org/wiki/File:Kite_Festival_in_India.jpg",
  },
  {
    title: "Karpoori Thakur Jayanti",
    date: "2027-01-24",
    flagship: false,
    note: "Social-justice leader",
    image: "/images/real/festivals/karpoori-thakur.jpg",
    attributionUrl: "https://commons.wikimedia.org/wiki/File:Karpoori_Thakur_1991_stamp_of_India.jpg",
  },
  {
    title: "Bhasha Sangam",
    date: "2027-02-12",
    flagship: false,
    note: "Bhojpuri · Maithili · Magahi · Awadhi · Hindi",
    image: "/images/real/festivals/bhasha-sangam.jpg",
    attributionUrl: "https://commons.wikimedia.org/wiki/File:1500-1200_BCE,_Vivaha_sukta,_Rigveda_10.85.16-27,_Sanskrit,_Devanagari,_manuscript_page.jpg",
  },
  {
    title: "Braj Mahotsav — Holi Milan Samaroh",
    date: "2027-03-15",
    flagship: true,
    note: "Holi season",
    image: "/images/real/festivals/braj-mahotsav-holi.jpg",
    attributionUrl: "https://commons.wikimedia.org/wiki/File:Lathmar_Holi_2022_in_Nandgaon,_Uttar_Pradesh_(edited).jpg",
  },
  {
    title: "Bihar Diwas",
    date: "2027-03-22",
    flagship: true,
    note: "Bihar's history, art & traditions",
    image: "/images/real/festivals/bihar-diwas.jpg",
    attributionUrl: "https://commons.wikimedia.org/wiki/File:The_Vice_President%2C_Shri_M._Venkaiah_Naidu_lighting_the_lamp_to_inaugurate_the_106th_Bihar_Diwas_Celebrations_and_closing_ceremony_of_Champaran_Satyagrah_Centenary_Year%2C_Bihar.jpg",
  },
  {
    title: "Food Fest",
    date: "2027-04-10",
    flagship: true,
    note: "UP + Bihar + Jharkhand food & heritage",
    image: "/images/real/festivals/food-fest.jpg",
    attributionUrl: "https://commons.wikimedia.org/wiki/File:'7'_An_Eastern_Indian_Thali,_traditional_style_of_serving_food_in_India.jpg",
  },
  {
    title: "Mithila Mahotsav",
    date: "2027-04-24",
    flagship: false,
    note: "Maithili songs & Mithila painting",
    image: "/images/real/festivals/mithila-mahotsav.jpg",
    attributionUrl: "https://commons.wikimedia.org/wiki/File:Dilli_Haat_Madhubani_Mithila_Painting_Artist.jpg",
  },
  {
    title: "Year-End Cultural Showcase",
    date: "2027-05-08",
    flagship: false,
    note: "Closing showcase",
    image: "/images/real/festivals/year-end-cultural-showcase.jpg",
    attributionUrl: "https://commons.wikimedia.org/wiki/File:A_Vibrant_Bharatanatyam_Group_Interpretation.jpg",
  },
];
