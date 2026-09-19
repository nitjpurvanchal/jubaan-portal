/**
 * Celebration details for JUBAAN's annual calendar.
 * Copy is grounded in the approved club proposal — never invent
 * institute-approved dates; festival dates are marked provisional.
 */

export type CelebrationDetail = {
  /** What the occasion is */
  what: string;
  /** How JUBAAN celebrates it on campus */
  how: string;
  /** Where it is celebrated / the place that inspires it */
  venue: string;
  /** True when the date follows the lunar calendar and is provisional */
  provisional?: boolean;
};

/** Keyed by the exact `title` in `annualEvents` (src/lib/data.ts). */
export const celebrationDetails: Record<string, Omit<CelebrationDetail, never>> = {
  "Club Introduction & Membership Drive": {
    what: "The opening gathering of the odd semester — JUBAAN introduces itself to the campus and opens its membership.",
    how: "Club introduction session, committee sign-ups, ice-breakers and a first taste of the culture of Bihar, Uttar Pradesh and Jharkhand through music and food.",
    venue: "NIT Jalandhar campus",
  },
  "Santhal Movement — Heritage Session": {
    what: "A heritage awareness session on the Santhal movement — one of India's earliest organised tribal resistances — and the culture it rose from.",
    how: "Talks and storytelling on the Santhal movement, tribal resistance and culture, also touching people's movements such as Chipko.",
    venue: "NIT Jalandhar campus",
  },
  "Ramdhari Singh Dinkar Jayanti": {
    what: "The birth anniversary of Ramdhari Singh 'Dinkar', the Rashtrakavi whose verses carried the fire of Bihar's literary tradition.",
    how: "Poetry and literary session — recitations of Dinkar's works, open mic and discussion on his legacy.",
    venue: "NIT Jalandhar campus",
  },
  "Jayprakash Narayan Jayanti": {
    what: "The birth anniversary of Jayaprakash Narayan, the Bihar-born leader of the Total Revolution.",
    how: "Talks and discussions on the life, values and ideas of JP Narayan.",
    venue: "NIT Jalandhar campus",
  },
  "Navratri & Ramleela": {
    what: "Navratri and the Ramleela tradition — the dramatic retelling of the Ramayana that lights up the towns of Uttar Pradesh every autumn.",
    how: "A Ramleela performance with the Sita–Ram Vivah episode staged as a dramatic theatrical presentation, plus festive music through Navratri.",
    venue: "NIT Jalandhar campus · inspired by Ayodhya",
    provisional: true,
  },
  "Chhath Puja — Heritage Evening": {
    what: "Chhath — the great festival of the Sun God, Bihar and eastern UP's most beloved celebration, offered at river ghats at dawn and dusk.",
    how: "A Chhath heritage evening — folk songs, a documentary screening and a photo exhibition on the festival's cultural significance.",
    venue: "NIT Jalandhar campus · inspired by the ghats of Varanasi",
    provisional: true,
  },
  "Jharkhand Foundation Day": {
    what: "The foundation day of Jharkhand — the land of forests, celebrated for its tribal art, music and dance.",
    how: "A cultural programme with tribal art, music and dance celebrating the spirit of Jharkhand.",
    venue: "NIT Jalandhar campus · inspired by Ranchi",
  },
  "Janjatiya Gaurav Diwas / Birsa Munda Day": {
    what: "Janjatiya Gaurav Diwas, observed on the birth anniversary of Birsa Munda — a tribute to India's tribal heritage and resistance.",
    how: "Talks, exhibitions and cultural performances honouring tribal heritage, with sessions on Birsa Munda's life and the tribal resistance movements.",
    venue: "NIT Jalandhar campus",
  },
  "Dev Deepawali": {
    what: "The 'Diwali of the Gods' — when the ghats of Varanasi glow with a million lamps a fortnight after Diwali.",
    how: "A cultural evening with lamps, rangoli and folk songs, recreating a slice of the Varanasi ghats on campus.",
    venue: "NIT Jalandhar campus · inspired by the Varanasi ghats",
    provisional: true,
  },
  "Good Governance Day / Atal Bihari Vajpayee Jayanti": {
    what: "Good Governance Day, observed on the birth anniversary of Atal Bihari Vajpayee — poet, orator and statesman with deep roots in the region's politics.",
    how: "Talks on governance, leadership and nation-building.",
    venue: "NIT Jalandhar campus",
  },
  "Makar Sankranti Celebration": {
    what: "The harvest festival marking the sun's northward journey — celebrated with til-gur and kites across the plains.",
    how: "Til-gur sweets, kite flying and talks on harvest traditions of the region.",
    venue: "NIT Jalandhar campus",
  },
  "Karpoori Thakur Jayanti": {
    what: "The birth anniversary of Karpoori Thakur, Bharat Ratna and champion of social justice from Bihar.",
    how: "Remembrance programme — talks on his life and his legacy of social justice.",
    venue: "NIT Jalandhar campus",
  },
  "Bhasha Sangam": {
    what: "JUBAAN's language festival — a celebration of the mother tongues of the region: Bhojpuri, Maithili, Magahi, Awadhi and Hindi.",
    how: "A literary meet with kavi sammelan, storytelling sessions and reading circles in the region's languages.",
    venue: "NIT Jalandhar campus",
  },
  "Braj Mahotsav — Holi Milan Samaroh": {
    what: "The Holi of Braj — Mathura and Barsana's legendary festival of colours, music and devotion.",
    how: "A Holi Milan Samaroh celebrating Braj culture — Holi-of-Braj themed music, colours and poetry.",
    venue: "NIT Jalandhar campus · inspired by Mathura–Barsana",
    provisional: true,
  },
  "Bihar Diwas": {
    what: "Bihar Diwas (22 March) — the foundation day of Bihar, celebrating a land that gave the world Nalanda, the Buddha's enlightenment and the Mauryan empire.",
    how: "Heritage talks, exhibitions and cultural performances celebrating Bihar's history, art and traditions.",
    venue: "NIT Jalandhar campus · inspired by Patna",
  },
  "Food Fest": {
    what: "JUBAAN's flagship food and heritage exhibition — the flavours of three states on one campus street.",
    how: "Traditional food and heritage exhibition with approved stalls — litti-chokha, malpua, pitha, makhana kheer and dahi-chura (Bihar); Banarasi thandai, dahi jalebi, Mathura peda, kulfi-falooda, imarti and chana-ghughni (UP); dhuska, chilka roti and arsa roti (Jharkhand).",
    venue: "NIT Jalandhar campus",
  },
  "Mithila Mahotsav": {
    what: "A celebration of Mithila — the culture of northern Bihar, home of Maithili language and the world-famous Mithila (Madhubani) painting.",
    how: "Maithili songs, Mithila painting workshops and Bihar folk culture.",
    venue: "NIT Jalandhar campus · inspired by Madhubani–Darbhanga",
  },
  "Year-End Cultural Showcase": {
    what: "The closing showcase of the JUBAAN year — the sangha gathers one last time before the summer.",
    how: "A stage showcase of the year's best performances, art and memories.",
    venue: "NIT Jalandhar campus",
  },
};

