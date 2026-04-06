<p align="center">
  <img src="frontend/public/favicon.svg" alt="Giftmakr" width="64" height="64" />
</p>

<h1 align="center">Giftmakr</h1>

<p align="center">
  <strong>Find the perfect gift for anyone, any occasion.</strong><br/>
  AI-powered gift recommendations from Amazon — free, instant, no signup.
</p>

<p align="center">
  <a href="https://giftmakr.com">giftmakr.com</a>
</p>

---

## How It Works

1. **Answer 7 quick questions** about the recipient, occasion, budget, and interests
2. **AI generates smart search terms** tailored to your answers
3. **Products are fetched from Amazon**, filtered by budget, and sorted by rating
4. **Pick your favorite** and buy directly on Amazon

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, TypeScript, Vite, Tailwind CSS |
| **Backend** | Node.js, Express, TypeScript |
| **AI** | Claude API (Haiku 4.5) for search term generation |
| **Product Data** | Scrape.do API (Amazon search) |
| **Infrastructure** | Docker, Nginx, Let's Encrypt, Hetzner VPS |

## Features

- 7-step conversational quiz with auto-advance
- Personalized gift recommendations powered by AI
- Multi-country support: DE, ES, UK, US, CA, FR, IT, NL
- Amazon affiliate integration with localized partner IDs
- Budget filtering with smart tolerance
- Mobile-first responsive design
- SEO optimized with structured data, sitemap, and llms.txt

## Getting Started

### Prerequisites

- Node.js 20+
- An [Anthropic API key](https://console.anthropic.com)
- A [Scrape.do API key](https://scrape.do)

### Setup

```bash
# Clone the repository
git clone https://github.com/lennystepn-hue/giftmakr.git
cd giftmakr

# Configure environment
cp .env.example .env
# Add your API keys to .env

# Install dependencies
cd backend && npm install && cd ..
cd frontend && npm install && cd ..

# Start development
# Terminal 1 - Backend
cd backend && npm run dev

# Terminal 2 - Frontend
cd frontend && npm run dev
```

The frontend runs on `http://localhost:5173` and the backend on `http://localhost:3001`.

### Docker Deployment

```bash
docker compose build
docker compose up -d
```

## Project Structure

```
giftmakr/
  backend/
    src/
      routes/recommend.ts    # POST /api/recommend endpoint
      services/claude.ts     # AI search term generation
      services/scraper.ts    # Amazon product search
      constants.ts           # Country configs, affiliate IDs
  frontend/
    src/
      pages/
        Landing.tsx           # Hero, social proof, FAQ
        Find.tsx              # 7-step quiz + results
      components/             # Reusable UI components
    public/
      robots.txt, sitemap.xml, llms.txt, favicon.svg
```

## Environment Variables

| Variable | Description |
|----------|------------|
| `ANTHROPIC_API_KEY` | Anthropic API key for Claude |
| `SCRAPEDO_API_KEY` | Scrape.do API key for Amazon search |

## Design Philosophy

Warm, personal, helpful — like a thoughtful friend, not an algorithm. The AI is invisible; the experience feels human. Minimal UI with sage green and soft apricot tones. No gradients, shimmer, or "AI-powered" badges in the interface.

## License

MIT

---

<p align="center">
  Built by <a href="https://github.com/lennystepn-hue">Lenny Enderle</a>
</p>
