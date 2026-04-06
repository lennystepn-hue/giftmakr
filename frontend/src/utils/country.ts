import { CountryCode } from "@/types";

export const COUNTRY_LABELS: Record<CountryCode, string> = {
  DE: "Germany",
  ES: "Spain",
  UK: "United Kingdom",
  US: "United States",
  CA: "Canada",
  FR: "France",
  IT: "Italy",
  NL: "Netherlands",
};

export const COUNTRY_FLAGS: Record<CountryCode, string> = {
  DE: "\u{1F1E9}\u{1F1EA}",
  ES: "\u{1F1EA}\u{1F1F8}",
  UK: "\u{1F1EC}\u{1F1E7}",
  US: "\u{1F1FA}\u{1F1F8}",
  CA: "\u{1F1E8}\u{1F1E6}",
  FR: "\u{1F1EB}\u{1F1F7}",
  IT: "\u{1F1EE}\u{1F1F9}",
  NL: "\u{1F1F3}\u{1F1F1}",
};

export const CURRENCY_SYMBOLS: Record<CountryCode, string> = {
  DE: "\u20AC", ES: "\u20AC", UK: "\u00A3", US: "$",
  CA: "$", FR: "\u20AC", IT: "\u20AC", NL: "\u20AC",
};

export function detectUserCountry(): CountryCode {
  try {
    const lang = navigator.language;
    const code = lang.split("-")[0].toUpperCase();

    if (code === "DE") return "DE";
    if (code === "ES") return "ES";
    if (code === "FR") return "FR";
    if (code === "IT") return "IT";
    if (code === "NL") return "NL";
    if (code === "EN") {
      if (lang === "en-GB") return "UK";
      if (lang === "en-CA") return "CA";
      return "US";
    }

    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (tz.includes("Europe/Berlin") || tz.includes("Europe/Vienna")) return "DE";
    if (tz.includes("Europe/Madrid")) return "ES";
    if (tz.includes("Europe/London")) return "UK";
    if (tz.includes("America/Toronto") || tz.includes("America/Vancouver")) return "CA";
    if (tz.includes("Europe/Paris")) return "FR";
    if (tz.includes("Europe/Rome")) return "IT";
    if (tz.includes("Europe/Amsterdam")) return "NL";
    if (tz.includes("America/")) return "US";
  } catch {
    // fall through
  }
  return "DE";
}
