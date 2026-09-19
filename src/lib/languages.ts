export type Language = {
  name: string;
  nativeName: string;
  family: string;
  region: string;
  script: string;
  speakersNote: string;
  phrase: { native: string; transliteration: string; meaning: string };
  literary: string;
  jubaanNote: string;
};

export const languages: Language[] = [
  {
    name: "Bhojpuri",
    nativeName: "भोजपुरी",
    family: "Indo-Aryan · Bihari group",
    region: "Western Bihar & Purvanchal (eastern UP)",
    script: "Devanagari (Kaithi historically)",
    speakersNote: "One of the most widely spoken mother tongues of our region",
    phrase: {
      native: "रउआ कइसे बानी?",
      transliteration: "Rauā kaise bānī?",
      meaning: "How are you? (respectful)",
    },
    literary:
      "Bhikhari Thakur — the 'Shakespeare of Bhojpuri' — carried the anguish of migrant labourers to the stage in plays like Bidesiya. Its folk songs (biraha, kajri, chhath geet) are the soundtrack of our festivals.",
    jubaanNote: "Heard at every JUBAAN Chhath evening and Holi milan.",
  },
  {
    name: "Magahi",
    nativeName: "मगही",
    family: "Indo-Aryan · Bihari group",
    region: "Magadh — Patna, Gaya, Nalanda, Jehanabad",
    script: "Devanagari (Kaithi historically)",
    speakersNote: "The language of the ancient Magadha mahajanapada",
    phrase: {
      native: "अपने कइसे हथिन?",
      transliteration: "Apne kaise hathin?",
      meaning: "How are you? (respectful)",
    },
    literary:
      "Magahi carries the memory of the Buddha's own land — Pāli's closest living cousin in spirit. Its oral treasury of sohar (birth songs), jhumar and wedding geet has been sung in Magadh courtyards for centuries.",
    jubaanNote: "The tongue of our Bodh Gaya and Nalanda journeys.",
  },
  {
    name: "Maithili",
    nativeName: "मैथिली",
    family: "Indo-Aryan · Bihari group",
    region: "Mithila — north Bihar (Darbhanga, Madhubani, Saharsa)",
    script: "Devanagari (Tirhuta / Mithilakshar traditionally)",
    speakersNote: "Recognised in the Eighth Schedule of the Constitution",
    phrase: {
      native: "अहाँ केहन छी?",
      transliteration: "Ahā̃ kehan chhī?",
      meaning: "How are you?",
    },
    literary:
      "Vidyapati — the 14th-century Maithil poet — wrote love songs to Shiva and Parvati that travelled from Mithila's courts to Bengal's kirtans. His padavali remains one of India's great devotional literatures.",
    jubaanNote: "Celebrated at Mithila Mahotsav with Maithili geet and Madhubani art.",
  },
  {
    name: "Awadhi",
    nativeName: "अवधी",
    family: "Indo-Aryan · Eastern Hindi",
    region: "Awadh — Lucknow, Ayodhya, Prayagraj belt",
    script: "Devanagari (Kaithi & Persian historically)",
    speakersNote: "The language of the Ramcharitmanas",
    phrase: {
      native: "कहो, का हाल-चाल बा?",
      transliteration: "Kaho, kā hāl-chāl bā?",
      meaning: "Tell me, how are things?",
    },
    literary:
      "Tulsidas composed the Ramcharitmanas in Awadhi, making the Ramayana sing in the people's tongue. Malik Muhammad Jayasi's Padmavat — an Awadhi Sufi epic — is among the finest premākhyānas ever written.",
    jubaanNote: "Echoes through our Ramleela and Sita–Ram Vivah staging.",
  },
  {
    name: "Bundelkhandi",
    nativeName: "बुन्देली",
    family: "Indo-Aryan · Western Hindi",
    region: "Bundelkhand — southern UP (Jhansi, Chitrakoot, Banda)",
    script: "Devanagari",
    speakersNote: "Spoken across the UP–MP borderland",
    phrase: {
      native: "कैसे हो भैया?",
      transliteration: "Kaise ho bhaiyā?",
      meaning: "How are you, brother?",
    },
    literary:
      "The bardic land of Alha-Khand — the epic ballad of the warriors Alha and Udal, sung by monsoon-night storytellers. Poet Keshavdas of Orchha adorned Bundeli courts with riti-kavya brilliance.",
    jubaanNote: "Its veer-rasa ballads inspire our folk performance nights.",
  },
  {
    name: "Hindi",
    nativeName: "हिन्दी",
    family: "Indo-Aryan · Central",
    region: "All three states — the shared link language",
    script: "Devanagari",
    speakersNote: "Official language of UP, Bihar and Jharkhand",
    phrase: {
      native: "हमारी विरासत, हमारी जुबानी",
      transliteration: "Hamārī virāsat, hamārī zubānī",
      meaning: "Our heritage, in our own voice — JUBAAN's motto",
    },
    literary:
      "From Kabir's dohas to Dinkar's Rashmirathi, the Hindi belt's poets gave India its modern conscience. Ramdhari Singh Dinkar — Bihar's rashtrakavi — wrote of valour in a voice the whole nation adopted.",
    jubaanNote: "The thread that stitches our three states on one stage.",
  },
  {
    name: "Santhali",
    nativeName: "ᱥᱟᱱᱛᱟᱲᱤ",
    family: "Austroasiatic · Munda",
    region: "Santhal Pargana (Jharkhand), parts of Bihar & Bengal",
    script: "Ol Chiki (invented 1925 by Pt. Raghunath Murmu)",
    speakersNote: "Eighth Schedule language; one of India's oldest tongues",
    phrase: {
      native: "ᱟᱢ ᱪᱮᱫ ᱞᱮᱠᱟᱢ ᱢᱮᱱᱟᱢᱟ?",
      transliteration: "Am ched lekam menama?",
      meaning: "How are you?",
    },
    literary:
      "Santhali's oral epics — the story of Pilchu Haram and the creation songs — predate writing itself. Ol Chiki gave this ancient voice a modern script, and Santhali writers now carry it into novels and poetry.",
    jubaanNote: "Honoured on Janjatiya Gaurav Diwas and Birsa Munda Day.",
  },
  {
    name: "Mundari",
    nativeName: "मुण्डारी",
    family: "Austroasiatic · Munda",
    region: "Chotanagpur plateau — Ranchi, Khunti, West Singhbhum",
    script: "Devanagari / Mundari Bani",
    speakersNote: "Tongue of the Munda people, Birsa Munda's own",
    phrase: {
      native: "Am do chikatem menag-a?",
      transliteration: "Latin script, as commonly written",
      meaning: "How are you keeping?",
    },
    literary:
      "Mundari songs carry the worldview of the Sarna groves — nature as kin, not resource. Its folk narratives remember a time before kingdoms, when the forest was the village.",
    jubaanNote: "Sung and spoken at our tribal heritage tributes.",
  },
  {
    name: "Ho",
    nativeName: "Ho",
    family: "Austroasiatic · Munda",
    region: "Kolhan — Chaibasa, Chakradharpur (West Singhbhum)",
    script: "Warang Chiti / Devanagari",
    speakersNote: "Closely related to Mundari; rich song tradition",
    phrase: {
      native: "Am cheleka menag-a?",
      transliteration: "Latin script, as commonly written",
      meaning: "How are you?",
    },
    literary:
      "Ho oral literature — mage parabs, baa songs, the great seasonal festivals in verse — is an encyclopedia of Kolhan's forests, sung rather than written across generations.",
    jubaanNote: "Part of the Jharkhand voice on our stage.",
  },
  {
    name: "Kurukh",
    nativeName: "कुड़ुख़",
    family: "Dravidian · North Dravidian",
    region: "Ranchi plateau, Gumla, Lohardaga",
    script: "Devanagari / Tolong Siki",
    speakersNote: "A Dravidian island in a Munda ocean",
    phrase: {
      native: "Nin ender dara?",
      transliteration: "Latin script, as commonly written",
      meaning: "How are you?",
    },
    literary:
      "Kurukh — the Oraon tongue — is a living reminder that Dravidian languages once stretched across the east. Its karma and sarhul songs bind the agricultural year in verse.",
    jubaanNote: "Heard in our Sarhul-season celebrations.",
  },
];
