# Giftmakr

AI-powered gift recommendation app. Domain: giftmakr.com

## Design Context

See `.impeccable.md` for full design guidelines. Key points:

- **Brand:** Warm, personal, helpful — like a thoughtful friend, not an algorithm
- **Colors:** Sage green primary (#7C9082), soft apricot accent (#F4A261), warm cream bg (#FDF8F4)
- **No AI aesthetic:** No gradients, shimmer, sparkle. Invisible AI. Warm minimalism.
- **Mobile-first**, light mode only
- **Animations:** Subtle fade-ins only, no decorative animations

## Tech Stack

- React 18 + TypeScript + Vite + Tailwind CSS
- Backend: Self-hosted on Hetzner VPS (Docker)
- AI: Claude API via OAuth
- Product data: Rainforest API (Amazon)
- Affiliate: Amazon Partner IDs for 8 countries (DE, ES, UK, US, CA, FR, IT, NL)

## Deployment

- Domain: giftmakr.com
- Server: Hetzner VPS with Docker
