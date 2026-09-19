export type HeritageSite = {
  name: string;
  state: "Bihar" | "Uttar Pradesh" | "Jharkhand";
  location: string;
  image: string;
  attributionUrl: string;
  designation?: string;
  description: string;
  bestTime: string;
};

export const heritageSites: HeritageSite[] = [
  // ------------------------------ BIHAR ------------------------------
  {
    name: "Barabar Caves",
    image: "/images/real/heritage/barabar-caves.jpg",
    attributionUrl: "https://commons.wikimedia.org/wiki/File:Barabar_hill_with_Sudama_and_Lomas_Rishi_caves.jpg",
    state: "Bihar",
    location: "Jehanabad district",
    designation: "Mauryan · 3rd century BCE",
    description:
      "India's oldest surviving rock-cut caves, carved for Ajivika ascetics in the reign of Ashoka. The Lomas Rishi cave's carved chaitya arch — a wooden hut frozen in stone — is where Indian rock architecture begins.",
    bestTime: "October – March",
  },
  {
    name: "Tomb of Sher Shah Suri",
    image: "/images/real/heritage/tomb-of-sher-shah-suri.jpg",
    attributionUrl: "https://commons.wikimedia.org/wiki/File:Sher_Shah_Suri_Tomb.jpg",
    state: "Bihar",
    location: "Sasaram",
    designation: "16th century",
    description:
      "The second Afghan emperor of India rests in a majestic three-storey mausoleum rising from the middle of a lake. Its Indo-Islamic domes and chhatris made Sasaram briefly the architectural capital of an empire.",
    bestTime: "October – March",
  },
  {
    name: "Vikramshila",
    image: "/images/real/heritage/vikramshila.jpg",
    attributionUrl: "https://commons.wikimedia.org/wiki/File:Vikramshila_Mahavihara.jpg",
    state: "Bihar",
    location: "Near Bhagalpur",
    designation: "Pala era · 8th–9th century",
    description:
      "Founded by the Pala king Dharmapala, Vikramshila was one of the two great mahaviharas of ancient India alongside Nalanda, drawing scholars from Tibet and Southeast Asia. Excavated stupas and monastery cells still trace its cruciform plan.",
    bestTime: "October – March",
  },
  {
    name: "Golghar",
    image: "/images/real/heritage/golghar.jpg",
    attributionUrl: "https://commons.wikimedia.org/wiki/File:Golghar,_Patna,_Bihar.jpg",
    state: "Bihar",
    location: "Patna",
    designation: "1786",
    description:
      "A giant beehive of brick rising 29 metres over Patna — a granary built by Captain John Garstin after the famine of 1770, meant to hold grain against the next hunger. Its twin spiral staircases were designed so workers could climb one side and descend the other, never crossing.",
    bestTime: "October – March",
  },
  {
    name: "Kumhrar",
    image: "/images/real/heritage/kumhrar.jpg",
    attributionUrl: "https://commons.wikimedia.org/wiki/File:Kumhrar_-_Patna_(1).jpg",
    state: "Bihar",
    location: "Patna",
    designation: "Mauryan · 3rd century BCE",
    description:
      "The archaeological remains of Pataliputra, Ashoka's capital — including the famed 80-pillared hall of the Mauryan palace. The exquisite Didarganj Yakshi was found near here, proof of the city's ancient artistry.",
    bestTime: "October – March",
  },
  // --------------------------- UTTAR PRADESH ---------------------------
  {
    name: "Taj Mahal",
    image: "/images/real/heritage/taj-mahal.jpg",
    attributionUrl: "https://commons.wikimedia.org/wiki/File:Taj_Mahal,_Agra,_India_edit2.jpg",
    state: "Uttar Pradesh",
    location: "Agra",
    designation: "UNESCO World Heritage Site",
    description:
      "Shah Jahan's ivory-white marble mausoleum for Mumtaz Mahal (1632–1653) — the monument the world knows India by. Its perfect symmetry, pietra dura inlay and changing moods of marble remain unmatched.",
    bestTime: "October – March",
  },
  {
    name: "Agra Fort",
    image: "/images/real/heritage/agra-fort.jpg",
    attributionUrl: "https://commons.wikimedia.org/wiki/File:Agra_03-2016_14_Agra_Fort.jpg",
    state: "Uttar Pradesh",
    location: "Agra",
    designation: "UNESCO World Heritage Site",
    description:
      "Akbar's great red-sandstone fortress (1565), later crowned with Shah Jahan's marble palaces — the Khas Mahal, Sheesh Mahal and the Musamman Burj from which the emperor gazed at the Taj. Three centuries of Mughal power in one walled city.",
    bestTime: "October – March",
  },
  {
    name: "Fatehpur Sikri",
    image: "/images/real/heritage/fatehpur-sikri.jpg",
    attributionUrl: "https://commons.wikimedia.org/wiki/File:Panch_Mahal-Fatehpur-Fatehpur_Sikri_India0014.JPG",
    state: "Uttar Pradesh",
    location: "Near Agra",
    designation: "UNESCO World Heritage Site",
    description:
      "Akbar's deserted capital of 1571 — a ghost city of red sandstone where the Buland Darwaza, Jama Masjid and the white-marble dargah of Salim Chishti stand in breathtaking preservation. An empire's dream, abandoned within a generation.",
    bestTime: "October – March",
  },
  {
    name: "Varanasi Ghats",
    image: "/images/real/heritage/varanasi-ghats.jpg",
    attributionUrl: "https://commons.wikimedia.org/wiki/File:Varanasi,_India,_Ghats_on_Ganges_River.jpg",
    state: "Uttar Pradesh",
    location: "Varanasi",
    designation: "Living heritage",
    description:
      "Eighty-four ghats staircasing down to the Ganga in one of the world's oldest living cities — Dashashwamedh's evening aarti, Manikarnika's eternal flames, and dawn boats drifting past palaces. Kashi is less a place than a continuous prayer.",
    bestTime: "October – March (Dev Deepawali in November)",
  },
  {
    name: "Bara Imambara",
    image: "/images/real/heritage/bara-imambara.jpg",
    attributionUrl: "https://commons.wikimedia.org/wiki/File:Bara_Imambara_Lucknow.jpg",
    state: "Uttar Pradesh",
    location: "Lucknow",
    designation: "1784",
    description:
      "Built by Nawab Asaf-ud-Daula as famine relief, the Bara Imambara holds one of the world's largest arched halls built without a single pillar — and above it the famous Bhool Bhulaiya, a labyrinth of a thousand passages. Awadh's genius in brick and lime.",
    bestTime: "October – March",
  },
  {
    name: "Ayodhya",
    image: "/images/real/heritage/ayodhya.jpg",
    attributionUrl: "https://commons.wikimedia.org/wiki/File:Ram_Janmbhoomi_Mandir,_Ayodhya_Dham.jpg",
    state: "Uttar Pradesh",
    location: "Ayodhya",
    designation: "Living heritage",
    description:
      "The ancient city of the Ramayana on the Saryu — reborn as a great pilgrimage centre with the Ram Mandir consecrated in January 2024. Its Deepotsav, when lakhs of diyas light the ghats, has entered the record books.",
    bestTime: "October – March",
  },
  // ----------------------------- JHARKHAND -----------------------------
  {
    name: "Maluti Temples",
    image: "/images/real/heritage/maluti-temples.jpg",
    attributionUrl: "https://commons.wikimedia.org/wiki/File:Maluti_Temples._Maluti.jpg",
    state: "Jharkhand",
    location: "Dumka district",
    designation: "17th–19th century",
    description:
      "Seventy-two surviving terracotta temples (of 108) built by the Baj Basanta dynasty — a 'Gupta Kashi' hidden in Santhal Pargana. Their baked-clay walls narrate the Ramayana and scenes of tribal life in exquisite relief.",
    bestTime: "October – March",
  },
  {
    name: "Jonha & Hundru Falls",
    image: "/images/real/heritage/jonha-hundru-falls.jpg",
    attributionUrl: "https://commons.wikimedia.org/wiki/File:Hundru_Falls,_Jharkhand,_India.jpg",
    state: "Jharkhand",
    location: "Ranchi region",
    designation: "Natural heritage",
    description:
      "Ranchi is called the City of Waterfalls — Jonha (Gautamdhara), where legend says the Buddha bathed, and Hundru, where the Subarnarekha leaps 98 metres through the plateau. The monsoon turns the whole region into falling silver.",
    bestTime: "July – January (after the monsoon)",
  },
  {
    name: "Sarna Groves & Tribal Heritage",
    image: "/images/real/heritage/sarna-groves.jpg",
    attributionUrl: "https://commons.wikimedia.org/wiki/File:Santhal_tribes_dancing_in_BAHA_PARAB_(Sarhul_festival).jpg",
    state: "Jharkhand",
    location: "Chotanagpur plateau",
    designation: "Living heritage",
    description:
      "Jharkhand's deepest heritage is alive — the sacred Sarna groves where Munda, Oraon and Ho communities worship nature itself, and the Sarhul festival that celebrates the flowering sal. The State Tribal Museum in Ranchi gathers this world under one roof.",
    bestTime: "October – March (Sarhul in spring)",
  },
  {
    name: "Parasnath Hill (Shikharji)",
    image: "/images/real/heritage/parasnath-hill.jpg",
    attributionUrl: "https://commons.wikimedia.org/wiki/File:Shikharji_Parasnath_Giridih.jpg",
    state: "Jharkhand",
    location: "Giridih district",
    designation: "Jain pilgrimage",
    description:
      "The highest mountain in Jharkhand and the most sacred site in Jainism — twenty of the twenty-four tirthankaras are believed to have attained moksha on its summit. Pilgrims climb through the forest to a ridge of white temples touching the clouds.",
    bestTime: "October – March",
  },
];

export const heritageStates = ["Bihar", "Uttar Pradesh", "Jharkhand"] as const;
