import { ButtonHTMLAttributes, forwardRef } from "react";

type Variant = "primary" | "secondary" | "ghost" | "outline";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

const variantStyles: Record<Variant, string> = {
  primary: "bg-sage text-white hover:bg-sage/90 shadow-sm hover:shadow",
  secondary: "bg-apricot text-white hover:bg-apricot/90 shadow-sm hover:shadow",
  ghost: "text-charcoal hover:bg-sage/10",
  outline: "border border-sage/30 text-charcoal hover:border-sage hover:bg-sage/5",
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", className = "", disabled, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={`inline-flex items-center justify-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium transition-all duration-200 hover:scale-[1.02] disabled:opacity-50 disabled:pointer-events-none ${variantStyles[variant]} ${className}`}
        disabled={disabled}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
export default Button;
