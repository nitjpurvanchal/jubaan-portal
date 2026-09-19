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
};

export const annualEvents: AnnualEvent[] = [
  { title: "Club Introduction & Membership Drive", date: "2026-08-10", flagship: false, note: "Start of odd semester" },
  { title: "Santhal Movement — Heritage Session", date: "2026-08-24", flagship: false, note: "Tribal resistance & culture" },
  { title: "Ramdhari Singh Dinkar Jayanti", date: "2026-09-23", flagship: false, note: "Poetry & literary session" },
  { title: "Jayprakash Narayan Jayanti", date: "2026-10-11", flagship: false, note: "Talks & discussions" },
  { title: "Navratri & Ramleela", date: "2026-10-20", flagship: true, note: "Sita–Ram Vivah themed drama" },
  { title: "Chhath Puja — Heritage Evening", date: "2026-11-15", flagship: true, note: "Chhath season" },
  { title: "Jharkhand Foundation Day", date: "2026-11-15", flagship: true, note: "Tribal art, music & dance" },
  { title: "Janjatiya Gaurav Diwas / Birsa Munda Day", date: "2026-11-15", flagship: true, note: "Tribal heritage tribute" },
  { title: "Dev Deepawali", date: "2026-11-25", flagship: false, note: "Lamps, rangoli & folk songs" },
  { title: "Good Governance Day / Atal Bihari Vajpayee Jayanti", date: "2026-12-25", flagship: false, note: "Governance & leadership" },
  { title: "Makar Sankranti Celebration", date: "2027-01-14", flagship: false, note: "Harvest traditions" },
  { title: "Karpoori Thakur Jayanti", date: "2027-01-24", flagship: false, note: "Social-justice leader" },
  { title: "Bhasha Sangam", date: "2027-02-12", flagship: false, note: "Bhojpuri · Maithili · Magahi · Awadhi · Hindi" },
  { title: "Braj Mahotsav — Holi Milan Samaroh", date: "2027-03-15", flagship: true, note: "Holi season" },
  { title: "Bihar Diwas", date: "2027-03-22", flagship: true, note: "Bihar's history, art & traditions" },
  { title: "Food Fest", date: "2027-04-10", flagship: true, note: "UP + Bihar + Jharkhand food & heritage" },
  { title: "Mithila Mahotsav", date: "2027-04-24", flagship: false, note: "Maithili songs & Mithila painting" },
  { title: "Year-End Cultural Showcase", date: "2027-05-08", flagship: false, note: "Closing showcase" },
];
