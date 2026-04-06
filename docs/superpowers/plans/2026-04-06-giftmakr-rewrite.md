# Giftmakr Rewrite Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rewrite Giftmakr from Lovable-generated code to a clean React + Express app with Claude AI, warm UI, and Docker deployment on Hetzner VPS.

**Architecture:** React 18 frontend (Vite + Tailwind) served by Nginx, Express.js backend API handling Claude + Rainforest API calls, all in Docker Compose with Nginx reverse proxy + SSL.

**Tech Stack:** React 18, TypeScript, Vite, Tailwind CSS, Express.js, Anthropic Claude API, Rainforest API, Docker, Nginx

---

## File Structure

```
giftmakr/
├── frontend/
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   ├── tailwind.config.ts
│   ├── postcss.config.js
│   ├── index.html
│   ├── Dockerfile
│   └── src/
│       ├── main.tsx
│       ├── App.tsx
│       ├── index.css
│       ├── types.ts
│       ├── api.ts                    # Single file: POST /api/recommend
│       ├── utils/
│       │   └── country.ts            # detectUserCountry + country constants
│       ├── components/
│       │   ├── Layout.tsx            # Header + footer + page wrapper
│       │   ├── Button.tsx            # Primary, secondary, ghost variants
│       │   ├── ProductCard.tsx       # Product display card
│       │   ├── Accordion.tsx         # FAQ accordion
│       │   ├── Toast.tsx             # Error notifications
│       │   ├── ProgressBar.tsx       # Quiz step progress
│       │   ├── Chip.tsx              # Interest selection chips
│       │   ├── RangeSlider.tsx       # Budget min/max slider
│       │   └── Skeleton.tsx          # Loading skeleton
│       └── pages/
│           ├── Landing.tsx           # Hero + how it works + FAQ
│           ├── Find.tsx              # Quiz + Results (state-driven)
│           ├── About.tsx
│           ├── Privacy.tsx
│           └── Terms.tsx
├── backend/
│   ├── package.json
│   ├── tsconfig.json
│   ├── Dockerfile
│   └── src/
│       ├── index.ts                  # Express server entry
│       ├── routes/
│       │   └── recommend.ts          # POST /api/recommend handler
│       ├── services/
│       │   ├── claude.ts             # Claude API: quiz → search terms
│       │   └── rainforest.ts         # Rainforest API: search terms → products
│       └── constants.ts              # Partner IDs, domains, currencies
├── nginx/
│   └── nginx.conf
├── docker-compose.yml
├── .env.example
├── .impeccable.md
└── CLAUDE.md
```

---

### Task 1: Project Scaffolding

**Files:**
- Create: `frontend/package.json`
- Create: `frontend/tsconfig.json`
- Create: `frontend/vite.config.ts`
- Create: `frontend/tailwind.config.ts`
- Create: `frontend/postcss.config.js`
- Create: `frontend/index.html`
- Create: `frontend/src/main.tsx`
- Create: `frontend/src/index.css`
- Create: `backend/package.json`
- Create: `backend/tsconfig.json`
- Create: `backend/src/index.ts`

- [ ] **Step 1: Create frontend/package.json**

```json
{
  "name": "giftmakr-frontend",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "lucide-react": "^0.462.0",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-helmet-async": "^1.3.0",
    "react-router-dom": "^6.26.2",
    "sonner": "^1.5.0"
  },
  "devDependencies": {
    "@types/react": "^18.3.3",
    "@types/react-dom": "^18.3.0",
    "@vitejs/plugin-react-swc": "^3.5.0",
    "autoprefixer": "^10.4.20",
    "postcss": "^8.4.47",
    "tailwindcss": "^3.4.11",
    "typescript": "^5.5.3",
    "vite": "^5.4.1"
  }
}
```

- [ ] **Step 2: Create frontend/tsconfig.json**

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"]
}
```

- [ ] **Step 3: Create frontend/vite.config.ts**

```ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      "/api": "http://localhost:3001",
    },
  },
});
```

- [ ] **Step 4: Create frontend/tailwind.config.ts**

```ts
import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        sage: "#7C9082",
        apricot: "#F4A261",
        cream: "#FDF8F4",
        charcoal: "#3D3D3D",
        rose: "#D4A0A0",
        gold: "#C9A96E",
      },
      fontFamily: {
        heading: ["Nunito", "system-ui", "sans-serif"],
        body: ["Inter", "system-ui", "sans-serif"],
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.2s ease-out",
      },
    },
  },
  plugins: [],
} satisfies Config;
```

- [ ] **Step 5: Create frontend/postcss.config.js**

```js
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

- [ ] **Step 6: Create frontend/index.html**

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Giftmakr - Find the Perfect Gift</title>
    <meta name="description" content="Find perfect gift ideas in seconds. Answer a few questions and get personalized gift suggestions for any occasion — no signup required." />
    <meta name="robots" content="index, follow" />
    <link rel="canonical" href="https://giftmakr.com/" />

    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Nunito:wght@700;800&display=swap" rel="stylesheet" />

    <meta property="og:title" content="Giftmakr - Find the Perfect Gift" />
    <meta property="og:description" content="Personalized gift suggestions for any occasion. Answer a few questions, get great ideas." />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://giftmakr.com/" />

    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "Giftmakr",
      "url": "https://giftmakr.com",
      "description": "Personalized gift recommendation tool for any occasion and recipient",
      "applicationCategory": "LifestyleApplication",
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
      "operatingSystem": "Web"
    }
    </script>
  </head>
  <body class="bg-cream text-charcoal font-body">
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

- [ ] **Step 7: Create frontend/src/index.css**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
```

- [ ] **Step 8: Create frontend/src/main.tsx**

```tsx
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </HelmetProvider>
  </React.StrictMode>
);
```

- [ ] **Step 9: Create frontend/src/App.tsx (placeholder)**

```tsx
import { Routes, Route } from "react-router-dom";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<div>Giftmakr</div>} />
    </Routes>
  );
}
```

- [ ] **Step 10: Create backend/package.json**

```json
{
  "name": "giftmakr-backend",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js"
  },
  "dependencies": {
    "cors": "^2.8.5",
    "express": "^4.21.0"
  },
  "devDependencies": {
    "@types/cors": "^2.8.17",
    "@types/express": "^4.17.21",
    "@types/node": "^22.5.5",
    "tsx": "^4.19.0",
    "typescript": "^5.5.3"
  }
}
```

- [ ] **Step 11: Create backend/tsconfig.json**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist"]
}
```

- [ ] **Step 12: Create backend/src/index.ts (minimal server)**

```ts
import express from "express";
import cors from "cors";

const app = express();
const PORT = parseInt(process.env.PORT || "3001");

app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
```

- [ ] **Step 13: Install dependencies and verify both projects start**

```bash
cd frontend && npm install
cd ../backend && npm install
```

Run: `cd backend && npm run dev` — Expected: "Backend running on port 3001"
Run: `cd frontend && npm run dev` — Expected: Vite dev server starts, shows "Giftmakr" at localhost:5173

- [ ] **Step 14: Commit**

