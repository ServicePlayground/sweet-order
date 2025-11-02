import { create } from "zustand";
import { IStoreListItem } from "@/apps/web-seller/features/store/types/store.type";

interface StoreState {
  stores: IStoreListItem[];

  setStores: (stores: IStoreListItem[]) => void;
  clearStores: () => void;
}

export const useStoreStore = create<StoreState>()((set) => ({
  stores: [],

  setStores: (stores) => set({ stores }),
  clearStores: () => set({ stores: [] }),
}));
