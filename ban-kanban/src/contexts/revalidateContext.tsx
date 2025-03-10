// RevalidateContext.tsx
"use client";

import React, { createContext, useContext, useState, useCallback } from "react";

type RevalidateMap = {
  [tag: string]: number;
};

interface RevalidateContextType {
  revalidateMap: RevalidateMap;
  triggerRevalidate: (tag: string) => void;
}

const RevalidateContext = createContext<RevalidateContextType | undefined>(undefined);

export const RevalidateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [revalidateMap, setRevalidateMap] = useState<RevalidateMap>({});

  const triggerRevalidate = useCallback((tag: string) => {
    setRevalidateMap((prev) => ({
      ...prev,
      [tag]: (prev[tag] || 0) + 1,
    }));
  }, []);

  return (
    <RevalidateContext.Provider value={{ revalidateMap, triggerRevalidate }}>
      {children}
    </RevalidateContext.Provider>
  );
};

export const useRevalidateTag = (tag: string): number => {
  const context = useContext(RevalidateContext);
  if (!context) {
    throw new Error("useRevalidateTag harus digunakan di dalam RevalidateProvider");
  }
  return context.revalidateMap[tag] || 0;
};

export const useTriggerRevalidate = () => {
  const context = useContext(RevalidateContext);
  if (!context) {
    throw new Error("useTriggerRevalidate harus digunakan di dalam RevalidateProvider");
  }
  return context.triggerRevalidate;
};
