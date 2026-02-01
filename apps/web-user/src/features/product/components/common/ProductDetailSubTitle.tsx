interface ProductDetailSubTitleProps {
  children: React.ReactNode;
  className?: string;
}

export function ProductDetailSubTitle({ children }: ProductDetailSubTitleProps) {
  return <h3 className="text-xl font-bold text-gray-900 py-[10px]">{children}</h3>;
}