```bash
git add frontend/ backend/
git commit -m "feat: scaffold frontend and backend projects"
```

---

### Task 2: Shared Types & Constants

**Files:**
- Create: `frontend/src/types.ts`
- Create: `frontend/src/utils/country.ts`
- Create: `backend/src/constants.ts`

- [ ] **Step 1: Create frontend/src/types.ts**

```ts
export type CountryCode = "DE" | "ES" | "UK" | "US" | "CA" | "FR" | "IT" | "NL";

export interface QuizState {
  recipient: string;
  occasion: string;
  minBudget: number;
  maxBudget: number;
  interests: string[];
  customInterest: string;
  gender: "male" | "female" | "other" | "";
  country: CountryCode;
  hobby: string;
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

export type RelevanceLabel = "Perfect Match" | "Great Pick" | "Worth a Look";

export const INITIAL_QUIZ_STATE: QuizState = {
  recipient: "",
  occasion: "",
  minBudget: 50,
  maxBudget: 150,
  interests: [],
  customInterest: "",
  gender: "",
  country: "DE",
  hobby: "",
};
```

- [ ] **Step 2: Create frontend/src/utils/country.ts**

```ts
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
```

- [ ] **Step 3: Create backend/src/constants.ts**

```ts
export type CountryCode = "DE" | "ES" | "UK" | "US" | "CA" | "FR" | "IT" | "NL";

export const PARTNER_IDS: Record<CountryCode, string> = {
  DE: "giftmakr-21",
  ES: "giftmakr0f-21",
  UK: "giftmakruk-21",
  US: "giftmakrus-20",
  CA: "giftmakrca-20",
  FR: "giftmakrfr-21",
  IT: "giftmakrit-21",
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
```

- [ ] **Step 4: Commit**

```bash
git add frontend/src/types.ts frontend/src/utils/country.ts backend/src/constants.ts
git commit -m "feat: add shared types and country/affiliate constants"
```

---

### Task 3: Backend — Claude AI Service

**Files:**
- Create: `backend/src/services/claude.ts`

- [ ] **Step 1: Create backend/src/services/claude.ts**

```ts
interface QuizInput {
  recipient: string;
  occasion: string;
  minBudget: number;
  maxBudget: number;
  interests: string[];
  customInterest: string;
  gender: string;
  hobby: string;
}

interface ClaudeResponse {
  searchTerms: string[];
}

export async function generateSearchTerms(quiz: QuizInput): Promise<string[]> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error("ANTHROPIC_API_KEY is not set");
  }

  const allInterests = [...quiz.interests];
  if (quiz.customInterest.trim()) {
    allInterests.push(quiz.customInterest.trim());
  }

  const userPrompt = `Gift recipient details:
- Relationship: ${quiz.recipient}
- Occasion: ${quiz.occasion}
- Budget: ${quiz.minBudget} - ${quiz.maxBudget} EUR
- Interests: ${allInterests.join(", ") || "none specified"}
${quiz.gender ? `- Gender: ${quiz.gender}` : ""}
${quiz.hobby ? `- Hobby/passion: ${quiz.hobby}` : ""}

Suggest 20 specific Amazon search terms for gifts.`;

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 1024,
      system: `You are a gift recommendation assistant. Given details about a gift recipient, suggest 20 specific Amazon search terms that would find good gifts within their budget.

Return ONLY valid JSON: { "searchTerms": ["term1", "term2", ...] }

Keep terms in English. Be specific (e.g., "wireless noise cancelling headphones under 100" not just "electronics"). Mix practical, fun, and unique ideas. Each term should be a realistic Amazon search query.`,
      messages: [{ role: "user", content: userPrompt }],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Claude API error:", response.status, errorText);
    throw new Error(`Claude API error: ${response.status}`);
  }

  const data = await response.json();
  const text = data.content[0]?.text;

  if (!text) {
    throw new Error("Empty response from Claude");
  }

  const parsed: ClaudeResponse = JSON.parse(text);

  if (!Array.isArray(parsed.searchTerms) || parsed.searchTerms.length === 0) {
    throw new Error("Claude returned no search terms");
  }

  return parsed.searchTerms;
}
```

- [ ] **Step 2: Commit**

```bash
git add backend/src/services/claude.ts
git commit -m "feat: add Claude AI service for search term generation"
```

---

### Task 4: Backend — Rainforest API Service

**Files:**
- Create: `backend/src/services/rainforest.ts`

- [ ] **Step 1: Create backend/src/services/rainforest.ts**

```ts
import { CountryCode, AMAZON_DOMAINS, PARTNER_IDS, CURRENCY_SYMBOLS } from "../constants.js";

interface RainforestProduct {
  asin?: string;
  title?: string;
  description?: string;
  link?: string;
  image?: string;
  images?: { primary?: { large?: { url?: string } } };
  price?: { value?: number | string; raw?: string };
  rating?: number | string;
  ratings_total?: number;
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
  const apiKey = process.env.RAINFOREST_API_KEY;
  if (!apiKey) {
    throw new Error("RAINFOREST_API_KEY is not set");
  }

  const domain = AMAZON_DOMAINS[country] || AMAZON_DOMAINS.DE;
  const partnerId = PARTNER_IDS[country] || PARTNER_IDS.DE;
  const currency = CURRENCY_SYMBOLS[country] || "\u20AC";

  // Pick up to 16 random terms, batch into 4 groups of 4
  const shuffled = [...searchTerms].sort(() => 0.5 - Math.random()).slice(0, 16);
  const batches: string[][] = [];
  for (let i = 0; i < shuffled.length; i += 4) {
    batches.push(shuffled.slice(i, i + 4));
  }

  const minPrice = Math.max(1, Math.floor(minBudget * 0.8));
  const maxPrice = Math.ceil(maxBudget * 1.2);

  const results = await Promise.allSettled(
    batches.map(async (batch) => {
      const searchTerm = batch.join(" ");
      const params = new URLSearchParams({
        api_key: apiKey,
        type: "search",
        amazon_domain: domain,
        search_term: searchTerm,
        sort_by: "featured",
        min_price: minPrice.toString(),
        max_price: maxPrice.toString(),
        page: "1",
        include_html: "false",
      });

      const resp = await fetch(`https://api.rainforestapi.com/request?${params}`);
      if (!resp.ok) {
        console.error(`Rainforest search failed for "${searchTerm}": ${resp.status}`);
        return [];
      }
      const data = await resp.json();
      return (data.search_results || []) as RainforestProduct[];
    })
  );

  // Collect all fulfilled results, deduplicate by ASIN
  const seen = new Set<string>();
  const products: Product[] = [];

  for (const result of results) {
    if (result.status !== "fulfilled") continue;
    for (const item of result.value) {
      if (!item.asin || seen.has(item.asin)) continue;
      seen.add(item.asin);

      const price = extractPrice(item);
      const link = `https://www.${domain}/dp/${item.asin}?tag=${partnerId}`;

      products.push({
        id: item.asin,
        name: item.title || "Product",
        description: item.description || item.title || "",
        price,
        image: item.image || item.images?.primary?.large?.url || "",
        link,
        asin: item.asin,
        stars: typeof item.rating === "number" ? item.rating : parseFloat(String(item.rating)) || 0,
        reviews: item.ratings_total || 0,
        country,
        currencySymbol: currency,
      });
    }
  }

  // Sort by rating then reviews
  products.sort((a, b) => {
    if (b.stars !== a.stars) return b.stars - a.stars;
    return b.reviews - a.reviews;
  });

  return products;
}

