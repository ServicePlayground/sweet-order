import React from "react";
import { cn } from "@/apps/web-seller/common/utils/classname.util";
import {
  ORDER_DETAIL_MONO,
  ORDER_DETAIL_TABLE,
  ORDER_DETAIL_TD_LABEL,
  ORDER_DETAIL_TD_VALUE,
  ORDER_DETAIL_TH_SECTION,
} from "@/apps/web-seller/features/order/constants/order-detail-page.constant";

export function SheetSectionRow({
  children,
  colSpan = 2,
}: {
  children: React.ReactNode;
  colSpan?: number;
}) {
  return (
    <tr>
      <th className={ORDER_DETAIL_TH_SECTION} colSpan={colSpan}>
        {children}
      </th>
    </tr>
  );
}

export function SheetKvRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <tr className="even:bg-slate-50/40">
      <td className={ORDER_DETAIL_TD_LABEL}>{label}</td>
      <td className={cn(ORDER_DETAIL_TD_VALUE, ORDER_DETAIL_MONO)}>{children}</td>
    </tr>
  );
}

export function SheetTable({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <table className={cn(ORDER_DETAIL_TABLE, className)}>{children}</table>;
}
