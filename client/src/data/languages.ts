export interface LanguageConfig {
  code: string;
  name: string;
  nativeName: string;
  speaker: string;
  flag: string;
}

export const SUPPORTED_LANGUAGES: LanguageConfig[] = [
  { code: "en-IN", name: "English (India)", nativeName: "English", speaker: "ritu", flag: "🇮🇳" },
  { code: "hi-IN", name: "Hindi", nativeName: "हिन्दी", speaker: "ritu", flag: "🇮🇳" },
  { code: "ta-IN", name: "Tamil", nativeName: "தமிழ்", speaker: "kavitha", flag: "🇮🇳" },
  { code: "te-IN", name: "Telugu", nativeName: "తెలుగు", speaker: "kavitha", flag: "🇮🇳" },
  { code: "kn-IN", name: "Kannada", nativeName: "ಕನ್ನಡ", speaker: "kavitha", flag: "🇮🇳" },
  { code: "ml-IN", name: "Malayalam", nativeName: "മലയാളം", speaker: "kavitha", flag: "🇮🇳" },
  { code: "bn-IN", name: "Bengali", nativeName: "বাংলা", speaker: "priya", flag: "🇮🇳" },
  { code: "mr-IN", name: "Marathi", nativeName: "मराठी", speaker: "priya", flag: "🇮🇳" },
  { code: "gu-IN", name: "Gujarati", nativeName: "ગુજરાતી", speaker: "priya", flag: "🇮🇳" },
  { code: "pa-IN", name: "Punjabi", nativeName: "ਪੰਜਾਬੀ", speaker: "simran", flag: "🇮🇳" },
  { code: "od-IN", name: "Odia", nativeName: "ଓଡ଼ିଆ", speaker: "ritu", flag: "🇮🇳" },
];
