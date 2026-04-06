import { CountryCode, AMAZON_DOMAINS, PARTNER_IDS, CURRENCY_SYMBOLS, GEOCODES, DEFAULT_ZIPCODES } from "../constants.js";

interface ScrapeDoProduct {
  asin?: string;
  title?: string;
  url?: string;
  imageUrl?: string;
  price?: { amount?: number; currencyCode?: string };
  rating?: { value?: number; count?: number };
  reviewCount?: string | number;
  isSponsored?: boolean;
}

function parseReviewCount(raw: string | number | undefined): number {
  if (raw == null) return 0;
  if (typeof raw === "number") return raw;
  // Format: "Author Name(1.234)Extra text" — extract number from parentheses
  const match = raw.match(/\(([\d.,]+)\)/);
  if (match) {
    return parseInt(match[1].replace(/[.,]/g, ""), 10) || 0;
  }
  // Fallback: try parsing the whole string as a number
  return parseInt(String(raw).replace(/[^\d]/g, ""), 10) || 0;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number | null;
  image: string;
  link: string;
  asin: string;
  stars: number;
  reviews: number;
  country: CountryCode;
  currencySymbol: string;
}

export async function searchProducts(
  searchTerms: string[],
  country: CountryCode,
  minBudget: number,
  maxBudget: number
): Promise<Product[]> {
  const token = process.env.SCRAPEDO_API_KEY;
  if (!token) {
    throw new Error("SCRAPEDO_API_KEY is not set");
  }

  const domain = AMAZON_DOMAINS[country] || AMAZON_DOMAINS.DE;
  const partnerId = PARTNER_IDS[country] || PARTNER_IDS.DE;
  const currency = CURRENCY_SYMBOLS[country] || "\u20AC";
  const geocode = GEOCODES[country] || GEOCODES.DE;
  const zipcode = DEFAULT_ZIPCODES[country] || DEFAULT_ZIPCODES.DE;

  // Pick 3 random search terms (sequential requests, save API credits)
  const selected = [...searchTerms]
    .sort(() => 0.5 - Math.random())
    .slice(0, 3);

  const seen = new Set<string>();
  const products: Product[] = [];

  // Sequential requests (Scrape.do allows only 1 concurrent)
  for (const term of selected) {
    try {
      console.log(`Scrape.do search: "${term}" on ${geocode}`);

      const params = new URLSearchParams({
        token,
        keyword: term,
        geocode,
        zipcode,
        page: "1",
      });

      const resp = await fetch(`https://api.scrape.do/plugin/amazon/search?${params}`);

      if (!resp.ok) {
        console.error(`Scrape.do search failed for "${term}": ${resp.status}`);
        continue;
      }

      const data = await resp.json();
      const items: ScrapeDoProduct[] = data.products || [];

      for (const item of items) {
        if (!item.asin || seen.has(item.asin)) continue;
        if (item.isSponsored) continue; // skip sponsored results
        seen.add(item.asin);

        const price = item.price?.amount ?? null;
        const link = `https://www.${domain}/dp/${item.asin}?tag=${partnerId}`;

        products.push({
          id: item.asin,
          name: item.title || "Product",
          description: item.title || "",
          price,
          image: item.imageUrl || "",
          link,
          asin: item.asin,
          stars: item.rating?.value || 0,
          reviews: item.rating?.count || parseReviewCount(item.reviewCount),
          country,
          currencySymbol: currency,
        });
      }
    } catch (err) {
      console.error(`Scrape.do error for "${term}":`, err);
    }
  }

  // Sort by rating then reviews
  products.sort((a, b) => {
    if (b.stars !== a.stars) return b.stars - a.stars;
    return b.reviews - a.reviews;
  });

  return products;
}
