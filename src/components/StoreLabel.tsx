"use client";

import { useStore } from "@/context/StoreContext";

export default function StoreLabel() {
  const { selectedStore } = useStore();

  if (!selectedStore) return null;

  return (
    <span className="text-sm text-gray-400 font-medium">
      {selectedStore.name}
    </span>
  );
}