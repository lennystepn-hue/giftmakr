export type CountryCode = "DE" | "ES" | "UK" | "US" | "CA" | "FR" | "IT" | "NL";

export const PARTNER_IDS: Record<CountryCode, string> = {
  DE: "giftmakr0c-21",
  ES: "giftmakr00b-21",
  UK: "giftmakr07f-21",
  US: "giftmakr09-20",
  CA: "giftmakrca-20",
  FR: "giftmakr09-21",
  IT: "giftmakr0cb-21",
  NL: "giftmakrnl-21",
};

export const AMAZON_DOMAINS: Record<CountryCode, string> = {
  DE: "amazon.de",
  ES: "amazon.es",
  UK: "amazon.co.uk",
  US: "amazon.com",
  CA: "amazon.ca",
  FR: "amazon.fr",
  IT: "amazon.it",
  NL: "amazon.nl",
};

export const CURRENCY_SYMBOLS: Record<CountryCode, string> = {
  DE: "\u20AC", ES: "\u20AC", UK: "\u00A3", US: "$",
  CA: "$", FR: "\u20AC", IT: "\u20AC", NL: "\u20AC",
};

// Scrape.do geocodes and default zipcodes per country
export const GEOCODES: Record<CountryCode, string> = {
  DE: "de", ES: "es", UK: "gb", US: "us",
  CA: "ca", FR: "fr", IT: "it", NL: "nl",
};

export const DEFAULT_ZIPCODES: Record<CountryCode, string> = {
  DE: "10115", ES: "28001", UK: "SW1A 1AA", US: "10001",
  CA: "M5V 3L9", FR: "75001", IT: "00100", NL: "1012",
};

export const SEARCH_LANGUAGES: Record<CountryCode, string> = {
  DE: "German", ES: "Spanish", UK: "English", US: "English",
  CA: "English", FR: "French", IT: "Italian", NL: "Dutch",
};

export const CURRENCY_LABELS: Record<CountryCode, string> = {
  DE: "EUR", ES: "EUR", UK: "GBP", US: "USD",
  CA: "CAD", FR: "EUR", IT: "EUR", NL: "EUR",
};
