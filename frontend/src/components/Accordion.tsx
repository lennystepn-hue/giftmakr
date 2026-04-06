import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface AccordionItem {
  question: string;
  answer: string;
}

interface AccordionProps {
  items: AccordionItem[];
}

export default function Accordion({ items }: AccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="space-y-2">
      {items.map((item, i) => (
        <div key={i} className="border border-sage/20 rounded-lg overflow-hidden">
          <button
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
            className="w-full flex items-center justify-between p-4 text-left font-medium text-charcoal hover:bg-sage/5 transition-colors"
          >
            {item.question}
            <ChevronDown
              size={18}
              className={`text-sage transition-transform duration-200 ${openIndex === i ? "rotate-180" : ""}`}
            />
          </button>
          {openIndex === i && (
            <div className="px-4 pb-4 text-charcoal/70 text-sm leading-relaxed animate-fade-in">
              {item.answer}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
