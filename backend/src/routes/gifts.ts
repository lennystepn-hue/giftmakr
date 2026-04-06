import { Router, Request, Response } from "express";
import { getPage, getAllSlugs, loadPages } from "../services/giftPages.js";
import { PARTNER_IDS, AMAZON_DOMAINS, type CountryCode } from "../constants.js";

const router = Router();

function escapeHtml(str: string): string {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

// Dynamic sitemap of all gift pages
router.get("/sitemap-gifts.xml", (_req: Request, res: Response) => {
  const pages = loadPages();
  const urls = pages.map(p => `  <url>
    <loc>https://giftmakr.com/gifts/${p.slug}</loc>
    <lastmod>${p.createdAt.split("T")[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`).join("\n");

  res.type("application/xml").send(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`);
});

// Gift page as server-rendered HTML
router.get("/:slug", (req: Request, res: Response) => {
  const page = getPage(req.params.slug);
  if (!page) {
    res.status(404).send("Not found");
    return;
  }

  const country = (page.country || "DE") as CountryCode;
  const domain = AMAZON_DOMAINS[country] || AMAZON_DOMAINS.DE;
  const partnerId = PARTNER_IDS[country] || PARTNER_IDS.DE;

  const productCards = page.products.slice(0, 12).map(p => {
    const priceStr = p.price != null ? `${p.currencySymbol || "€"}${p.price}` : "See price";
    const stars = "★".repeat(Math.round(p.stars || 0)) + "☆".repeat(5 - Math.round(p.stars || 0));
    const link = p.link || `https://www.${domain}/dp/${p.asin}?tag=${partnerId}`;

    return `<div class="product">
      <a href="${escapeHtml(link)}" target="_blank" rel="noopener noreferrer nofollow">
        ${p.image ? `<img src="${escapeHtml(p.image)}" alt="${escapeHtml(p.name)}" loading="lazy" />` : ""}
        <h3>${escapeHtml(p.name)}</h3>
        <div class="meta">
          <span class="price">${escapeHtml(priceStr)}</span>
          <span class="stars">${stars}</span>
          ${p.reviews ? `<span class="reviews">(${p.reviews})</span>` : ""}
        </div>
        <span class="cta">View on Amazon →</span>
      </a>
    </div>`;
  }).join("\n");

  const interestsStr = page.interests.length > 0 ? page.interests.join(", ") : "";
  const schemaProducts = page.products.slice(0, 12).map(p => ({
    "@type": "Product",
    "name": p.name,
    "image": p.image || "",
    "offers": {
      "@type": "Offer",
      "price": p.price || 0,
      "priceCurrency": page.currency || "EUR",
      "availability": "https://schema.org/InStock",
    },
    ...(p.stars ? { "aggregateRating": { "@type": "AggregateRating", "ratingValue": p.stars, "reviewCount": p.reviews || 1 } } : {}),
  }));

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(page.title)} | Giftmakr</title>
  <meta name="description" content="${escapeHtml(page.description)}">
  <link rel="canonical" href="https://giftmakr.com/gifts/${escapeHtml(page.slug)}">
  <link rel="icon" type="image/svg+xml" href="/favicon.svg">
  <meta property="og:title" content="${escapeHtml(page.title)}">
  <meta property="og:description" content="${escapeHtml(page.description)}">
  <meta property="og:type" content="website">
  <meta property="og:url" content="https://giftmakr.com/gifts/${escapeHtml(page.slug)}">
  <meta name="robots" content="index, follow">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Nunito:wght@700;800&display=swap" rel="stylesheet">
  <script type="application/ld+json">${JSON.stringify({
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": page.title,
    "description": page.description,
    "url": `https://giftmakr.com/gifts/${page.slug}`,
    "numberOfItems": page.products.length,
    "itemListElement": schemaProducts.map((p, i) => ({
      "@type": "ListItem",
      "position": i + 1,
      "item": p,
    })),
  })}</script>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Inter', system-ui, sans-serif; background: #FDF8F4; color: #3D3D3D; }
    .container { max-width: 1100px; margin: 0 auto; padding: 2rem 1rem; }
    h1 { font-family: 'Nunito', sans-serif; font-size: 2rem; font-weight: 800; margin-bottom: 0.5rem; color: #3D3D3D; }
    h2 { font-family: 'Nunito', sans-serif; font-size: 1.3rem; font-weight: 700; margin: 2rem 0 1rem; color: #3D3D3D; }
    .subtitle { color: #3D3D3D99; margin-bottom: 2rem; }
    .breadcrumb { font-size: 0.85rem; color: #3D3D3D80; margin-bottom: 1.5rem; }
    .breadcrumb a { color: #7C9082; text-decoration: none; }
    .breadcrumb a:hover { text-decoration: underline; }
    .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 1.25rem; }
    .product { background: white; border: 1px solid rgba(124,144,130,0.1); border-radius: 12px; overflow: hidden; transition: transform 0.2s, box-shadow 0.2s; }
    .product:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.08); }
    .product a { text-decoration: none; color: inherit; display: block; padding: 1rem; }
    .product img { width: 100%; height: 180px; object-fit: contain; margin-bottom: 0.75rem; background: #faf7f2; border-radius: 8px; }
    .product h3 { font-size: 0.85rem; font-weight: 500; line-height: 1.4; margin-bottom: 0.5rem; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
    .meta { display: flex; align-items: center; gap: 0.5rem; font-size: 0.8rem; margin-bottom: 0.75rem; }
    .price { font-weight: 700; color: #7C9082; }
    .stars { color: #F4A261; }
    .reviews { color: #3D3D3D80; }
    .cta { display: inline-block; background: #F4A261; color: white; padding: 0.4rem 1rem; border-radius: 999px; font-size: 0.8rem; font-weight: 600; }
    .back { display: inline-flex; align-items: center; gap: 0.4rem; margin-top: 2rem; padding: 0.6rem 1.5rem; background: #7C9082; color: white; border-radius: 999px; text-decoration: none; font-weight: 600; font-size: 0.9rem; }
    .back:hover { opacity: 0.9; }
    .tags { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 1.5rem; }
    .tag { background: rgba(124,144,130,0.1); padding: 0.3rem 0.8rem; border-radius: 999px; font-size: 0.75rem; color: #7C9082; font-weight: 500; }
    footer { text-align: center; padding: 2rem; color: #3D3D3D60; font-size: 0.8rem; }
    footer a { color: #7C9082; text-decoration: none; }
  </style>
</head>
<body>
  <div class="container">
    <nav class="breadcrumb">
      <a href="/">Giftmakr</a> → <a href="/find">Gift Finder</a> → ${escapeHtml(page.title)}
    </nav>
    <h1>${escapeHtml(page.title)}</h1>
    <p class="subtitle">${escapeHtml(page.description)}</p>
    <div class="tags">
      <span class="tag">${escapeHtml(page.occasion || "Gift")}</span>
      <span class="tag">For ${escapeHtml(page.recipient || "Someone Special")}</span>
      ${interestsStr ? page.interests.map(i => `<span class="tag">${escapeHtml(i)}</span>`).join("") : ""}
      <span class="tag">${escapeHtml(page.currency || "€")} ${page.minBudget}–${page.maxBudget}</span>
    </div>
    <h2>${page.products.length} Gift Ideas Found</h2>
    <div class="grid">
      ${productCards}
    </div>
    <a href="/find" class="back">← Find more gifts</a>
  </div>
  <footer>
    <a href="/">Giftmakr</a> — AI-powered gift recommendations. Free, no signup.
  </footer>
</body>
</html>`;

  res.type("html").send(html);
});

export default router;
