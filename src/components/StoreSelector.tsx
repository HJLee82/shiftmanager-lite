"use client";

import { useStore } from "@/context/StoreContext";

export default function StoreSelector() {
  const { stores, selectedStore, setSelectedStore } = useStore();

  return (
    <div className="flex gap-0 border-b border-gray-200">
      {stores.map((store) => (
        <button
          key={store.id}
          onClick={() => setSelectedStore(store)}
          className={`px-5 py-2 text-sm font-medium border-t border-l border-r rounded-t-lg transition-colors -mb-px ${
            selectedStore?.id === store.id
              ? "bg-white border-gray-200 text-blue-600 border-b-white"
              : "bg-gray-100 border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"
          }`}
        >
          {store.name}
        </button>
      ))}
    </div>
  );
}