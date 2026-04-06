interface QuizInput {
  recipient: string;
  occasion: string;
  age: string;
  minBudget: number;
  maxBudget: number;
  interests: string[];
  customInterest: string;
  gender: string;
  hobby: string;
  currency?: string;
  language?: string;
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
${quiz.age ? `- Age range: ${quiz.age} years old` : ""}
- Budget: ${quiz.minBudget} - ${quiz.maxBudget} ${quiz.currency || "EUR"}
- Interests: ${allInterests.join(", ") || "none specified"}
${quiz.gender ? `- Gender: ${quiz.gender}` : ""}
${quiz.hobby ? `- Hobby/passion: ${quiz.hobby}` : ""}
- Amazon store language: ${quiz.language || "English"}

Suggest 20 specific Amazon search terms for gifts.`;

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: 1024,
      system: `You are a gift recommendation assistant. Given details about a gift recipient, suggest 20 specific Amazon search terms that would find good, thoughtful gifts within their budget.

Return ONLY valid JSON: { "searchTerms": ["term1", "term2", ...] }

Rules:
- Use the Amazon store language specified (e.g. German terms for German Amazon, Spanish for Spanish Amazon, etc.)
- Be specific (e.g. "kabellose Kopfhörer Bluetooth" not just "Elektronik")
- Every term MUST be something that makes a good GIFT — something you'd be happy to unwrap
- NEVER suggest: tools, scissors, office supplies, cleaning products, batteries, cables, adapters, tape, glue, storage boxes, or anything utilitarian/boring
- Mix practical, fun, and unique ideas
- Each term should be a realistic Amazon search query that returns giftable products
- Think about what would make the recipient smile`,
      messages: [{ role: "user", content: userPrompt }],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Claude API error:", response.status, errorText);
    throw new Error(`Claude API error: ${response.status}`);
  }

  const data = await response.json();
  let text: string = data.content[0]?.text;

  if (!text) {
    throw new Error("Empty response from Claude");
  }

  // Strip markdown code fences if present
  text = text.replace(/^```(?:json)?\s*\n?/i, "").replace(/\n?```\s*$/i, "").trim();

  const parsed: ClaudeResponse = JSON.parse(text);

  if (!Array.isArray(parsed.searchTerms) || parsed.searchTerms.length === 0) {
    throw new Error("Claude returned no search terms");
  }

  return parsed.searchTerms;
}
