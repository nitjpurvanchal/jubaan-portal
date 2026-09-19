export type Legend = {
  name: string;
  state: "Bihar" | "Uttar Pradesh" | "Jharkhand";
  year: number | null;
  field: string;
  lifespan: string;
  image: string;
  attributionUrl: string;
  credit: string;
  bio: string;
  posthumous?: boolean;
  honorary?: boolean;
};

export const legends: Legend[] = [
  {
    name: "Dr. Rajendra Prasad",
    state: "Bihar",
    year: 1962,
    field: "Public Affairs",
    lifespan: "1884 – 1963",
    image: "/images/legends/rajendra-prasad.jpg",
    attributionUrl:
      "https://commons.wikimedia.org/wiki/File:Rajendra_Prasad_(Indian_President),_signed_image_for_Walter_Nash_(NZ_Prime_Minister),_1958_(16017609534).jpg",
    credit: "Wikimedia Commons",
    bio: "Born in Zeradei, Siwan, Rajendra Prasad was a lawyer, journalist and president of the Indian National Congress who spent years in British jails during the freedom movement. He became the first President of the Republic of India (1950–1962), guiding the young nation with quiet, scholarly dignity. Bihar's first Bharat Ratna, awarded in 1962.",
  },
  {
    name: "Jayaprakash Narayan",
    state: "Bihar",
    year: 1999,
    field: "Public Affairs",
    lifespan: "1902 – 1979",
    image: "/images/legends/jayaprakash-narayan.jpg",
    attributionUrl:
      "https://commons.wikimedia.org/wiki/File:Jawaharlal_Nehru_with_Jayaprakash_Narayan_Crop.jpg",
    credit: "Wikimedia Commons",
    bio: "Born in Sitab Diara, the man the people called Loknayak moved from freedom fighter to socialist thinker to moral conscience of the nation. His 1974 call for Sampoorna Kranti — Total Revolution — ignited a student movement that reshaped Indian democracy. Awarded the Bharat Ratna posthumously in 1999.",
    posthumous: true,
  },
  {
    name: "Ustad Bismillah Khan",
    state: "Bihar",
    year: 2001,
    field: "Art — Music",
    lifespan: "1916 – 2006",
    image: "/images/legends/bismillah-khan.jpg",
    attributionUrl: "https://commons.wikimedia.org/wiki/File:Bismillah_Khan.jpg",
    credit: "Wikimedia Commons",
    bio: "Born in Dumraon, Bihar, Bismillah Khan lifted the shehnai from wedding courtyards to the concert stage and made it sing the great ragas. He played at the Red Fort on the eve of Independence and at Delhi's Republic Day for decades, making Varanasi his lifelong home. Bharat Ratna, 2001.",
  },
  {
    name: "Karpoori Thakur",
    state: "Bihar",
    year: 2024,
    field: "Public Affairs",
    lifespan: "1924 – 1988",
    image: "/images/legends/karpoori-thakur.jpg",
    attributionUrl:
      "https://commons.wikimedia.org/wiki/File:Karpoori_Thakur_2024_stamp_of_India.jpg",
    credit: "India Post centenary stamp, via Wikimedia Commons",
    bio: "A village schoolteacher from Samastipur who became Bihar's Chief Minister twice, Karpoori Thakur was called Jannayak — leader of the people. In 1978 he pioneered reservations for backward classes in government jobs, a formula that reshaped social justice politics. Announced for the Bharat Ratna in January 2024, awarded posthumously.",
    posthumous: true,
  },
  {
    name: "Dr. Bhagwan Das",
    state: "Uttar Pradesh",
    year: 1955,
    field: "Literature & Education",
    lifespan: "1869 – 1958",
    image: "/images/legends/bhagwan-das.jpg",
    attributionUrl:
      "https://commons.wikimedia.org/wiki/File:Bhagwan_Das_1969_stamp_of_India_(cropped).jpg",
    credit: "India Post stamp, via Wikimedia Commons",
    bio: "Born in Varanasi, Bhagwan Das was a theosophist, philosopher and educationist who co-founded the Kashi Vidyapith and helped make Banaras a modern centre of learning. His writings on Indian philosophy and social reform bridged ancient thought and the freedom era. Bharat Ratna, 1955.",
  },
  {
    name: "Jawaharlal Nehru",
    state: "Uttar Pradesh",
    year: 1955,
    field: "Public Affairs",
    lifespan: "1889 – 1964",
    image: "/images/legends/jawaharlal-nehru.jpg",
    attributionUrl:
      "https://commons.wikimedia.org/wiki/File:Nehru_in_the_Netherlands,_1957.jpg",
    credit: "Wikimedia Commons",
    bio: "Born in Allahabad, Nehru was the central figure of the freedom movement's final decades and independent India's first Prime Minister (1947–1964). He built the republic's democratic institutions and gave it the vocabulary of scientific temper and non-alignment. Bharat Ratna, 1955.",
  },
  {
    name: "Govind Ballabh Pant",
    state: "Uttar Pradesh",
    year: 1957,
    field: "Public Affairs",
    lifespan: "1887 – 1961",
    image: "/images/legends/govind-ballabh-pant.jpg",
    attributionUrl:
      "https://commons.wikimedia.org/wiki/File:Pandit_Govind_Ballabh_Pant.jpg",
    credit: "Wikimedia Commons",
    bio: "Born in the hills of present-day Uttarakhand, then part of the United Provinces, Pant became the first Chief Minister of Uttar Pradesh and later the Union Home Minister. A freedom fighter of formidable administrative gifts, he helped knit the new republic together. Bharat Ratna, 1957.",
  },
  {
    name: "Purushottam Das Tandon",
    state: "Uttar Pradesh",
    year: 1961,
    field: "Public Affairs",
    lifespan: "1882 – 1962",
    image: "/images/legends/purushottam-das-tandon.jpg",
    attributionUrl:
      "https://commons.wikimedia.org/wiki/File:Purushottam_Das_Tandon_1982_stamp_of_India.jpg",
    credit: "India Post stamp, via Wikimedia Commons",
    bio: "Born in Allahabad and honoured as Rajarshi for his austere public life, Tandon served as Speaker of the United Provinces Legislative Assembly. He was among Hindi's most steadfast champions in public life. Bharat Ratna, 1961.",
  },
  {
    name: "Lal Bahadur Shastri",
    state: "Uttar Pradesh",
    year: 1966,
    field: "Public Affairs",
    lifespan: "1904 – 1966",
    image: "/images/legends/lal-bahadur-shastri.jpg",
    attributionUrl:
      "https://commons.wikimedia.org/wiki/File:Lal_Bahadur_Shastri_(cropped).jpg",
    credit: "Wikimedia Commons",
    bio: "Born in Mughalsarai, Shastri rose from humble beginnings to become India's second Prime Minister. He led the nation through the 1965 war with the immortal call 'Jai Jawan, Jai Kisan', and died in Tashkent hours after signing the peace accord. The first posthumous Bharat Ratna, 1966.",
    posthumous: true,
  },
  {
    name: "Indira Gandhi",
    state: "Uttar Pradesh",
    year: 1971,
    field: "Public Affairs",
    lifespan: "1917 – 1984",
    image: "/images/legends/indira-gandhi.jpg",
    attributionUrl:
      "https://commons.wikimedia.org/wiki/File:Indira_Gandhi_official_portrait.png",
    credit: "Wikimedia Commons",
    bio: "Born in Allahabad, Indira Gandhi became India's first woman Prime Minister and one of the most consequential leaders of the 20th century. She steered India through the 1971 war and the Green Revolution years that transformed its farms. Bharat Ratna, 1971.",
  },
  {
    name: "Pandit Ravi Shankar",
    state: "Uttar Pradesh",
    year: 1999,
    field: "Art — Music",
    lifespan: "1920 – 2012",
    image: "/images/legends/ravi-shankar.jpg",
    attributionUrl: "https://commons.wikimedia.org/wiki/File:Ravi_Shankar.jpg",
    credit: "Wikimedia Commons",
    bio: "Born in Varanasi, Ravi Shankar carried the sitar from Banaras to the world's great stages — Monterey, Woodstock, the Concert for Bangladesh — becoming Indian classical music's most beloved global ambassador. Bharat Ratna, 1999.",
  },
  {
    name: "Madan Mohan Malaviya",
    state: "Uttar Pradesh",
    year: 2015,
    field: "Education",
    lifespan: "1861 – 1946",
    image: "/images/legends/madan-mohan-malaviya.jpg",
    attributionUrl:
      "https://commons.wikimedia.org/wiki/File:Mahamana_Madan_Mohan_Malaviya_ji_Smiling.jpg",
    credit: "Wikimedia Commons",
    bio: "Born in Allahabad, Mahamana Malaviya was a scholar, journalist and educationist who founded the Banaras Hindu University in 1916 — giving modern India one of its greatest institutions of learning. Awarded the Bharat Ratna posthumously in 2015.",
    posthumous: true,
  },
  {
    name: "Chaudhary Charan Singh",
    state: "Uttar Pradesh",
    year: 2024,
    field: "Public Affairs",
    lifespan: "1902 – 1987",
    image: "/images/legends/charan-singh.jpg",
    attributionUrl:
      "https://commons.wikimedia.org/wiki/File:Charan_Singh_Portrait.jpg",
    credit: "Wikimedia Commons",
    bio: "Born in Noorpur, Meerut district, Charan Singh was the farmer's leader — a champion of land reforms who became Prime Minister in 1979. His politics kept the dignity of the kisan at the centre of the republic's concerns. Bharat Ratna, 2024, awarded posthumously.",
    posthumous: true,
  },
  {
    name: "Birsa Munda",
    state: "Jharkhand",
    year: null,
    field: "Freedom Struggle",
    lifespan: "1875 – 1900",
    image: "/images/legends/birsa-munda.jpg",
    attributionUrl:
      "https://commons.wikimedia.org/wiki/File:Birsa_Munda,_photograph_in_Roy_(1912-72).JPG",
    credit: "Wikimedia Commons",
    bio: "Born in Ulihatu, Birsa Munda led the Ulgulan — the Great Tumult — against British rule and the exploitation of tribal land. He died in Ranchi jail in 1900, aged just 24, and became Dharti Aaba to his people; his birth anniversary is observed as Janjatiya Gaurav Diwas. Honoured here as Jharkhand's revered icon — he is not a Bharat Ratna recipient, and no Bharat Ratna has yet been conferred on anyone from Jharkhand.",
    honorary: true,
  },
];

export const legendStates = ["Bihar", "Uttar Pradesh", "Jharkhand"] as const;
