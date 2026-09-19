// JUBAAN member profile types + onboarding constants.
// Mirrors public.profiles after migration 002_onboarding.sql.

export type Profile = {
  id: string;
  full_name: string | null;
  email: string | null;
  avatar_url: string | null;
  home_state: string | null;
  created_at: string;
  roll_number: string | null;
  branch: string | null;
  semester: number | null;
  phone: string | null;
  home_district: string | null;
  interests: string[] | null;
  onboarding_completed: boolean;
};

export type OnboardingPayload = {
  full_name: string;
  roll_number: string;
  branch: string;
  semester: number;
  phone: string | null;
  home_state: string;
  home_district: string;
  interests: string[];
  onboarding_completed: true;
};

export const BRANCHES = [
  "CSE",
  "IT",
  "ECE",
  "EE",
  "ME",
  "CE",
  "ICE",
  "ITEP — Physics",
  "ITEP — Chemistry",
  "ITEP — Mathematics",
  "Other",
] as const;

export const INTERESTS = [
  "Folk Music",
  "Dance",
  "Theatre",
  "Poetry",
  "Painting",
  "Food & Cuisine",
  "Photography",
  "Literature",
  "Heritage Walks",
  "Volunteering",
] as const;

// Focus states first, then the rest alphabetically.
export const STATES = [
  "Uttar Pradesh",
  "Bihar",
  "Jharkhand",
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jammu & Kashmir",
  "Karnataka",
  "Kerala",
  "Ladakh",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttarakhand",
  "West Bengal",
  "Andaman & Nicobar Islands",
  "Chandigarh",
  "Dadra & Nagar Haveli and Daman & Diu",
  "Delhi",
  "Lakshadweep",
  "Puducherry",
] as const;

export const SEMESTERS = [1, 2, 3, 4, 5, 6, 7, 8] as const;
