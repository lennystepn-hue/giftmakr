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
