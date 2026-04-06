# Giftmakr Rewrite — Design Spec

## Overview

Complete rewrite of the Lovable-generated Giftmakr gift recommendation app. Same concept (AI-powered gift quiz → Amazon product results), but rebuilt clean with proper architecture, self-hosted on Hetzner VPS, Claude API instead of OpenAI, and a warm/personal UI that doesn't look like every other AI tool.

## Architecture

### Stack

- **Frontend:** React 18 + TypeScript + Vite + Tailwind CSS
- **Backend:** Express.js API server (Node.js)
- **AI:** Anthropic Claude API (claude-haiku-4-5-20251001 for speed/cost, upgradable to sonnet) via OAuth
- **Product data:** Rainforest API (Amazon product search)
- **Deployment:** Docker Compose on Hetzner VPS, Nginx reverse proxy, SSL via Let's Encrypt
- **Domain:** giftmakr.com

### Container Architecture

```
docker-compose.yml
├── frontend (Nginx serving static Vite build)
├── backend (Express.js API)
└── nginx (reverse proxy + SSL termination)
    ├── giftmakr.com → frontend
    └── giftmakr.com/api/* → backend
```

### API Design

The backend exposes a single endpoint:

```
POST /api/recommend
Body: { quizState: QuizState, country: CountryCode }
Response: { products: Product[], error?: string }
```

The backend handles:
1. Calling Claude to generate search categories/keywords from quiz answers
2. Calling Rainforest API with those keywords on the country-specific Amazon domain
3. Deduplicating, sorting, and returning products with affiliate links

This keeps API keys server-side and the frontend simple.

## Data Flow

```
User completes quiz
  → Frontend POST /api/recommend with QuizState + detected country
  → Backend calls Claude API: "Given this person, suggest Amazon search terms"
  → Claude returns JSON: { categories: [...], keywords: [...] }
  → Backend picks 15-20 random categories, batches into 4 groups of ~5
  → Backend calls Rainforest API in parallel (4 requests)
  → Backend deduplicates by ASIN, sorts by rating/reviews
  → Backend maps to Product format with country-specific affiliate links
  → Backend returns products to frontend
  → Frontend displays product cards
```

## Pages

### 1. Landing Page (`/`)

- Hero section with headline, subtext, and CTA button
- Brief "how it works" (3 steps: answer questions → AI finds gifts → browse results)
- FAQ accordion
- No blog, no "known from" section, no ads

### 2. Quiz Page (`/find`)

7-step wizard (same as current, proven flow):

1. **Recipient** — Who is this gift for? (Partner, Friend, Parent, Sibling, Child, Colleague, Other)
2. **Occasion** — What's the occasion? (Birthday, Christmas, Anniversary, Valentine's, Wedding, Thank You, Just Because, Other)
3. **Budget** — Min/max range slider
4. **Interests** — Multi-select chips + free text custom interest
5. **Gender** — Male / Female / Prefer not to say
6. **Country** — Auto-detected, selectable (DE, ES, UK, US, CA, FR, IT, NL)
7. **Hobby** — Free text input for specific hobby/passion

Progress indicator at top. Back/Next navigation. Smooth transitions between steps.

### 3. Results Page (`/find` — same route, state-driven)

- Loading state with friendly message (not "AI is thinking" — more like "Finding gifts...")
- Product grid (responsive: 1 col mobile, 2 col tablet, 3 col desktop)
- Each product card shows: image, name, price, star rating, relevance label, "View on Amazon" button
- "Start over" button
- Error state with clear message + retry button if API fails

### 4. Static Pages

- `/about` — minimal
- `/privacy` — privacy policy
- `/terms` — terms of service

## UI/UX Design

### Color Palette (from .impeccable.md)

| Role | Color | Hex |
|------|-------|-----|
| Primary | Sage green | #7C9082 |
| Accent | Soft apricot | #F4A261 |
| Background | Warm cream | #FDF8F4 |
| Text | Warm charcoal | #3D3D3D |
| Secondary | Dusty rose | #D4A0A0 |
| Match indicator | Muted gold | #C9A96E |

### Typography

- Headings: Nunito (rounded, friendly)
- Body: Inter (clean, readable)
- Both loaded from Google Fonts

### Components (only what we need)

- Button (primary, secondary, ghost variants)
- Card (for products)
- Input, Textarea, Select
- Slider (for budget range)
- Chip/Tag (for interests selection)
- Progress bar (for quiz steps)
- Accordion (for FAQ)
- Toast/notification (for errors)
- Skeleton loader (for loading states)

