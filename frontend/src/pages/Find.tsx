import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { ArrowLeft, ArrowRight, SkipForward, RefreshCw, Sparkles, Gift, Heart, Users, UserRound, Baby, Briefcase, CircleHelp, Cake, TreePine, Gem, HeartHandshake, Church, GraduationCap } from "lucide-react";
import Layout from "@/components/Layout";
import Button from "@/components/Button";
import Chip from "@/components/Chip";
import RangeSlider from "@/components/RangeSlider";
import ProgressBar from "@/components/ProgressBar";
import ProductCard from "@/components/ProductCard";
import { ProductCardSkeleton } from "@/components/Skeleton";
import { QuizState, Product, INITIAL_QUIZ_STATE, RelevanceLabel } from "@/types";
import { detectUserCountry, COUNTRY_FLAGS, COUNTRY_LABELS, CURRENCY_SYMBOLS } from "@/utils/country";
import { fetchRecommendations } from "@/api";
import type { CountryCode } from "@/types";

const RECIPIENTS = [
  { value: "partner", label: "Partner", Icon: Heart },
  { value: "friend", label: "Friend", Icon: Users },
  { value: "parent", label: "Parent", Icon: UserRound },
  { value: "sibling", label: "Sibling", Icon: Users },
  { value: "child", label: "Child", Icon: Baby },
  { value: "colleague", label: "Colleague", Icon: Briefcase },
  { value: "other", label: "Other", Icon: CircleHelp },
];
const OCCASIONS = [
  { value: "birthday", label: "Birthday", Icon: Cake },
  { value: "christmas", label: "Christmas", Icon: TreePine },
  { value: "anniversary", label: "Anniversary", Icon: Gem },
  { value: "valentine's", label: "Valentine's", Icon: HeartHandshake },
  { value: "wedding", label: "Wedding", Icon: Church },
  { value: "thank you", label: "Thank You", Icon: Gift },
  { value: "graduation", label: "Graduation", Icon: GraduationCap },
  { value: "just because", label: "Just Because", Icon: Sparkles },
];
const INTERESTS = ["Technology", "Books", "Fashion", "Home", "Cooking", "Fitness", "Outdoors", "Gaming", "Music", "Art", "Travel", "Beauty", "Sports"];
const GENDERS: { value: QuizState["gender"]; label: string }[] = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "other", label: "Prefer not to say" },
];
const COUNTRIES: CountryCode[] = ["DE", "ES", "UK", "US", "CA", "FR", "IT", "NL"];

const STEP_CONFIG = [
  { title: "Who's the lucky one?", subtitle: "Let's find them something special" },
  { title: "What's the occasion?", subtitle: "" },
  { title: "What's the budget?", subtitle: "" },
  { title: "What are they into?", subtitle: "Pick as many as you like" },
  { title: "Any specific hobby or passion?", subtitle: "Optional — helps us find more targeted gifts" },
  { title: "One more thing — gender?", subtitle: "Helps us narrow down the best options" },
  { title: "Almost there! Which Amazon store?", subtitle: "We'll find products available in your region" },
];

type View = "quiz" | "loading" | "results";

