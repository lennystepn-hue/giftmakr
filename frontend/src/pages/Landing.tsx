import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Gift, Search, ShoppingBag, ArrowRight, CheckCircle, Star } from "lucide-react";
import Layout from "@/components/Layout";
import Accordion from "@/components/Accordion";

const FAQ_ITEMS = [
  {
    question: "How does Giftmakr find gift recommendations?",
    answer:
      "You answer a few quick questions about who the gift is for, the occasion, their interests, and your budget. We then search for matching products on Amazon and show you the best options.",
  },
  {
    question: "Is it really free?",
    answer:
      "Yes, completely free. No signup, no account, no hidden fees. We earn a small commission from Amazon when you purchase through our links, at no extra cost to you.",
  },
  {
    question: "What occasions does it cover?",
    answer:
      "Birthdays, holidays, weddings, anniversaries, graduations, or just because. Whatever the occasion, we'll find something fitting.",
  },
  {
    question: "Can I set a specific budget?",
    answer:
      "Absolutely. You set a min and max budget, and we only show products within that range.",
  },
  {
    question: "Which countries are supported?",
    answer:
      "We support Amazon stores in Germany, Spain, UK, US, Canada, France, Italy, and the Netherlands. Your country is auto-detected but you can change it.",
  },
  {
    question: "How do I buy a recommended gift?",
    answer:
      "Each recommendation has a \"View on Amazon\" button that takes you directly to the product page where you can purchase it.",
  },
];

const STEPS = [
  { icon: Gift, title: "Tell us about them", desc: "Answer a few questions about the recipient and occasion" },
  { icon: Search, title: "We find gifts", desc: "Our system searches for the best matching products" },
  { icon: ShoppingBag, title: "Pick your favorite", desc: "Browse curated results and buy directly on Amazon" },
];

const OCCASIONS = ["Birthday", "Christmas", "Anniversary", "Wedding", "Valentine's", "Thank You", "Graduation", "Just Because"];

const EXAMPLE_RESULTS = [
  {
    name: "Sarah",
    avatar: "https://i.pravatar.cc/80?img=9",
    occasion: "Mom's Birthday",
    products: [
      { name: "Duftkerzen Geschenkset", price: "€18.99", img: "https://m.media-amazon.com/images/I/71wgBASMXtL._AC_UL320_.jpg" },
      { name: "Rezeptbuch zum Selberschreiben", price: "€12.99", img: "https://m.media-amazon.com/images/I/81Dw4o0rQNL._AC_UL320_.jpg" },
      { name: "Seide Schlafmaske", price: "€16.99", img: "https://m.media-amazon.com/images/I/71+7ww+XK8L._AC_UL320_.jpg" },
    ],
  },
  {
    name: "Tom",
    avatar: "https://i.pravatar.cc/80?img=12",
    occasion: "Best Friend's Graduation",
    products: [
      { name: "Leder Notizbuch Geschenkset", price: "€17.99", img: "https://m.media-amazon.com/images/I/61xg4yiSm3L._AC_UL320_.jpg" },
      { name: "Wireless Ladestation", price: "€23.73", img: "https://m.media-amazon.com/images/I/71fz4xSPCdL._AC_UY218_.jpg" },
      { name: "Weltkarte zum Rubbeln", price: "€22.99", img: "https://m.media-amazon.com/images/I/81qiGpxEdfL._AC_UL320_.jpg" },
    ],
  },
];

const TESTIMONIALS = [
  { name: "Emma L.", avatar: "https://i.pravatar.cc/56?img=23", text: "Found the perfect gift for my dad in 2 minutes. He loved it!", rating: 5 },
  { name: "Marco R.", avatar: "https://i.pravatar.cc/56?img=53", text: "So much better than scrolling through Amazon for hours. Instant ideas!", rating: 5 },
  { name: "Julia S.", avatar: "https://i.pravatar.cc/56?img=44", text: "Used it for my sister's wedding — she was genuinely surprised. 10/10", rating: 5 },
  { name: "David K.", avatar: "https://i.pravatar.cc/56?img=60", text: "My go-to whenever I need a last-minute gift. Always delivers.", rating: 5 },
];

const TRENDING = ["Headphones", "Cooking Sets", "Board Games", "Cozy Blankets", "Smart Home", "Jewelry", "Books"];

function useLiveCounter(base: number) {
  const [count, setCount] = useState(base);
  useEffect(() => {
    const interval = setInterval(() => {
      setCount((c) => c + Math.floor(Math.random() * 3) + 1);
    }, 4000 + Math.random() * 3000);
    return () => clearInterval(interval);
  }, []);
  return count.toLocaleString();
}