function extractPrice(item: RainforestProduct): number | null {
  if (!item.price) return null;

  if (typeof item.price.value === "number" && item.price.value > 0) {
    return item.price.value;
  }

  if (typeof item.price.value === "string") {
    const parsed = parseFloat(item.price.value.replace(/[^0-9.,]/g, "").replace(",", "."));
    if (!isNaN(parsed) && parsed > 0) return parsed;
  }

  if (item.price.raw) {
    const match = item.price.raw.match(/[0-9.,]+/);
    if (match) {
      const parsed = parseFloat(match[0].replace(",", "."));
      if (!isNaN(parsed) && parsed > 0) return parsed;
    }
  }

  return null;
}
```

- [ ] **Step 2: Commit**

```bash
git add backend/src/services/rainforest.ts
git commit -m "feat: add Rainforest API service for Amazon product search"
```

---

### Task 5: Backend — Recommend Endpoint

**Files:**
- Create: `backend/src/routes/recommend.ts`
- Modify: `backend/src/index.ts`

- [ ] **Step 1: Create backend/src/routes/recommend.ts**

```ts
import { Router, Request, Response } from "express";
import { generateSearchTerms } from "../services/claude.js";
import { searchProducts } from "../services/rainforest.js";
import type { CountryCode } from "../constants.js";

const router = Router();

interface RecommendBody {
  quizState: {
    recipient: string;
    occasion: string;
    minBudget: number;
    maxBudget: number;
    interests: string[];
    customInterest: string;
    gender: string;
    hobby: string;
  };
  country: CountryCode;
}

router.post("/", async (req: Request<{}, {}, RecommendBody>, res: Response) => {
  try {
    const { quizState, country } = req.body;

    if (!quizState || !country) {
      res.status(400).json({ products: [], error: "Missing quizState or country" });
      return;
    }

    // Step 1: Get search terms from Claude
    let searchTerms: string[];
    try {
      searchTerms = await generateSearchTerms(quizState);
    } catch (err) {
      console.error("Claude error:", err);
      res.status(502).json({ products: [], error: "Failed to generate recommendations. Please try again." });
      return;
    }

    // Step 2: Search products on Rainforest
    let products;
    try {
      products = await searchProducts(searchTerms, country, quizState.minBudget, quizState.maxBudget);
    } catch (err) {
      console.error("Rainforest error:", err);
      res.status(502).json({ products: [], error: "Failed to search for products. Please try again." });
      return;
    }

    // Step 3: Filter by budget (20% tolerance)
    const minPrice = quizState.minBudget * 0.8;
    const maxPrice = quizState.maxBudget * 1.2;
    const filtered = products.filter(
      (p) => p.price === null || (p.price >= minPrice && p.price <= maxPrice)
    );

    res.json({ products: filtered });
  } catch (err) {
    console.error("Unexpected error in /api/recommend:", err);
    res.status(500).json({ products: [], error: "Something went wrong. Please try again." });
  }
});

export default router;
```

- [ ] **Step 2: Update backend/src/index.ts to wire up the route**

Replace the full contents of `backend/src/index.ts`:

```ts
import express from "express";
import cors from "cors";
import recommendRouter from "./routes/recommend.js";

const app = express();
const PORT = parseInt(process.env.PORT || "3001");

app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/recommend", recommendRouter);

app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
```

- [ ] **Step 3: Verify backend compiles**

Run: `cd backend && npx tsc --noEmit`
Expected: No errors

- [ ] **Step 4: Commit**

```bash
git add backend/src/routes/recommend.ts backend/src/index.ts
git commit -m "feat: add POST /api/recommend endpoint wiring Claude + Rainforest"
```

---

### Task 6: Frontend — UI Components

**Files:**
- Create: `frontend/src/components/Button.tsx`
- Create: `frontend/src/components/Chip.tsx`
- Create: `frontend/src/components/RangeSlider.tsx`
- Create: `frontend/src/components/ProgressBar.tsx`
- Create: `frontend/src/components/Accordion.tsx`
- Create: `frontend/src/components/Skeleton.tsx`
- Create: `frontend/src/components/Toast.tsx`
- Create: `frontend/src/components/ProductCard.tsx`

- [ ] **Step 1: Create frontend/src/components/Button.tsx**

```tsx
import { ButtonHTMLAttributes, forwardRef } from "react";

type Variant = "primary" | "secondary" | "ghost" | "outline";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

const variantStyles: Record<Variant, string> = {
  primary: "bg-sage text-white hover:bg-sage/90 shadow-sm hover:shadow",
  secondary: "bg-apricot text-white hover:bg-apricot/90 shadow-sm hover:shadow",
  ghost: "text-charcoal hover:bg-sage/10",
  outline: "border border-sage/30 text-charcoal hover:border-sage hover:bg-sage/5",
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", className = "", disabled, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={`inline-flex items-center justify-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium transition-all duration-200 hover:scale-[1.02] disabled:opacity-50 disabled:pointer-events-none ${variantStyles[variant]} ${className}`}
        disabled={disabled}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
export default Button;
```

- [ ] **Step 2: Create frontend/src/components/Chip.tsx**

```tsx
import { X } from "lucide-react";

interface ChipProps {
  label: string;
  selected?: boolean;
  onToggle?: () => void;
  onRemove?: () => void;
}

export default function Chip({ label, selected, onToggle, onRemove }: ChipProps) {
  if (onRemove) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-sage/15 px-3 py-1.5 text-sm text-sage font-medium">
        {label}
        <button onClick={onRemove} className="ml-1 hover:text-charcoal" aria-label={`Remove ${label}`}>
          <X size={14} />
        </button>
      </span>
    );
  }

  return (
    <button
      onClick={onToggle}
      className={`rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 hover:scale-[1.02] ${
        selected
          ? "bg-sage text-white shadow-sm"
          : "border border-sage/30 text-charcoal hover:border-sage hover:bg-sage/5"
      }`}
    >
      {label}
    </button>
  );
}
```

- [ ] **Step 3: Create frontend/src/components/RangeSlider.tsx**

```tsx
import { useCallback } from "react";

interface RangeSliderProps {
  min: number;
  max: number;
  step: number;
  valueMin: number;
  valueMax: number;
  onChange: (min: number, max: number) => void;
  formatLabel?: (value: number) => string;
}

