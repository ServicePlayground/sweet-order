import { Icon } from "@/apps/web-user/common/components/icons";

function getDDay(pickupDate: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const pickup = new Date(pickupDate);
  pickup.setHours(0, 0, 0, 0);
  const diff = Math.ceil((pickup.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  if (diff === 0) return "D-Day";
  if (diff > 0) return `D-${diff}`;
  return `D+${Math.abs(diff)}`;
}

function formatPickupDateTime(pickupDate: string) {
  const date = new Date(pickupDate);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const weekday = ["일", "월", "화", "수", "목", "금", "토"][date.getDay()];
  const hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const ampm = hours < 12 ? "오전" : "오후";
  const displayHours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
  return `${year}.${month}.${day}(${weekday}) · ${ampm} ${displayHours}:${minutes}`;
}

interface OrderDateHeaderProps {
  pickupDate: string;
  variant?: "upcoming" | "past";
}

export function OrderDateHeader({ pickupDate, variant = "upcoming" }: OrderDateHeaderProps) {
  if (variant === "past") {
    return (
      <div className="flex items-center gap-2 mb-3">
        <Icon name="calendar" width={16} height={16} className="text-gray-900" />
        <span className="text-sm font-bold text-gray-900">
          {formatPickupDateTime(pickupDate)}
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1.5 mb-3">
      <span className="w-[28px] h-[19px] flex items-center justify-center rounded text-primary text-2xs bg-primary-50 font-bold">
        {getDDay(pickupDate)}
      </span>
      <span className="text-sm font-bold text-gray-900">
        {formatPickupDateTime(pickupDate)}
      </span>
    </div>
  );
}