export default function Landing() {
  const liveCount = useLiveCounter(2847);
  const [recentSearches, setRecentSearches] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/recent")
      .then(r => r.json())
      .then(data => { if (Array.isArray(data)) setRecentSearches(data); })
      .catch(() => {});
  }, []);

  return (
    <Layout>
      <Helmet>
        <title>Giftmakr - AI-Powered Gift Recommendations for Any Occasion</title>
        <meta
          name="description"
          content="Find perfect gift ideas in seconds. Answer a few questions and get personalized AI-powered gift suggestions for any occasion — free, no signup required."
        />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": FAQ_ITEMS.map(item => ({
            "@type": "Question",
            "name": item.question,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": item.answer,
            },
          })),
        })}</script>
      </Helmet>

      {/* Hero */}
      <section className="relative max-w-6xl mx-auto px-4 pt-16 pb-12 md:pt-28 md:pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
          {/* Left — text */}
          <div className="text-center md:text-left">
            <h1 className="font-heading text-5xl md:text-6xl font-extrabold text-charcoal leading-[1.1] tracking-tight">
              Stop guessing.
              <span className="block mt-2 bg-gradient-to-r from-apricot via-rose to-apricot bg-clip-text text-transparent">Start gifting.</span>
            </h1>
            <p className="mt-6 text-lg md:text-xl text-charcoal/60 max-w-lg leading-relaxed">
              Answer a few quick questions and discover gift ideas they'll actually love — personalized, instant, and completely free.
            </p>
            <div className="mt-9">
              <Link to="/find" className="inline-block">
                <span className="inline-flex items-center gap-2 bg-apricot text-white text-lg font-bold px-10 py-4 rounded-full shadow-[0_4px_20px_rgba(244,162,97,0.4)] hover:shadow-[0_6px_28px_rgba(244,162,97,0.5)] hover:scale-[1.03] active:scale-[0.98] transition-all duration-200 cursor-pointer">
                  Find the perfect gift <ArrowRight size={18} />
                </span>
              </Link>
            </div>
            <div className="mt-5 flex flex-col sm:flex-row items-center md:justify-start justify-center gap-3 sm:gap-6 text-sm text-charcoal/50">
              <span className="flex items-center gap-1.5">
                <CheckCircle size={14} className="text-sage" /> 100% Free
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle size={14} className="text-sage" /> No Sign Up Required
              </span>
            </div>
            <div className="mt-4 flex items-center md:justify-start justify-center gap-2 text-sm text-charcoal/40">
              <div className="flex -space-x-2">
                {[
                  "https://i.pravatar.cc/56?img=1",
                  "https://i.pravatar.cc/56?img=5",
                  "https://i.pravatar.cc/56?img=16",
                  "https://i.pravatar.cc/56?img=32",
                ].map((src, i) => (
                  <img key={i} src={src} alt="" className="w-7 h-7 rounded-full border-2 border-cream object-cover" />
                ))}
              </div>
              <span>{liveCount} gifts found today</span>
            </div>
          </div>

          {/* Right — visual gift preview */}
          <div className="hidden md:block relative">
            {/* Warm glow behind cards */}
            <div className="absolute -inset-6 bg-gradient-to-br from-sage/10 via-apricot/5 to-transparent rounded-3xl blur-2xl" />

            {/* Floating gift cards */}
            <div className="relative space-y-4">
              {EXAMPLE_RESULTS[0].products.map((p, i) => (
                <div
                  key={p.name}
                  className="bg-white rounded-2xl border border-sage/10 p-4 flex items-center gap-4 shadow-sm animate-fade-in"
                  style={{ animationDelay: `${i * 150}ms`, marginLeft: i === 1 ? '2rem' : i === 2 ? '1rem' : '0' }}
                >
                  <div className="w-16 h-16 rounded-xl bg-cream/80 overflow-hidden flex items-center justify-center shrink-0 p-1">
                    <img src={p.img} alt="" className="max-h-full max-w-full object-contain" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-charcoal leading-tight truncate">{p.name}</p>
                    <p className="text-sage font-bold text-sm mt-0.5">{p.price}</p>
                  </div>
                  <span className="shrink-0 text-xs font-medium text-white bg-sage/80 px-2.5 py-1 rounded-full">
                    {i === 0 ? "Perfect Match" : i === 1 ? "Great Pick" : "Top Rated"}
                  </span>
                </div>
              ))}

              {/* Quiz preview bubble */}
              <div className="bg-sage/5 border border-sage/10 rounded-2xl p-4 ml-4">
                <p className="text-xs text-charcoal/40 mb-2">Sarah searched for:</p>
                <div className="flex flex-wrap gap-1.5">
                  {["Mom", "Birthday", "Cooking", "Under 35"].map(tag => (
                    <span key={tag} className="bg-white border border-sage/15 rounded-full px-2.5 py-1 text-xs text-charcoal/70">{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Occasion quick-select chips */}
        <div className="mt-12 text-center">
          <p className="text-sm text-charcoal/40 mb-3">Jump right in:</p>
          <div className="flex flex-wrap justify-center gap-2">
            {OCCASIONS.map((o) => (
              <Link
                key={o}
                to={`/find?occasion=${encodeURIComponent(o)}`}
                className="rounded-full border border-sage/20 bg-white px-4 py-2 text-sm font-medium text-charcoal hover:border-sage hover:bg-sage/5 transition-all duration-200 hover:scale-[1.03]"
              >
                {o}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-3xl mx-auto px-4 pb-16">
        <h2 className="font-heading text-2xl font-bold text-center text-charcoal mb-8">
          How it works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {STEPS.map((s, i) => (
            <div key={i} className="text-center p-6 rounded-xl bg-white border border-sage/10">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-sage/10 mb-4">
                <s.icon size={22} className="text-sage" />
              </div>
              <h3 className="font-heading font-bold text-charcoal mb-1">{s.title}</h3>
              <p className="text-sm text-charcoal/60">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Example results */}
      <section className="max-w-4xl mx-auto px-4 pb-16">
        <h2 className="font-heading text-2xl font-bold text-center text-charcoal mb-3">
          See what others found
        </h2>
        <p className="text-center text-charcoal/50 mb-8">Real gift searches, real results</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {EXAMPLE_RESULTS.map((ex) => (
            <div key={ex.name} className="rounded-2xl bg-white border border-sage/10 p-6">
              <div className="flex items-center gap-3 mb-4">
                <img src={ex.avatar} alt="" className="w-10 h-10 rounded-full object-cover" />
                <div>
                  <p className="font-bold text-charcoal text-sm">{ex.name}</p>
                  <p className="text-xs text-charcoal/50">{ex.occasion}</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {ex.products.map((p) => (
                  <div key={p.name} className="text-center">
                    <div className="aspect-square rounded-xl bg-cream/50 mb-2 overflow-hidden flex items-center justify-center p-2">
                      <img src={p.img} alt={p.name} className="max-h-full max-w-full object-contain" />
                    </div>
                    <p className="text-xs text-charcoal/70 leading-tight line-clamp-2">{p.name}</p>
                    <p className="text-xs font-bold text-sage mt-0.5">{p.price}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Recently searched */}
      {recentSearches.length > 0 && (
        <section className="max-w-4xl mx-auto px-4 pb-16">
          <h2 className="font-heading text-2xl font-bold text-center text-charcoal mb-3">
            Recently searched
          </h2>
          <p className="text-center text-charcoal/50 mb-8 text-sm">See what others are looking for right now</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentSearches.map((s) => (
              <a
                key={s.slug}
                href={`/gifts/${s.slug}`}
                className="bg-white border border-sage/10 rounded-2xl p-5 hover:shadow-md hover:scale-[1.02] transition-all duration-200 flex gap-4 items-start"
              >
                {s.topProduct?.image && (
                  <img src={s.topProduct.image} alt="" className="w-14 h-14 rounded-lg object-contain bg-cream/50 shrink-0" />
                )}
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-charcoal leading-tight line-clamp-2">{s.title}</p>
                  <p className="text-xs text-charcoal/40 mt-1">{s.productCount} gifts found</p>
                </div>
              </a>
            ))}
          </div>
        </section>
      )}

      {/* Popular right now */}
      <section className="max-w-3xl mx-auto px-4 pb-16 text-center">
        <h2 className="font-heading text-2xl font-bold text-charcoal mb-6">
          Popular right now
        </h2>
        <div className="flex flex-wrap justify-center gap-2">
          {TRENDING.map((tag) => (
            <span key={tag} className="rounded-full bg-sage/10 px-4 py-2 text-sm font-medium text-sage">
              {tag}
            </span>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-4xl mx-auto px-4 pb-16">
        <h2 className="font-heading text-2xl font-bold text-center text-charcoal mb-8">
          Loved by gift-givers
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {TESTIMONIALS.map((t) => (
            <div key={t.name} className="rounded-2xl bg-white border border-sage/10 p-5">
              <div className="flex gap-0.5 mb-3">
                {[...Array(t.rating)].map((_, i) => (
                  <Star key={i} size={14} className="fill-apricot text-apricot" />
                ))}
              </div>
              <p className="text-sm text-charcoal/70 mb-4 leading-relaxed">"{t.text}"</p>
              <div className="flex items-center gap-2">
                <img src={t.avatar} alt="" className="w-7 h-7 rounded-full object-cover" />
                <span className="text-xs font-medium text-charcoal/50">{t.name}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-2xl mx-auto px-4 pb-16">
        <h2 className="font-heading text-2xl font-bold text-center text-charcoal mb-8">
          Frequently asked questions
        </h2>
        <Accordion items={FAQ_ITEMS} />
      </section>

      {/* Sticky CTA on mobile */}
      <div className="fixed bottom-0 left-0 right-0 z-50 p-3 bg-cream/90 backdrop-blur-sm border-t border-sage/10 md:hidden">
        <Link to="/find" className="block">
          <span className="flex items-center justify-center gap-2 w-full bg-apricot text-white text-base font-bold py-3.5 rounded-full shadow-[0_4px_20px_rgba(244,162,97,0.4)]">
            Find the perfect gift <ArrowRight size={16} />
          </span>
        </Link>
      </div>
    </Layout>
  );
}