export default function RangeSlider({
  min, max, step, valueMin, valueMax, onChange, formatLabel = (v) => `${v}`,
}: RangeSliderProps) {
  const handleMinChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = Math.min(Number(e.target.value), valueMax - step);
      onChange(val, valueMax);
    },
    [valueMax, step, onChange]
  );

  const handleMaxChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = Math.max(Number(e.target.value), valueMin + step);
      onChange(valueMin, val);
    },
    [valueMin, step, onChange]
  );

  const leftPercent = ((valueMin - min) / (max - min)) * 100;
  const rightPercent = ((valueMax - min) / (max - min)) * 100;

  return (
    <div className="space-y-4">
      <div className="flex justify-between text-lg font-heading font-bold text-sage">
        <span>{formatLabel(valueMin)}</span>
        <span>{formatLabel(valueMax)}</span>
      </div>
      <div className="relative h-2">
        <div className="absolute inset-0 rounded-full bg-sage/20" />
        <div
          className="absolute h-full rounded-full bg-sage"
          style={{ left: `${leftPercent}%`, right: `${100 - rightPercent}%` }}
        />
        <input
          type="range"
          min={min} max={max} step={step} value={valueMin}
          onChange={handleMinChange}
          className="absolute inset-0 w-full appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-sage [&::-webkit-slider-thumb]:shadow [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-sage [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:shadow [&::-moz-range-thumb]:cursor-pointer"
        />
        <input
          type="range"
          min={min} max={max} step={step} value={valueMax}
          onChange={handleMaxChange}
          className="absolute inset-0 w-full appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-sage [&::-webkit-slider-thumb]:shadow [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-sage [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:shadow [&::-moz-range-thumb]:cursor-pointer"
        />
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Create frontend/src/components/ProgressBar.tsx**

```tsx
interface ProgressBarProps {
  current: number;
  total: number;
}

export default function ProgressBar({ current, total }: ProgressBarProps) {
  return (
    <div className="flex items-center gap-2 mb-8">
      {Array.from({ length: total }, (_, i) => (
        <div
          key={i}
          className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${
            i < current ? "bg-sage" : "bg-sage/20"
          }`}
        />
      ))}
      <span className="text-xs text-charcoal/50 ml-2 whitespace-nowrap">
        {current} / {total}
      </span>
    </div>
  );
}
```

- [ ] **Step 5: Create frontend/src/components/Accordion.tsx**

```tsx
import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface AccordionItem {
  question: string;
  answer: string;
}

interface AccordionProps {
  items: AccordionItem[];
}

