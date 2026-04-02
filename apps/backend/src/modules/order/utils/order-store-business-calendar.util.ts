import {
  businessCalendarStateFromStoreRow,
  pickupFitsBusinessCalendarState,
} from "@apps/backend/modules/store/utils/store-business-calendar.util";

export type StoreRowForPickupCalendarCheck = {
  weeklyClosedWeekdays: number[];
  standardOpenTime: string;
  standardCloseTime: string;
  businessCalendarOverrides: unknown;
};

export function isPickupAllowedForStore(
  pickupUtc: Date,
  store: StoreRowForPickupCalendarCheck,
): boolean {
  const state = businessCalendarStateFromStoreRow(store);
  return pickupFitsBusinessCalendarState(pickupUtc, state);
}
