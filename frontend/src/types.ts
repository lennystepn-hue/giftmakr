export type CountryCode = "DE" | "ES" | "UK" | "US" | "CA" | "FR" | "IT" | "NL";

export interface QuizState {
  recipient: string;
  occasion: string;
  age: string;
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
  age: "",
  minBudget: 50,
  maxBudget: 150,
  interests: [],
  customInterest: "",
  gender: "",
  country: "DE",
  hobby: "",
};
