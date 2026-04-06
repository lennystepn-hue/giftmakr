import express from "express";
import cors from "cors";
import recommendRouter from "./routes/recommend.js";
import giftsRouter from "./routes/gifts.js";

const app = express();
const PORT = parseInt(process.env.PORT || "3001");

app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/recommend", recommendRouter);
app.use("/gifts", giftsRouter);

// Recent searches for landing page
import { getRecentPages } from "./services/giftPages.js";
app.get("/api/recent", (_req, res) => {
  const recent = getRecentPages(6).map(p => ({
    slug: p.slug,
    title: p.title,
    recipient: p.recipient,
    occasion: p.occasion,
    productCount: p.products.length,
    topProduct: p.products[0] ? { name: p.products[0].name, image: p.products[0].image } : null,
  }));
  res.json(recent);
});

app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
