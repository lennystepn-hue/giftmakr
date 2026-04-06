import { Router, Request, Response } from "express";
import { generateSearchTerms } from "../services/claude.js";
import { searchProducts } from "../services/scraper.js";
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
      console.error("Scraper error:", err);
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