export default function Find() {
  const [searchParams] = useSearchParams();
  const preselectedOccasion = searchParams.get("occasion") || "";

  const [view, setView] = useState<View>("quiz");
  const [step, setStep] = useState(preselectedOccasion ? 1 : 1);
  const [quiz, setQuiz] = useState<QuizState>({
    ...INITIAL_QUIZ_STATE,
    country: detectUserCountry(),
    occasion: preselectedOccasion,
  });
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [customInput, setCustomInput] = useState("");

  const TOTAL_STEPS = 7;
  const [slideDir, setSlideDir] = useState<"right" | "left">("right");

  const update = (partial: Partial<QuizState>) => setQuiz((prev) => ({ ...prev, ...partial }));

  // Auto-advance for single-select steps (recipient, occasion, gender)
  const selectAndAdvance = (partial: Partial<QuizState>) => {
    update(partial);
    setTimeout(() => {
      setSlideDir("right");
      if (step < TOTAL_STEPS) setStep((s) => s + 1);
      else submit();
    }, 250);
  };

  // Dynamic subtitle based on selections
  const getDynamicSubtitle = () => {
    const cfg = STEP_CONFIG[step - 1];
    if (step === 2 && quiz.recipient) {
      return `A gift for your ${quiz.recipient} — nice!`;
    }
    if (step === 3 && quiz.occasion) {
      const occ = OCCASIONS.find((o) => o.value === quiz.occasion);
      return `${occ?.label || quiz.occasion} gift for your ${quiz.recipient || "someone special"}`;
    }
    if (step >= 4 && quiz.recipient && quiz.occasion) {
      const occ = OCCASIONS.find((o) => o.value === quiz.occasion);
      return cfg.subtitle || `${occ?.label || quiz.occasion} gift for your ${quiz.recipient}`;
    }
    return cfg.subtitle;
  };

  const canProceed = () => {
    switch (step) {
      case 1: return !!quiz.recipient;
      case 2: return !!quiz.occasion;
      case 3: return quiz.minBudget > 0 && quiz.maxBudget > quiz.minBudget;
      case 4: return quiz.interests.length > 0;
      case 5: return true;
      case 6: return !!quiz.gender;
      case 7: return !!quiz.country;
      default: return false;
    }
  };

  const next = () => {
    setSlideDir("right");
    if (step < TOTAL_STEPS) {
      setStep(step + 1);
    } else {
      submit();
    }
  };

  const back = () => {
    setSlideDir("left");
    if (view === "results" || view === "loading") {
      setView("quiz");
      setStep(TOTAL_STEPS);
    } else if (step > 1) {
      setStep(step - 1);
    }
  };

  const submit = async () => {
    setView("loading");
    setError(null);
    setProducts([]);

    const result = await fetchRecommendations(quiz, quiz.country);

    if (result.error) {
      setError(result.error);
      toast.error(result.error);
    }
    setProducts(result.products);
    setView("results");
  };

  const startOver = () => {
    setQuiz({ ...INITIAL_QUIZ_STATE, country: detectUserCountry() });
    setStep(1);
    setView("quiz");
    setError(null);
    setProducts([]);
  };

  const addCustomInterest = () => {
    const trimmed = customInput.trim();
    if (trimmed && !quiz.interests.includes(trimmed)) {
      update({ interests: [...quiz.interests, trimmed] });
      setCustomInput("");
    }
  };

  const toggleInterest = (interest: string) => {
    const exists = quiz.interests.includes(interest);
    update({
      interests: exists
        ? quiz.interests.filter((i) => i !== interest)
        : [...quiz.interests, interest],
    });
  };

  const getRelevanceLabel = (index: number, total: number): RelevanceLabel | undefined => {
    if (total === 0) return undefined;
    const pct = index / total;
    if (pct < 0.2) return "Perfect Match";
    if (pct < 0.5) return "Great Pick";
    if (pct < 0.8) return "Worth a Look";
    return undefined;
  };

  const currencyLabel = CURRENCY_SYMBOLS[quiz.country] || "\u20AC";

  const renderStep = () => {
    const cfg = STEP_CONFIG[step - 1];
    const subtitle = getDynamicSubtitle();

    switch (step) {
      case 1:
        return (
          <StepWrapper title={cfg.title} subtitle={subtitle}>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {RECIPIENTS.map((r) => (
                <button
                  key={r.value}
                  onClick={() => selectAndAdvance({ recipient: r.value })}
                  className={`flex flex-col items-center gap-2.5 p-4 rounded-xl border-2 transition-all duration-200 hover:scale-[1.04] ${
                    quiz.recipient === r.value
                      ? "border-sage bg-sage/10 shadow-sm"
                      : "border-sage/10 hover:border-sage/30 bg-white"
                  }`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${quiz.recipient === r.value ? "bg-sage/20" : "bg-sage/8"}`}>
                    <r.Icon size={20} strokeWidth={1.5} className={quiz.recipient === r.value ? "text-sage" : "text-charcoal/40"} />
                  </div>
                  <span className={`text-sm font-medium ${quiz.recipient === r.value ? "text-sage" : "text-charcoal"}`}>{r.label}</span>
                </button>
              ))}
            </div>
          </StepWrapper>
        );
      case 2:
        return (
          <StepWrapper title={cfg.title} subtitle={subtitle}>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {OCCASIONS.map((o) => (
                <button
                  key={o.value}
                  onClick={() => selectAndAdvance({ occasion: o.value })}
                  className={`flex flex-col items-center gap-2.5 p-4 rounded-xl border-2 transition-all duration-200 hover:scale-[1.04] ${
                    quiz.occasion === o.value
                      ? "border-sage bg-sage/10 shadow-sm"
                      : "border-sage/10 hover:border-sage/30 bg-white"
                  }`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${quiz.occasion === o.value ? "bg-sage/20" : "bg-sage/8"}`}>
                    <o.Icon size={20} strokeWidth={1.5} className={quiz.occasion === o.value ? "text-sage" : "text-charcoal/40"} />
                  </div>
                  <span className={`text-sm font-medium ${quiz.occasion === o.value ? "text-sage" : "text-charcoal"}`}>{o.label}</span>
                </button>
              ))}
            </div>
          </StepWrapper>
        );
      case 3:
        return (
          <StepWrapper title={cfg.title} subtitle={subtitle}>
            <RangeSlider
              min={5} max={500} step={5}
              valueMin={quiz.minBudget} valueMax={quiz.maxBudget}
              onChange={(min, max) => update({ minBudget: min, maxBudget: max })}
              formatLabel={(v) => `${v} ${currencyLabel}`}
            />
          </StepWrapper>
        );
      case 4:
        return (
          <StepWrapper title={cfg.title} subtitle={subtitle}>
            <div className="flex flex-wrap gap-2 mb-4">
              {INTERESTS.map((i) => (
                <Chip key={i} label={i} selected={quiz.interests.includes(i.toLowerCase())} onToggle={() => toggleInterest(i.toLowerCase())} />
              ))}
            </div>
            {quiz.interests.filter((i) => !INTERESTS.map((x) => x.toLowerCase()).includes(i)).length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {quiz.interests
                  .filter((i) => !INTERESTS.map((x) => x.toLowerCase()).includes(i))
                  .map((i) => (
                    <Chip key={i} label={i} onRemove={() => toggleInterest(i)} />
                  ))}
              </div>
            )}
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Add a custom interest..."
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addCustomInterest())}
                className="flex-1 rounded-lg border border-sage/30 px-3 py-2 text-sm bg-white focus:outline-none focus:border-sage transition-colors"
              />
              <Button variant="outline" onClick={addCustomInterest} disabled={!customInput.trim()}>
                Add
              </Button>
            </div>
          </StepWrapper>
        );
      case 5:
        return (
          <StepWrapper title={cfg.title} subtitle={subtitle}>
            <input
              type="text"
              placeholder="e.g., Photography, Rock Climbing, Baking..."
              value={quiz.hobby}
              onChange={(e) => update({ hobby: e.target.value })}
              className="w-full rounded-lg border border-sage/30 px-4 py-3 text-sm bg-white focus:outline-none focus:border-sage transition-colors"
            />
          </StepWrapper>
        );
      case 6:
        return (
          <StepWrapper title={cfg.title} subtitle={subtitle}>
            <div className="space-y-2">
              {GENDERS.map((g) => (
                <button
                  key={g.value}
                  onClick={() => selectAndAdvance({ gender: g.value })}
                  className={`w-full text-left px-4 py-3.5 rounded-xl border-2 transition-all duration-200 hover:scale-[1.01] ${
                    quiz.gender === g.value
                      ? "border-sage bg-sage/10 text-sage font-medium"
                      : "border-sage/10 hover:border-sage/30"
                  }`}
                >
                  {g.label}
                </button>
              ))}
            </div>
          </StepWrapper>
        );
      case 7:
        return (
          <StepWrapper title={cfg.title} subtitle={subtitle}>
            <div className="grid grid-cols-2 gap-3">
              {COUNTRIES.map((c) => (
                <button
                  key={c}
                  onClick={() => selectAndAdvance({ country: c })}
                  className={`flex items-center gap-2 px-4 py-3.5 rounded-xl border-2 transition-all duration-200 hover:scale-[1.02] ${
                    quiz.country === c
                      ? "border-sage bg-sage/10 shadow-sm"
                      : "border-sage/10 hover:border-sage/30 bg-white"
                  }`}
                >
                  <span className="text-lg">{COUNTRY_FLAGS[c]}</span>
                  <span className={`text-sm font-medium ${quiz.country === c ? "text-sage" : "text-charcoal"}`}>{COUNTRY_LABELS[c]}</span>
                </button>
              ))}
            </div>
          </StepWrapper>
        );
    }
  };

  if (view === "loading") {
    return (
      <Layout>
        <Helmet><title>Finding gifts... - Giftmakr</title></Helmet>
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <div className="mb-8 animate-fade-in">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-sage/10 mb-4">
              <Gift size={28} className="text-sage animate-bounce" />
            </div>
            <h2 className="font-heading text-xl font-bold text-charcoal mb-2">
              Finding the perfect {quiz.occasion || "gifts"}...
            </h2>
            <p className="text-charcoal/50 text-sm">
              Searching {quiz.recipient ? `for your ${quiz.recipient}` : "for something special"}
              {quiz.interests.length > 0 && ` who loves ${quiz.interests.slice(0, 3).join(", ")}`}
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-3xl mx-auto">
            {Array.from({ length: 6 }, (_, i) => <ProductCardSkeleton key={i} />)}
          </div>
        </div>
      </Layout>
    );
  }

  if (view === "results") {
    return (
      <Layout>
        <Helmet>
          <title>Gift Ideas for {quiz.recipient || "Someone Special"} - Giftmakr</title>
        </Helmet>
        <div className="max-w-5xl mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="font-heading text-2xl md:text-3xl font-bold text-charcoal">
              {products.length > 0
                ? `We found ${products.length} gift ideas`
                : "No gifts found"}
            </h1>
            {error && (
              <p className="mt-2 text-rose text-sm">{error}</p>
            )}
            {products.length === 0 && !error && (
              <p className="mt-2 text-charcoal/60">
                Try adjusting your budget or interests for more results.
              </p>
            )}
          </div>

          {products.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {products.map((p, i) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  relevanceLabel={getRelevanceLabel(i, products.length)}
                />
              ))}
            </div>
          )}

          <div className="flex justify-center gap-3">
            {(error || products.length === 0) && (
              <Button variant="primary" onClick={submit}>
                <RefreshCw size={16} /> Try again
              </Button>
            )}
            <Button variant="outline" onClick={startOver}>
              Start over
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Helmet>
        <title>Find Your Perfect Gift - Giftmakr Quiz</title>
        <meta name="description" content="Answer a few simple questions to get personalized AI-powered gift recommendations for any occasion and budget." />
      </Helmet>
      <div className="max-w-xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-charcoal/40">Step {step} of {TOTAL_STEPS}</span>
          <span className="text-xs text-charcoal/30">{STEP_CONFIG[step - 1].title}</span>
        </div>
        <ProgressBar current={step} total={TOTAL_STEPS} />

        <div
          className={`bg-white rounded-2xl border border-sage/10 p-6 md:p-8 shadow-sm mt-4 ${
            slideDir === "right" ? "animate-slide-in-right" : "animate-slide-in-left"
          }`}
          key={step}
        >
          {renderStep()}
        </div>

        <div className="flex justify-between mt-6">
          <Button variant="ghost" onClick={back} disabled={step === 1}>
            <ArrowLeft size={16} /> Back
          </Button>
          <div className="flex gap-2">
            {step === 5 && (
              <Button variant="ghost" onClick={next}>
                Skip <SkipForward size={14} />
              </Button>
            )}
            {/* Hide Next on auto-advance steps unless already selected */}
            {([1, 2, 6].includes(step)) ? (
              canProceed() && (
                <Button variant="primary" onClick={next}>
                  {step < TOTAL_STEPS ? <>Next <ArrowRight size={16} /></> : "Find gifts"}
                </Button>
              )
            ) : (
              <Button variant="primary" onClick={next} disabled={!canProceed()}>
                {step < TOTAL_STEPS ? <>Next <ArrowRight size={16} /></> : (
                  <span className="flex items-center gap-2">
                    Find gifts <Sparkles size={16} />
                  </span>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

function StepWrapper({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-heading text-2xl font-bold text-charcoal">{title}</h2>
        {subtitle && <p className="text-sm text-charcoal/50 mt-1.5">{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}
