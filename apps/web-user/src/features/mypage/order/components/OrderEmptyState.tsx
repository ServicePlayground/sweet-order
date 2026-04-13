import Image from "next/image";

interface OrderEmptyStateProps {
  message?: string;
}

export function OrderEmptyState({ message = "예약 내역이 없어요" }: OrderEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-5 min-h-[calc(100vh-200px)] text-sm text-gray-700">
      <Image src="/images/contents/none_items.png" alt={message} width={62} height={57} />
      <p className="text-sm text-gray-700">{message}</p>
    </div>
  );
}
