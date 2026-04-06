import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { join } from "path";

const DATA_DIR = join(process.cwd(), "data");
const PAGES_FILE = join(DATA_DIR, "gift-pages.json");

export interface GiftPage {
  slug: string;
  title: string;
  description: string;
  recipient: string;
  occasion: string;
  interests: string[];
  gender: string;
  hobby: string;
  minBudget: number;
  maxBudget: number;
  currency: string;
  country: string;
  products: any[];
  createdAt: string;
}

function ensureDataDir() {
  if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });
  if (!existsSync(PAGES_FILE)) writeFileSync(PAGES_FILE, "[]");
}

export function loadPages(): GiftPage[] {
  ensureDataDir();
  try {
    return JSON.parse(readFileSync(PAGES_FILE, "utf-8"));
  } catch {
    return [];
  }
}

function savePages(pages: GiftPage[]) {
  ensureDataDir();
  writeFileSync(PAGES_FILE, JSON.stringify(pages, null, 2));
}

export function generateSlug(recipient: string, occasion: string, interests: string[], minBudget: number, maxBudget: number): string {
  const parts = [
    occasion || "gift",
    "for",
    recipient || "someone",
  ];
  if (interests.length > 0) {
    parts.push("who-loves", interests.slice(0, 3).join("-and-"));
  }
  parts.push(`under-${maxBudget}`);

  return parts
    .join("-")
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function generateTitle(recipient: string, occasion: string, interests: string[], maxBudget: number, currency: string): string {
  const occ = occasion ? occasion.charAt(0).toUpperCase() + occasion.slice(1) : "Gift";
  const rec = recipient ? recipient.charAt(0).toUpperCase() + recipient.slice(1) : "Someone Special";
  const interestStr = interests.length > 0 ? ` Who Loves ${interests.slice(0, 2).map(i => i.charAt(0).toUpperCase() + i.slice(1)).join(" & ")}` : "";
  return `Best ${occ} Gifts for Your ${rec}${interestStr} Under ${maxBudget} ${currency}`;
}

export function generateDescription(title: string): string {
  return `${title}. Curated AI-powered gift recommendations from Amazon — handpicked, rated, and ready to buy.`;
}

const MAX_PAGES = 10000;

export function savePage(page: GiftPage) {
  let pages = loadPages();

  // Don't duplicate — update existing
  const existing = pages.findIndex(p => p.slug === page.slug);
  if (existing >= 0) {
    pages[existing] = page;
  } else {
    // Cap at max pages — remove oldest if full
    if (pages.length >= MAX_PAGES) {
      pages.shift();
    }
    pages.push(page);
  }
  savePages(pages);
}

export function getRecentPages(count: number): GiftPage[] {
  return loadPages()
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, count);
}

export function getPage(slug: string): GiftPage | undefined {
  return loadPages().find(p => p.slug === slug);
}

export function getAllSlugs(): string[] {
  return loadPages().map(p => p.slug);
}