export default function Accordion({ items }: AccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="space-y-2">
      {items.map((item, i) => (
        <div key={i} className="border border-sage/20 rounded-lg overflow-hidden">
          <button
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
            className="w-full flex items-center justify-between p-4 text-left font-medium text-charcoal hover:bg-sage/5 transition-colors"
          >
            {item.question}
            <ChevronDown
              size={18}
              className={`text-sage transition-transform duration-200 ${openIndex === i ? "rotate-180" : ""}`}
            />
          </button>
          {openIndex === i && (
            <div className="px-4 pb-4 text-charcoal/70 text-sm leading-relaxed animate-fade-in">
              {item.answer}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
```

- [ ] **Step 6: Create frontend/src/components/Skeleton.tsx**

```tsx
export default function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div className={`bg-sage/10 rounded-lg animate-pulse ${className}`} />
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-sage/10 overflow-hidden">
      <Skeleton className="aspect-square" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-6 w-1/3" />
        <Skeleton className="h-10 w-full" />
      </div>
    </div>
  );
}
```

- [ ] **Step 7: Create frontend/src/components/Toast.tsx**

This uses the `sonner` library for toast notifications.

```tsx
import { Toaster } from "sonner";

export default function ToastProvider() {
  return (
    <Toaster
      position="top-center"
      toastOptions={{
        style: {
          background: "#FDF8F4",
          border: "1px solid rgba(124, 144, 130, 0.2)",
          color: "#3D3D3D",
        },
      }}
    />
  );
}
```

- [ ] **Step 8: Create frontend/src/components/ProductCard.tsx**

```tsx
import { Star, ExternalLink } from "lucide-react";
import { Product, RelevanceLabel } from "@/types";
import Button from "./Button";

interface ProductCardProps {
  product: Product;
  relevanceLabel?: RelevanceLabel;
}

const labelStyles: Record<RelevanceLabel, string> = {
  "Perfect Match": "bg-gold/20 text-gold border-gold/30",
  "Great Pick": "bg-sage/15 text-sage border-sage/30",
  "Worth a Look": "bg-charcoal/10 text-charcoal/60 border-charcoal/15",
};

export default function ProductCard({ product, relevanceLabel }: ProductCardProps) {
  const renderStars = (rating: number) => {
    if (!rating) return null;
    return (
      <div className="flex items-center gap-1">
        {Array.from({ length: 5 }, (_, i) => (
          <Star
            key={i}
            size={14}
            className={i < Math.round(rating) ? "fill-apricot text-apricot" : "text-charcoal/20"}
          />
        ))}
        {product.reviews > 0 && (
          <span className="text-xs text-charcoal/50 ml-1">({product.reviews})</span>
        )}
      </div>
    );
  };

  const formatPrice = () => {
    if (product.price === null || product.price <= 0) {
      return null;
    }
    return `${product.price.toFixed(2)} ${product.currencySymbol}`;
  };

  const priceDisplay = formatPrice();

  return (
    <div className="bg-white rounded-xl border border-sage/10 overflow-hidden transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 group">
      <div className="relative aspect-square bg-cream/50">
        <img
          src={product.image || ""}
          alt={product.name}
          className="w-full h-full object-contain p-3"
          loading="lazy"
        />
        {relevanceLabel && (
          <span className={`absolute top-2 left-2 text-xs font-medium px-2 py-1 rounded-full border ${labelStyles[relevanceLabel]}`}>
            {relevanceLabel}
          </span>
        )}
      </div>
      <div className="p-4 space-y-2">
        <h3 className="font-medium text-charcoal line-clamp-2 leading-snug">{product.name}</h3>
        {renderStars(product.stars)}
        {priceDisplay ? (
          <p className="text-lg font-bold text-sage">{priceDisplay}</p>
        ) : (
          <p className="text-sm text-charcoal/50 italic">Check price on Amazon</p>
        )}
        <a href={product.link} target="_blank" rel="noopener noreferrer" className="block">
          <Button variant="primary" className="w-full">
            View on Amazon <ExternalLink size={14} />
          </Button>
        </a>
      </div>
    </div>
  );
}
```

- [ ] **Step 9: Commit**

```bash
git add frontend/src/components/
git commit -m "feat: add hand-built UI components with warm design system"
```

---

### Task 7: Frontend — Layout Component

**Files:**
- Create: `frontend/src/components/Layout.tsx`

- [ ] **Step 1: Create frontend/src/components/Layout.tsx**

```tsx
import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { Gift } from "lucide-react";

export default function Layout({ children }: { children: ReactNode }) {
  const location = useLocation();

  const navLink = (to: string, label: string) => (
    <Link
      to={to}
      className={`text-sm font-medium transition-colors ${
        location.pathname === to ? "text-sage" : "text-charcoal/60 hover:text-sage"
      }`}
    >
      {label}
    </Link>
  );

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      <header className="border-b border-sage/10 bg-cream/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-heading text-xl font-bold text-sage">
            <Gift size={22} className="text-apricot" />
            Giftmakr
          </Link>
          <nav className="flex items-center gap-6">
            {navLink("/find", "Find a Gift")}
            {navLink("/about", "About")}
          </nav>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t border-sage/10 py-8 mt-16">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 font-heading font-bold text-sage">
              <Gift size={18} className="text-apricot" />
              Giftmakr
            </div>
            <div className="flex items-center gap-4 text-sm text-charcoal/50">
              <Link to="/about" className="hover:text-sage transition-colors">About</Link>
              <Link to="/privacy" className="hover:text-sage transition-colors">Privacy</Link>
              <Link to="/terms" className="hover:text-sage transition-colors">Terms</Link>
              <a href="mailto:support@giftmakr.com" className="hover:text-sage transition-colors">Contact</a>
            </div>
            <p className="text-xs text-charcoal/40">&copy; {new Date().getFullYear()} Giftmakr</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add frontend/src/components/Layout.tsx
git commit -m "feat: add Layout with header, footer, and warm design"
```

---

### Task 8: Frontend — Landing Page

**Files:**
- Create: `frontend/src/pages/Landing.tsx`

- [ ] **Step 1: Create frontend/src/pages/Landing.tsx**

```tsx
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Gift, Search, ShoppingBag, ArrowRight } from "lucide-react";
import Layout from "@/components/Layout";
import Button from "@/components/Button";
import Accordion from "@/components/Accordion";

const FAQ_ITEMS = [
  {
    question: "How does Giftmakr find gift recommendations?",
    answer:
      "You answer a few quick questions about who the gift is for, the occasion, their interests, and your budget. We then search for matching products on Amazon and show you the best options.",
  },
  {
    question: "Is it really free?",
    answer:
      "Yes, completely free. No signup, no account, no hidden fees. We earn a small commission from Amazon when you purchase through our links, at no extra cost to you.",
  },
  {
    question: "What occasions does it cover?",
    answer:
      "Birthdays, holidays, weddings, anniversaries, graduations, or just because. Whatever the occasion, we'll find something fitting.",
  },
  {
    question: "Can I set a specific budget?",
    answer:
      "Absolutely. You set a min and max budget, and we only show products within that range.",
  },
  {
    question: "Which countries are supported?",
    answer:
      "We support Amazon stores in Germany, Spain, UK, US, Canada, France, Italy, and the Netherlands. Your country is auto-detected but you can change it.",
  },
  {
    question: "How do I buy a recommended gift?",
    answer:
      "Each recommendation has a \"View on Amazon\" button that takes you directly to the product page where you can purchase it.",
  },
];

const STEPS = [
  { icon: Gift, title: "Tell us about them", desc: "Answer a few questions about the recipient and occasion" },
  { icon: Search, title: "We find gifts", desc: "Our system searches for the best matching products" },
  { icon: ShoppingBag, title: "Pick your favorite", desc: "Browse curated results and buy directly on Amazon" },
];

export default function Landing() {
  return (
    <Layout>
      <Helmet>
        <title>Giftmakr - Find the Perfect Gift</title>
        <meta
          name="description"
          content="Find perfect gift ideas in seconds. Answer a few questions and get personalized gift suggestions for any occasion — no signup required."
        />
      </Helmet>

      {/* Hero */}
      <section className="max-w-3xl mx-auto text-center px-4 pt-16 pb-12 md:pt-24 md:pb-16">
        <h1 className="font-heading text-4xl md:text-5xl font-extrabold text-charcoal leading-tight">
          Find the perfect gift
          <span className="block text-sage mt-1">for anyone, any occasion</span>
        </h1>
        <p className="mt-5 text-lg text-charcoal/60 max-w-xl mx-auto">
          Answer a few quick questions and get personalized gift ideas — free, no signup required.
        </p>
        <div className="mt-8">
          <Link to="/find">
            <Button variant="secondary" className="text-base px-8 py-3">
              Find a gift <ArrowRight size={16} />
            </Button>
          </Link>
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-3xl mx-auto px-4 pb-16">
        <h2 className="font-heading text-2xl font-bold text-center text-charcoal mb-8">
          How it works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {STEPS.map((s, i) => (
            <div key={i} className="text-center p-6 rounded-xl bg-white border border-sage/10">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-sage/10 mb-4">
                <s.icon size={22} className="text-sage" />
              </div>
              <h3 className="font-heading font-bold text-charcoal mb-1">{s.title}</h3>
              <p className="text-sm text-charcoal/60">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-2xl mx-auto px-4 pb-16">
        <h2 className="font-heading text-2xl font-bold text-center text-charcoal mb-8">
          Frequently asked questions
        </h2>
        <Accordion items={FAQ_ITEMS} />
      </section>
    </Layout>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add frontend/src/pages/Landing.tsx
git commit -m "feat: add landing page with hero, how-it-works, FAQ"
```

---

### Task 9: Frontend — Find Page (Quiz + Results)

**Files:**
- Create: `frontend/src/api.ts`
- Create: `frontend/src/pages/Find.tsx`

- [ ] **Step 1: Create frontend/src/api.ts**

```ts
import { Product, QuizState, CountryCode } from "./types";

interface RecommendResponse {
  products: Product[];
  error?: string;
}

export async function fetchRecommendations(
  quizState: QuizState,
  country: CountryCode
): Promise<RecommendResponse> {
  const response = await fetch("/api/recommend", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ quizState, country }),
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    return {
      products: [],
      error: data.error || "Something went wrong. Please try again.",
    };
  }

  return response.json();
}
```

- [ ] **Step 2: Create frontend/src/pages/Find.tsx**

This is the main page combining the 7-step quiz and results view.

```tsx
import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { toast } from "sonner";
import { ArrowLeft, ArrowRight, SkipForward, RefreshCw } from "lucide-react";
import Layout from "@/components/Layout";
import Button from "@/components/Button";
import Chip from "@/components/Chip";
import RangeSlider from "@/components/RangeSlider";
import ProgressBar from "@/components/ProgressBar";
import ProductCard from "@/components/ProductCard";
import { ProductCardSkeleton } from "@/components/Skeleton";
import { QuizState, Product, INITIAL_QUIZ_STATE, RelevanceLabel } from "@/types";
import { detectUserCountry, COUNTRY_FLAGS, COUNTRY_LABELS, CURRENCY_SYMBOLS } from "@/utils/country";
import { fetchRecommendations } from "@/api";
import type { CountryCode } from "@/types";

const RECIPIENTS = ["Partner", "Friend", "Parent", "Sibling", "Child", "Colleague", "Other"];
const OCCASIONS = ["Birthday", "Christmas", "Anniversary", "Valentine's", "Wedding", "Thank You", "Graduation", "Just Because"];
const INTERESTS = ["Technology", "Books", "Fashion", "Home", "Cooking", "Fitness", "Outdoors", "Gaming", "Music", "Art", "Travel", "Beauty", "Sports"];
const GENDERS: { value: QuizState["gender"]; label: string }[] = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "other", label: "Prefer not to say" },
];
const COUNTRIES: CountryCode[] = ["DE", "ES", "UK", "US", "CA", "FR", "IT", "NL"];

type View = "quiz" | "loading" | "results";

export default function Find() {
  const [view, setView] = useState<View>("quiz");
  const [step, setStep] = useState(1);
  const [quiz, setQuiz] = useState<QuizState>({
    ...INITIAL_QUIZ_STATE,
    country: detectUserCountry(),
  });
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [customInput, setCustomInput] = useState("");

  const TOTAL_STEPS = 7;

  const update = (partial: Partial<QuizState>) => setQuiz((prev) => ({ ...prev, ...partial }));

  const canProceed = () => {
    switch (step) {
      case 1: return !!quiz.recipient;
      case 2: return !!quiz.occasion;
      case 3: return quiz.minBudget > 0 && quiz.maxBudget > quiz.minBudget;
      case 4: return quiz.interests.length > 0;
      case 5: return true; // hobby is optional
      case 6: return !!quiz.gender;
      case 7: return !!quiz.country;
      default: return false;
    }
  };

  const next = () => {
    if (step < TOTAL_STEPS) {
      setStep(step + 1);
    } else {
      submit();
    }
  };

  const back = () => {
    if (view === "results" || view === "loading") {
      setView("quiz");
      setStep(TOTAL_STEPS);
    } else if (step > 1) {
      setStep(step - 1);
    }
  };

  const submit = async () => {
    setView("loading");
    setError(null);
    setProducts([]);

    const result = await fetchRecommendations(quiz, quiz.country);

    if (result.error) {
      setError(result.error);
      toast.error(result.error);
    }
    setProducts(result.products);
    setView("results");
  };

  const startOver = () => {
    setQuiz({ ...INITIAL_QUIZ_STATE, country: detectUserCountry() });
    setStep(1);
    setView("quiz");
    setError(null);
    setProducts([]);
  };

  const addCustomInterest = () => {
    const trimmed = customInput.trim();
    if (trimmed && !quiz.interests.includes(trimmed)) {
      update({ interests: [...quiz.interests, trimmed] });
      setCustomInput("");
    }
  };

  const toggleInterest = (interest: string) => {
    const exists = quiz.interests.includes(interest);
    update({
      interests: exists
        ? quiz.interests.filter((i) => i !== interest)
        : [...quiz.interests, interest],
    });
  };

  const getRelevanceLabel = (index: number, total: number): RelevanceLabel | undefined => {
    if (total === 0) return undefined;
    const pct = index / total;
    if (pct < 0.2) return "Perfect Match";
    if (pct < 0.5) return "Great Pick";
    if (pct < 0.8) return "Worth a Look";
    return undefined;
  };

  const currencyLabel = CURRENCY_SYMBOLS[quiz.country] || "\u20AC";

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <StepWrapper title="Who is this gift for?">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {RECIPIENTS.map((r) => (
                <Chip key={r} label={r} selected={quiz.recipient === r.toLowerCase()} onToggle={() => update({ recipient: r.toLowerCase() })} />
              ))}
            </div>
          </StepWrapper>
        );
      case 2:
        return (
          <StepWrapper title="What's the occasion?">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {OCCASIONS.map((o) => (
                <Chip key={o} label={o} selected={quiz.occasion === o.toLowerCase()} onToggle={() => update({ occasion: o.toLowerCase() })} />
              ))}
            </div>
          </StepWrapper>
        );
      case 3:
        return (
          <StepWrapper title="What's your budget?">
            <RangeSlider
              min={5} max={500} step={5}
              valueMin={quiz.minBudget} valueMax={quiz.maxBudget}
              onChange={(min, max) => update({ minBudget: min, maxBudget: max })}
              formatLabel={(v) => `${v} ${currencyLabel}`}
            />
          </StepWrapper>
        );
      case 4:
        return (
          <StepWrapper title="What are their interests?">
            <div className="flex flex-wrap gap-2 mb-4">
              {INTERESTS.map((i) => (
                <Chip key={i} label={i} selected={quiz.interests.includes(i.toLowerCase())} onToggle={() => toggleInterest(i.toLowerCase())} />
              ))}
            </div>
            {quiz.interests.filter((i) => !INTERESTS.map((x) => x.toLowerCase()).includes(i)).length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {quiz.interests
                  .filter((i) => !INTERESTS.map((x) => x.toLowerCase()).includes(i))
                  .map((i) => (
                    <Chip key={i} label={i} onRemove={() => toggleInterest(i)} />
                  ))}
              </div>
            )}
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Add a custom interest..."
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addCustomInterest())}
                className="flex-1 rounded-lg border border-sage/30 px-3 py-2 text-sm bg-white focus:outline-none focus:border-sage transition-colors"
              />
              <Button variant="outline" onClick={addCustomInterest} disabled={!customInput.trim()}>
                Add
              </Button>
            </div>
          </StepWrapper>
        );
      case 5:
        return (
          <StepWrapper title="Any specific hobby or passion?" subtitle="Optional — helps us find more targeted gifts">
            <input
              type="text"
              placeholder="e.g., Photography, Rock Climbing, Baking..."
              value={quiz.hobby}
              onChange={(e) => update({ hobby: e.target.value })}
              className="w-full rounded-lg border border-sage/30 px-4 py-3 text-sm bg-white focus:outline-none focus:border-sage transition-colors"
            />
          </StepWrapper>
        );
      case 6:
        return (
          <StepWrapper title="Gender">
            <div className="space-y-2">
              {GENDERS.map((g) => (
                <button
                  key={g.value}
                  onClick={() => update({ gender: g.value })}
                  className={`w-full text-left px-4 py-3 rounded-lg border transition-all ${
                    quiz.gender === g.value
                      ? "border-sage bg-sage/10 text-sage font-medium"
                      : "border-sage/20 hover:border-sage/40"
                  }`}
                >
                  {g.label}
                </button>
              ))}
            </div>
          </StepWrapper>
        );
      case 7:
        return (
          <StepWrapper title="Which Amazon store?">
            <div className="grid grid-cols-2 gap-3">
              {COUNTRIES.map((c) => (
                <Chip
                  key={c}
                  label={`${COUNTRY_FLAGS[c]} ${COUNTRY_LABELS[c]}`}
                  selected={quiz.country === c}
                  onToggle={() => update({ country: c })}
                />
              ))}
            </div>
          </StepWrapper>
        );
    }
  };

  // --- LOADING ---
  if (view === "loading") {
    return (
      <Layout>
        <Helmet><title>Finding gifts... - Giftmakr</title></Helmet>
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <p className="text-lg text-charcoal/60 mb-8">Finding the perfect gifts...</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-3xl mx-auto">
            {Array.from({ length: 6 }, (_, i) => <ProductCardSkeleton key={i} />)}
          </div>
        </div>
      </Layout>
    );
  }

  // --- RESULTS ---
  if (view === "results") {
    return (
      <Layout>
        <Helmet>
          <title>Gift Ideas for {quiz.recipient || "Someone Special"} - Giftmakr</title>
        </Helmet>
        <div className="max-w-5xl mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="font-heading text-2xl md:text-3xl font-bold text-charcoal">
              {products.length > 0
                ? `We found ${products.length} gift ideas`
                : "No gifts found"}
            </h1>
            {error && (
              <p className="mt-2 text-rose text-sm">{error}</p>
            )}
            {products.length === 0 && !error && (
              <p className="mt-2 text-charcoal/60">
                Try adjusting your budget or interests for more results.
              </p>
            )}
          </div>

          {products.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {products.map((p, i) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  relevanceLabel={getRelevanceLabel(i, products.length)}
                />
              ))}
            </div>
          )}

          <div className="flex justify-center gap-3">
            {(error || products.length === 0) && (
              <Button variant="primary" onClick={submit}>
                <RefreshCw size={16} /> Try again
              </Button>
            )}
            <Button variant="outline" onClick={startOver}>
              Start over
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  // --- QUIZ ---
  return (
    <Layout>
      <Helmet>
        <title>Find Your Perfect Gift - Giftmakr</title>
        <meta name="description" content="Answer a few simple questions to get personalized gift recommendations." />
      </Helmet>
      <div className="max-w-xl mx-auto px-4 py-8">
        <ProgressBar current={step} total={TOTAL_STEPS} />

        <div className="bg-white rounded-xl border border-sage/10 p-6 shadow-sm animate-fade-in" key={step}>
          {renderStep()}
        </div>

        <div className="flex justify-between mt-6">
          <Button variant="ghost" onClick={back} disabled={step === 1}>
            <ArrowLeft size={16} /> Back
          </Button>
          <div className="flex gap-2">
            {step === 5 && (
              <Button variant="ghost" onClick={next}>
                Skip <SkipForward size={14} />
              </Button>
            )}
            <Button
              variant="primary"
              onClick={next}
              disabled={!canProceed()}
            >
              {step < TOTAL_STEPS ? (
                <>Next <ArrowRight size={16} /></>
              ) : (
                "Find gifts"
              )}
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
}

