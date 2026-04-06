<p align="center">
  <img src="frontend/public/favicon.svg" alt="Giftmakr" width="80" height="80" />
</p>

<h1 align="center">Giftmakr</h1>

<p align="center">
  <strong>AI-powered gift recommendations for any occasion.</strong><br/>
  Answer a few questions. Get curated gift ideas from Amazon. Free, instant, no signup.
</p>

<p align="center">
  <a href="https://giftmakr.com"><strong>giftmakr.com</strong></a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/react-18-61DAFB?logo=react&logoColor=white" alt="React" />
  <img src="https://img.shields.io/badge/node.js-20-5FA04E?logo=nodedotjs&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/claude-sonnet%204.6-D97757?logo=anthropic&logoColor=white" alt="Claude" />
  <img src="https://img.shields.io/badge/docker-deployed-2496ED?logo=docker&logoColor=white" alt="Docker" />
  <img src="https://img.shields.io/badge/license-MIT-green" alt="MIT" />
</p>

---

## How It Works

```
 Quiz (8 steps)          Claude Sonnet 4.6          Amazon (Scrape.do)
┌──────────────┐      ┌──────────────────┐      ┌───────────────────┐
│ Recipient    │      │                  │      │                   │
│ Occasion     │─────>│  Generate 20     │─────>│  Search products  │
│ Age          │      │  search terms    │      │  Filter by budget │
│ Budget       │      │                  │      │  Sort by rating   │
│ Interests    │      └──────────────────┘      └───────────────────┘
│ Hobby        │                                         │
│ Gender       │              ┌──────────────────┐       │
│ Country      │              │  SEO Gift Page   │<──────┘
└──────────────┘              │  /gifts/:slug    │
                              └──────────────────┘
```

1. **8-step conversational quiz** — recipient, occasion, age, budget, interests, hobby, gender, country
2. **Claude Sonnet 4.6** generates 20 targeted Amazon search terms based on answers
3. **Scrape.do** fetches real products from Amazon, filtered by budget and sorted by rating
4. **Results page** with affiliate links — every search also creates a public SEO page

## Features

- **Smart recommendations** — Claude generates context-aware search terms, not generic keywords
- **Multi-country** — DE, ES, UK, US, CA, FR, IT, NL with localized search terms, currencies, and affiliate IDs
- **Programmatic SEO** — every user search creates an indexable page at `/gifts/:slug`, building a long-tail keyword library over time
- **Auto-advance quiz** — single-select steps advance automatically for a fast, app-like experience
- **Age-appropriate** — age ranges from 0-2 to 65+ ensure relevant gift suggestions
- **No junk results** — prompt engineering excludes tools, office supplies, cables, and other non-gift items
- **Mobile-first** — responsive design, sticky CTA on mobile
- **Full SEO** — FAQ schema, sitemap index, structured data, llms.txt, OG tags

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, TypeScript, Vite, Tailwind CSS |
| **Backend** | Node.js 20, Express, TypeScript |
| **AI** | Claude Sonnet 4.6 via Anthropic API |
| **Product Data** | Scrape.do (Amazon search API) |
| **Infrastructure** | Docker, Nginx, Let's Encrypt, Hetzner VPS |
| **SEO** | Dynamic sitemaps, FAQ schema, programmatic pages |

## Getting Started

### Prerequisites

- Node.js 20+
- [Anthropic API key](https://console.anthropic.com)
- [Scrape.do API key](https://scrape.do)

### Development

```bash
git clone https://github.com/lennystepn-hue/giftmakr.git
cd giftmakr

# Configure environment
cp .env.example .env
# Add your API keys to .env

# Backend (Terminal 1)
cd backend && npm install && npm run dev

# Frontend (Terminal 2)
cd frontend && npm install && npm run dev
```

Frontend runs on `http://localhost:5173`, backend on `http://localhost:3001`.

### Production

```bash
docker compose build
docker compose up -d
```

## Project Structure

```
giftmakr/
├── backend/
│   └── src/
│       ├── routes/
│       │   ├── recommend.ts        # POST /api/recommend — quiz → products
│       │   └── gifts.ts            # GET /gifts/:slug — SEO pages
│       ├── services/
│       │   ├── claude.ts           # Claude API integration
│       │   ├── scraper.ts          # Scrape.do Amazon search
│       │   └── giftPages.ts        # Programmatic SEO page storage
│       └── constants.ts            # Country configs, affiliate IDs
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Landing.tsx         # Hero, social proof, testimonials, FAQ
│   │   │   └── Find.tsx            # 8-step quiz + results
│   │   └── components/             # Button, Chip, ProductCard, etc.
│   └── public/
│       ├── sitemap.xml             # Sitemap index
│       ├── sitemap-main.xml        # Static pages
│       ├── robots.txt
│       ├── llms.txt
│       └── favicon.svg
├── docker-compose.yml
└── .env.example
```

## License

MIT

---

<p align="center">
  Built by <a href="https://github.com/lennystepn-hue">Lenny Enderle</a>
</p>
