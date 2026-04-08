import Image from "next/image";
import Link from "next/link";
import { Icon, iconTypes } from "@/apps/web-user/common/components/icons";

interface OrderActionButton {
  label: string;
  icon?: keyof typeof iconTypes;
  images?: { src: string; alt: string }[];
  onClick?: () => void;
  href?: string;
}

interface OrderActionButtonsProps {
  buttons: OrderActionButton[];
  direction?: "row" | "column";
}

function ButtonContent({ button }: { button: OrderActionButton }) {
  return (
    <>
      {button.images?.map((img) => (
        <Image key={img.src} src={img.src} alt={img.alt} width={20} height={20} />
      ))}
      {button.icon && <Icon name={button.icon} width={20} height={20} className="text-gray-900" />}
      {button.label}
    </>
  );
}

export function OrderActionButtons({ buttons, direction = "row" }: OrderActionButtonsProps) {
  const buttonClassName = `${direction === "column" ? "w-full" : "flex-1"} h-[40px] flex items-center justify-center gap-1 rounded-lg border border-gray-100 text-sm font-bold text-gray-900 bg-white`;
  return (
    <div className={`flex gap-2 ${direction === "column" ? "flex-col" : ""}`}>
      {buttons.map((button) =>
        button.href ? (
          <Link key={button.label} href={button.href} className={buttonClassName}>
            <ButtonContent button={button} />
          </Link>
        ) : (
          <button
            key={button.label}
            type="button"
            onClick={button.onClick}
            className={buttonClassName}
          >
            <ButtonContent button={button} />
          </button>
        ),
      )}
    </div>
  );
}
