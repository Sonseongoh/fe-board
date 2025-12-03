import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "danger" | "outline";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
}

const variantStyles: Record<Variant, React.CSSProperties> = {
  primary: {
    color: "#2563eb",
    border: "1px solid #2563eb",
  },
  secondary: {
    color: "#6b7280",
    border: "1px solid #6b7280",
  },
  danger: {
    color: "#e75050",
    border: "1px solid #e75050",
  },
  outline: {
    color: "#374151",
    border: "1px solid #d1d5db",
  },
};

const sizeStyles: Record<Size, React.CSSProperties> = {
  sm: {
    padding: "4px 10px",
    fontSize: 13,
  },
  md: {
    padding: "6px 14px",
    fontSize: 14,
  },
  lg: {
    padding: "10px 18px",
    fontSize: 16,
  },
};

export function Button({
  children,
  variant = "primary",
  size = "md",
  style,
  ...rest
}: ButtonProps) {
  return (
    <button
      {...rest}
      style={{
        backgroundColor: "white", // 배경은 항상 white
        borderRadius: 6,
        fontWeight: 600,
        cursor: "pointer",
        transition: "0.15s",
        ...variantStyles[variant],
        ...sizeStyles[size],
        ...style,
      }}
    >
      {children}
    </button>
  );
}
