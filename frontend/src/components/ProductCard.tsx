import { Star, ExternalLink } from "lucide-react";
import { Product, RelevanceLabel } from "@/types";
import Button from "./Button";

interface ProductCardProps {
  product: Product;
  relevanceLabel?: RelevanceLabel;
}

const labelStyles: Record<RelevanceLabel, string> = {
  "Perfect Match": "bg-gold/20 text-gold border-gold/30",
  "Great Pick": "bg-sage/15 text-sage border-sage/30",
  "Worth a Look": "bg-charcoal/10 text-charcoal/60 border-charcoal/15",
};

export default function ProductCard({ product, relevanceLabel }: ProductCardProps) {
  const renderStars = (rating: number) => {
    if (!rating) return null;
    return (
      <div className="flex items-center gap-1">
        {Array.from({ length: 5 }, (_, i) => (
          <Star
            key={i}
            size={14}
            className={i < Math.round(rating) ? "fill-apricot text-apricot" : "text-charcoal/20"}
          />
        ))}
        {product.reviews > 0 && (
          <span className="text-xs text-charcoal/50 ml-1">({product.reviews})</span>
        )}
      </div>
    );
  };

  const formatPrice = () => {
    if (product.price === null || product.price <= 0) {
      return null;
    }
    return `${product.price.toFixed(2)} ${product.currencySymbol}`;
  };

  const priceDisplay = formatPrice();

  return (
    <div className="bg-white rounded-xl border border-sage/10 overflow-hidden transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 group">
      <div className="relative aspect-square bg-cream/50">
        <img
          src={product.image || ""}
          alt={product.name}
          className="w-full h-full object-contain p-3"
          loading="lazy"
        />
        {relevanceLabel && (
          <span className={`absolute top-2 left-2 text-xs font-medium px-2 py-1 rounded-full border ${labelStyles[relevanceLabel]}`}>
            {relevanceLabel}
          </span>
        )}
      </div>
      <div className="p-4 space-y-2">
        <h3 className="font-medium text-charcoal line-clamp-2 leading-snug">{product.name}</h3>
        {renderStars(product.stars)}
        {priceDisplay ? (
          <p className="text-lg font-bold text-sage">{priceDisplay}</p>
        ) : (
          <p className="text-sm text-charcoal/50 italic">Check price on Amazon</p>
        )}
        <a href={product.link} target="_blank" rel="noopener noreferrer" className="block">
          <Button variant="primary" className="w-full">
            View on Amazon <ExternalLink size={14} />
          </Button>
        </a>
      </div>
    </div>
  );
}