function StepWrapper({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="font-heading text-xl font-bold text-charcoal">{title}</h2>
        {subtitle && <p className="text-sm text-charcoal/50 mt-1">{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add frontend/src/api.ts frontend/src/pages/Find.tsx
git commit -m "feat: add Find page with 7-step quiz and results display"
```

---

### Task 10: Frontend — Static Pages & App Routing

**Files:**
- Create: `frontend/src/pages/About.tsx`
- Create: `frontend/src/pages/Privacy.tsx`
- Create: `frontend/src/pages/Terms.tsx`
- Modify: `frontend/src/App.tsx`

- [ ] **Step 1: Create frontend/src/pages/About.tsx**

```tsx
import { Helmet } from "react-helmet-async";
import Layout from "@/components/Layout";

export default function About() {
  return (
    <Layout>
      <Helmet><title>About - Giftmakr</title></Helmet>
      <div className="max-w-2xl mx-auto px-4 py-12">
        <h1 className="font-heading text-3xl font-bold text-charcoal mb-6">About Giftmakr</h1>
        <div className="space-y-4 text-charcoal/70 leading-relaxed">
          <p>
            Finding the right gift can be stressful. You want something meaningful, within budget,
            and that actually matches the person's interests. Giftmakr helps you do exactly that.
          </p>
          <p>
            Answer a few questions about who the gift is for, and we'll search across Amazon to find
            products that fit. No account needed, no cost to you.
          </p>
          <p>
            We earn a small affiliate commission when you purchase through our links — this keeps
            the service free and doesn't affect your price.
          </p>
          <p>
            Questions? Reach us at{" "}
            <a href="mailto:support@giftmakr.com" className="text-sage hover:underline">
              support@giftmakr.com
            </a>
          </p>
        </div>
      </div>
    </Layout>
  );
}
```

- [ ] **Step 2: Create frontend/src/pages/Privacy.tsx**

```tsx
import { Helmet } from "react-helmet-async";
import Layout from "@/components/Layout";

export default function Privacy() {
  return (
    <Layout>
      <Helmet><title>Privacy Policy - Giftmakr</title></Helmet>
      <div className="max-w-2xl mx-auto px-4 py-12">
        <h1 className="font-heading text-3xl font-bold text-charcoal mb-6">Privacy Policy</h1>
        <div className="space-y-4 text-charcoal/70 leading-relaxed text-sm">
          <p><strong>Last updated:</strong> April 2026</p>
          <h2 className="font-heading text-lg font-bold text-charcoal pt-2">What we collect</h2>
          <p>
            We do not collect personal information. Quiz answers are sent to our server to generate
            recommendations and are not stored after the session ends.
          </p>
          <h2 className="font-heading text-lg font-bold text-charcoal pt-2">Cookies</h2>
          <p>We do not use tracking cookies. No analytics are collected at this time.</p>
          <h2 className="font-heading text-lg font-bold text-charcoal pt-2">Affiliate links</h2>
          <p>
            Product links contain Amazon affiliate tags. When you purchase through these links,
            we receive a small commission at no extra cost to you.
          </p>
          <h2 className="font-heading text-lg font-bold text-charcoal pt-2">Contact</h2>
          <p>
            Questions about privacy? Email{" "}
            <a href="mailto:support@giftmakr.com" className="text-sage hover:underline">support@giftmakr.com</a>
          </p>
        </div>
      </div>
    </Layout>
  );
}
```

- [ ] **Step 3: Create frontend/src/pages/Terms.tsx**

```tsx
import { Helmet } from "react-helmet-async";
import Layout from "@/components/Layout";

export default function Terms() {
  return (
    <Layout>
      <Helmet><title>Terms of Service - Giftmakr</title></Helmet>
      <div className="max-w-2xl mx-auto px-4 py-12">
        <h1 className="font-heading text-3xl font-bold text-charcoal mb-6">Terms of Service</h1>
        <div className="space-y-4 text-charcoal/70 leading-relaxed text-sm">
          <p><strong>Last updated:</strong> April 2026</p>
          <p>
            By using Giftmakr, you agree to these terms. Giftmakr provides gift recommendations
            as suggestions only. We are not responsible for the quality, availability, or pricing
            of products on Amazon.
          </p>
          <p>
            Product prices and availability are determined by Amazon at the time of purchase
            and may differ from what is shown on our site.
          </p>
          <p>
            We reserve the right to modify or discontinue the service at any time without notice.
          </p>
          <p>
            Contact:{" "}
            <a href="mailto:support@giftmakr.com" className="text-sage hover:underline">support@giftmakr.com</a>
          </p>
        </div>
      </div>
    </Layout>
  );
}
```

- [ ] **Step 4: Update frontend/src/App.tsx with all routes**

Replace full contents of `frontend/src/App.tsx`:

```tsx
import { Routes, Route } from "react-router-dom";
import ToastProvider from "@/components/Toast";
import Landing from "@/pages/Landing";
import Find from "@/pages/Find";
import About from "@/pages/About";
import Privacy from "@/pages/Privacy";
import Terms from "@/pages/Terms";

export default function App() {
  return (
    <>
      <ToastProvider />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/find" element={<Find />} />
        <Route path="/about" element={<About />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
      </Routes>
    </>
  );
}
```

- [ ] **Step 5: Verify frontend compiles**

Run: `cd frontend && npx tsc --noEmit`
Expected: No errors

- [ ] **Step 6: Commit**

```bash
git add frontend/src/pages/ frontend/src/App.tsx
git commit -m "feat: add static pages and wire up all routes"
```

---

### Task 11: Docker & Nginx Setup

**Files:**
- Create: `frontend/Dockerfile`
- Create: `backend/Dockerfile`
- Create: `nginx/nginx.conf`
- Create: `docker-compose.yml`
- Create: `.env.example`

- [ ] **Step 1: Create frontend/Dockerfile**

```dockerfile
FROM node:20-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY <<'EOF' /etc/nginx/conf.d/default.conf
server {
    listen 80;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
EOF
EXPOSE 80
```

- [ ] **Step 2: Create backend/Dockerfile**

```dockerfile
FROM node:20-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --production
COPY --from=build /app/dist ./dist
EXPOSE 3001
CMD ["node", "dist/index.js"]
```

- [ ] **Step 3: Create nginx/nginx.conf**

```nginx
events {
    worker_connections 1024;
}

http {
    upstream frontend {
        server frontend:80;
    }

    upstream backend {
        server backend:3001;
    }

    server {
        listen 80;
        server_name giftmakr.com www.giftmakr.com;

        location /.well-known/acme-challenge/ {
            root /var/www/certbot;
        }

        location / {
            return 301 https://$host$request_uri;
        }
    }

    server {
        listen 443 ssl;
        server_name giftmakr.com www.giftmakr.com;

        ssl_certificate /etc/letsencrypt/live/giftmakr.com/fullchain.pem;
        ssl_certificate_key /etc/letsencrypt/live/giftmakr.com/privkey.pem;

        location /api/ {
            proxy_pass http://backend/api/;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        location / {
            proxy_pass http://frontend/;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
        }
    }
}
```

- [ ] **Step 4: Create docker-compose.yml**

```yaml
services:
  backend:
    build: ./backend
    environment:
      - ANTHROPIC_API_KEY=${ANTHROPIC_API_KEY}
      - RAINFOREST_API_KEY=${RAINFOREST_API_KEY}
      - PORT=3001
    restart: unless-stopped

  frontend:
    build: ./frontend
    restart: unless-stopped

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf:ro
      - /etc/letsencrypt:/etc/letsencrypt:ro
      - /var/www/certbot:/var/www/certbot:ro
    depends_on:
      - frontend
      - backend
    restart: unless-stopped
```

- [ ] **Step 5: Create .env.example**

```
ANTHROPIC_API_KEY=sk-ant-...
RAINFOREST_API_KEY=...
```

- [ ] **Step 6: Commit**

```bash
git add frontend/Dockerfile backend/Dockerfile nginx/ docker-compose.yml .env.example
git commit -m "feat: add Docker and Nginx config for production deployment"
```

---

### Task 12: Cleanup & Final Wiring

**Files:**
- Remove: `src/` (old Lovable code)
- Remove: `supabase/` (old Supabase functions)
- Remove: old root config files
- Keep: `.impeccable.md`, `CLAUDE.md`, `docs/`

- [ ] **Step 1: Remove old Lovable source code**

```bash
rm -rf src/ supabase/ public/
rm -f components.json eslint.config.js postcss.config.js tailwind.config.ts tsconfig.app.json tsconfig.node.json vite.config.ts
rm -f bun.lockb package-lock.json
```

- [ ] **Step 2: Update root package.json to workspace scripts**

Replace contents of root `package.json`:

```json
{
  "name": "giftmakr",
  "private": true,
  "scripts": {
    "dev:frontend": "cd frontend && npm run dev",
    "dev:backend": "cd backend && npm run dev",
    "build": "cd frontend && npm run build && cd ../backend && npm run build",
    "docker:up": "docker compose up -d --build",
    "docker:down": "docker compose down"
  }
}
```

- [ ] **Step 3: Create .gitignore if not present**

```
node_modules/
dist/
.env
*.log
```

- [ ] **Step 4: Verify everything builds**

Run: `cd frontend && npm run build` — Expected: Vite builds successfully
Run: `cd backend && npm run build` — Expected: TypeScript compiles to dist/

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: complete Giftmakr rewrite — remove Lovable code, clean project structure"
```

---

### Task 13: Local End-to-End Test

- [ ] **Step 1: Create .env in project root**

```bash
cp .env.example .env
# Fill in ANTHROPIC_API_KEY and RAINFOREST_API_KEY
```

- [ ] **Step 2: Start backend in one terminal**

```bash
cd backend && ANTHROPIC_API_KEY=<key> RAINFOREST_API_KEY=<key> npm run dev
```

Expected: "Backend running on port 3001"

- [ ] **Step 3: Start frontend in another terminal**

```bash
cd frontend && npm run dev
```

Expected: Vite dev server at localhost:5173

- [ ] **Step 4: Manual test flow**

1. Open http://localhost:5173
2. Click "Find a gift"
3. Complete quiz (any answers)
4. Verify loading skeletons appear
5. Verify products appear with prices, images, star ratings
6. Verify "View on Amazon" links have correct partner IDs
7. Verify no price says "$0.00" — should be "Check price on Amazon" instead

- [ ] **Step 5: Test error state**

Stop the backend, submit quiz again.
Expected: Error message appears with "Try again" button.

- [ ] **Step 6: Commit any fixes**

```bash
git add -A
git commit -m "fix: address issues found during e2e testing"
```

---

### Task 14: Deploy to Hetzner VPS

- [ ] **Step 1: Push code to GitHub**

```bash
git push origin main
```

- [ ] **Step 2: SSH into VPS and clone**

```bash
ssh root@<hetzner-ip>
cd /opt
git clone https://github.com/lennystepn-hue/quick-gift-smart-match.git giftmakr
cd giftmakr
```

- [ ] **Step 3: Create .env on server**

```bash
cat > .env <<'EOF'
ANTHROPIC_API_KEY=sk-ant-...
RAINFOREST_API_KEY=...
EOF
```

- [ ] **Step 4: Set up SSL with certbot**

```bash
apt install -y certbot
certbot certonly --standalone -d giftmakr.com -d www.giftmakr.com
```

- [ ] **Step 5: Point DNS to Hetzner VPS**

Update DNS A records for giftmakr.com and www.giftmakr.com to point to the VPS IP.

- [ ] **Step 6: Build and start containers**

```bash
docker compose up -d --build
```

Expected: All 3 containers running. `docker compose ps` shows healthy.

- [ ] **Step 7: Verify live site**

Visit https://giftmakr.com — should show the landing page with warm design.
Complete a quiz — should return product results.

- [ ] **Step 8: Commit any deployment fixes**

```bash
git add -A
git commit -m "fix: deployment adjustments"
git push origin main
```
