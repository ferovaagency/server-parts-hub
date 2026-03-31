import { create } from "zustand";

interface QuoteItem {
  id: string;
  name: string;
  sku: string;
  image?: string;
}

interface QuoteStore {
  items: QuoteItem[];
  addItem: (item: QuoteItem) => void;
  removeItem: (id: string) => void;
  clearItems: () => void;
}

export const useQuoteStore = create<QuoteStore>((set, get) => ({
  items: JSON.parse(localStorage.getItem("pps_quote") || "[]"),
  addItem: (item) => {
    const current = get().items;
    if (current.find((i) => i.id === item.id)) return;
    const next = [...current, item];
    localStorage.setItem("pps_quote", JSON.stringify(next));
    set({ items: next });
  },
  removeItem: (id) => {
    const next = get().items.filter((i) => i.id !== id);
    localStorage.setItem("pps_quote", JSON.stringify(next));
    set({ items: next });
  },
  clearItems: () => {
    localStorage.removeItem("pps_quote");
    set({ items: [] });
  },
}));
