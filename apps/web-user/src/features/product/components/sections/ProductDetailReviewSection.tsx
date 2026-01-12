interface ProductDetailReviewSectionProps {
  variant?: "default" | "tab";
}

export function ProductDetailReviewSection({
  variant = "default",
}: ProductDetailReviewSectionProps) {
  return (
    <div className={variant === "tab" ? "tab-variant" : "default-variant"}>
      <div>후기 컴포넌트</div>
    </div>
  );
}
