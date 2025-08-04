// context/ManualLoaderContext.tsx
"use client";
import { createContext, useContext, useState } from "react";
import ManualLoader from "@/components/ManualLoader";

const LoaderContext = createContext({
  showLoader: () => {},
  hideLoader: () => {},
});

export const useManualLoader = () => useContext(LoaderContext);

export function ManualLoaderProvider({ children }: { children: React.ReactNode }) {
  const [visible, setVisible] = useState(false);

  const showLoader = () => setVisible(true);
  const hideLoader = () => setVisible(false);

  return (
    <LoaderContext.Provider value={{ showLoader, hideLoader }}>
      {children}
      {visible && <ManualLoader />}
    </LoaderContext.Provider>
  );
}
