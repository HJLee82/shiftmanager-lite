"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

type Store = {
  id: string;
  name: string;
};

type StoreContextType = {
  stores: Store[];
  selectedStore: Store | null;
  setSelectedStore: (store: Store) => void;
};

const StoreContext = createContext<StoreContextType | null>(null);

const mockStores: Store[] = [
  { id: "11111111-1111-1111-1111-111111111111", name: "Seattle Store" },
  { id: "22222222-2222-2222-2222-222222222222", name: "Bellevue Store" },
  { id: "33333333-3333-3333-3333-333333333333", name: "Lynnwood Store" },
];

export function StoreProvider({ children }: { children: ReactNode }) {
  const [selectedStore, setSelectedStore] = useState<Store | null>(mockStores[0]);

  return (
    <StoreContext.Provider value={{ stores: mockStores, selectedStore, setSelectedStore }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) throw new Error("useStore must be used within StoreProvider");
  return context;
}