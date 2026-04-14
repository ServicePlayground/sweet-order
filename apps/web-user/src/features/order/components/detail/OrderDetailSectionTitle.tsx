interface OrderDetailSectionTitleProps {
  children: React.ReactNode;
  right?: React.ReactNode;
}

export function OrderDetailSectionTitle({ children, right }: OrderDetailSectionTitleProps) {
  return (
    <div className="flex items-center justify-between mb-1 py-2.5">
      <h2 className="text-lg font-bold text-gray-900">{children}</h2>
      {right}
    </div>
  );
}