No shadcn/ui library dump. Hand-built components with Tailwind, keep it lean.

### Animations

- Page/step transitions: subtle fade-in (200ms ease-out)
- Button hover: gentle scale (1.02) + shadow
- Card hover: subtle lift + shadow
- Loading: simple pulsing dots or progress bar — no sparkles, no "AI brain" graphics
- Nothing floating, spinning, or shimmering

### Relevance Labels

Products get labeled based on position in sorted results:
- Top 20%: "Perfect Match" (muted gold badge)
- Next 30%: "Great Pick" (sage green badge)
- Next 30%: "Worth a Look" (neutral badge)
- Bottom 20%: no label

### Mobile-First

- Quiz steps: full-width cards, large touch targets (min 44px)
- Results: single column, cards stack vertically
- Budget slider: easy to drag on touch
- Interest chips: wrap naturally, easy to tap

## Error Handling

Every error path shows a user-visible message. No silent empty arrays.

| Scenario | User sees |
|----------|-----------|
| Claude API fails | "We couldn't generate recommendations right now. Please try again." + Retry button |
| Rainforest API fails | Same message + Retry button |
| No products found | "We couldn't find gifts matching your criteria. Try adjusting your budget or interests." + Edit quiz button |
| Network error | "Connection issue. Please check your internet and try again." |
| Product has no price | Show "Check price on Amazon" instead of fake price |

## Price Handling

Remove all price manipulation logic. The current code multiplies prices by arbitrary factors and generates random prices — this destroys trust.

New approach:
- Use the price from Rainforest API as-is
- If price is 0 or missing: show "Check price on Amazon" on the card
- Filter products by budget range with 20% tolerance (not 30%)
- Never generate fake prices

## Claude AI Integration

### Prompt

System prompt (simplified from current over-engineered version):

```
You are a gift recommendation assistant. Given details about a gift recipient,
suggest 20 specific Amazon search terms that would find good gifts.

Return JSON: { "searchTerms": ["term1", "term2", ...] }

Keep terms in English. Be specific (e.g., "wireless noise cancelling headphones"
not just "electronics"). Mix practical, fun, and unique ideas.
```

User prompt includes: recipient type, occasion, budget range, interests, gender, hobby.

### Why fewer terms (20 vs 35-50)

The current approach asks for 35-50 categories AND 35-50 keywords, then only uses 20 random ones anyway. We ask for 20 targeted search terms directly — less waste, faster response, cheaper API call.

## Affiliate Links

Keep the same Amazon Partner IDs for all 8 countries. The backend constructs affiliate URLs:

```
https://www.{amazon_domain}/dp/{ASIN}?tag={partner_id}
```

Clean URL construction, no regex cleanup of existing tags needed since we build from scratch.

## SEO

- Server-rendered `<head>` with title, description, OG tags per page
- Structured data (Schema.org WebApplication) on landing page
- Clean URLs (`/find` instead of `/getgift`)
- Proper meta robots
- Remove Lovable branding, gptengineer script, lovable OG images

## What We Drop

- All 60+ shadcn/ui components (replace with ~10 hand-built ones)
- Supabase dependency entirely
- Blog system
- AdSense integration
- SavedList feature (localStorage saved lists — unused complexity)
- ThoughtBubbles, LoadingScreen with AI animations
- Lovable tagger, gptengineer script
- Dark mode support
- All decorative floating icons
- recharts, cmdk, embla-carousel, jspdf-autotable, react-day-picker, react-resizable-panels, vaul, input-otp, react-hook-form (unused)

## Deployment

### Docker Compose Setup

```yaml
services:
  backend:
    build: ./backend
    environment:
      - ANTHROPIC_API_KEY=${ANTHROPIC_API_KEY}
      - RAINFOREST_API_KEY=${RAINFOREST_API_KEY}
    ports:
      - "3001:3001"

  frontend:
    build: ./frontend
    ports:
      - "3000:80"

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf
      - /etc/letsencrypt:/etc/letsencrypt
    depends_on:
      - frontend
      - backend
```

### Deployment Process

1. Push to GitHub
2. SSH to Hetzner VPS
3. `git pull && docker compose up -d --build`

(Can add GitHub Actions later for auto-deploy, but start simple.)

## Success Criteria

- Quiz → results flow works end-to-end with Claude + Rainforest
- All errors show user-visible messages
- No fake prices anywhere
- Loads fast on mobile (< 3s first contentful paint)
- Affiliate links work with correct country-specific partner IDs
- Deployed on Hetzner VPS at giftmakr.com