export function getCelebrationDetail(title: string): CelebrationDetail {
  return (
    celebrationDetails[title] ?? {
      what: "A JUBAAN community gathering.",
      how: "Details announced closer to the date.",
      venue: "NIT Jalandhar campus",
    }
  );
}

/* ------------------------------------------------------------------ */
/* Map data                                                            */
/* ------------------------------------------------------------------ */

/** Approximate coordinates of the 8 Bodhi Circuit sites. Keyed by site slug. */
export const sacredSiteCoords: Record<string, { lat: number; lng: number }> = {
  "bodh-gaya": { lat: 24.695, lng: 84.993 },
  sarnath: { lat: 25.381, lng: 83.021 },
  nalanda: { lat: 25.136, lng: 85.444 },
  rajgir: { lat: 25.026, lng: 85.416 },
  vaishali: { lat: 25.991, lng: 85.134 },
  kesaria: { lat: 26.335, lng: 84.855 },
  kushinagar: { lat: 26.741, lng: 83.888 },
  shravasti: { lat: 27.517, lng: 82.05 },
};

/** Places whose living traditions inspire JUBAAN's celebrations. */
export type CelebrationSpot = {
  id: string;
  name: string;
  lat: number;
  lng: number;
  /** Titles from `annualEvents` celebrated in this spirit */
  events: string[];
  note: string;
};

export const celebrationSpots: CelebrationSpot[] = [
  {
    id: "patna",
    name: "Patna",
    lat: 25.594,
    lng: 85.137,
    events: ["Bihar Diwas"],
    note: "Ancient Pataliputra — the capital whose 2,500-year history inspires our Bihar Diwas: heritage talks, exhibitions and performances.",
  },
  {
    id: "ranchi",
    name: "Ranchi",
    lat: 23.344,
    lng: 85.309,
    events: ["Jharkhand Foundation Day", "Janjatiya Gaurav Diwas / Birsa Munda Day"],
    note: "Heart of Jharkhand — its tribal art, music and dance set the spirit of our Foundation Day and Janjatiya Gaurav Diwas.",
  },
  {
    id: "varanasi",
    name: "Varanasi Ghats",
    lat: 25.317,
    lng: 82.973,
    events: ["Dev Deepawali", "Chhath Puja — Heritage Evening"],
    note: "Where the ghats blaze with a million lamps on Dev Deepawali — and where Chhath's dawn arghya finds its most iconic stage.",
  },
  {
    id: "mathura",
    name: "Mathura – Barsana",
    lat: 27.492,
    lng: 77.673,
    events: ["Braj Mahotsav — Holi Milan Samaroh"],
    note: "The land of Krishna — Barsana's lathmar Holi and Braj's folk music inspire our Holi Milan Samaroh.",
  },
  {
    id: "ayodhya",
    name: "Ayodhya",
    lat: 26.8,
    lng: 82.2,
    events: ["Navratri & Ramleela"],
    note: "The city of Ram — whose Ramleela tradition we stage on campus with the Sita–Ram Vivah episode.",
  },
  {
    id: "madhubani",
    name: "Madhubani – Darbhanga",
    lat: 26.362,
    lng: 86.065,
    events: ["Mithila Mahotsav", "Bhasha Sangam"],
    note: "The Mithila region — home of Maithili language and Madhubani painting, celebrated in our Mithila Mahotsav and Bhasha Sangam.",
  },
];
