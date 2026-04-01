import type { ReactNode } from "react";
import { createContext, useContext } from "react";
import type { PlatformConfig } from "./types";

const PlatformContext = createContext<PlatformConfig | null>(null);

type PlatformProviderProps = {
  platform: PlatformConfig;
  children: ReactNode;
};

export const PlatformProvider = ({
  platform,
  children,
}: PlatformProviderProps) => {
  return (
    <PlatformContext.Provider value={platform}>
      {children}
    </PlatformContext.Provider>
  );
};

export const usePlatform = () => {
  const platform = useContext(PlatformContext);

  if (!platform) {
    throw new Error("usePlatform must be used within a PlatformProvider.");
  }

  return platform;
};

export const usePlatformKind = () => {
  return usePlatform().kind;
};
