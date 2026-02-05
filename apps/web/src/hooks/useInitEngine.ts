import { initAllEngines } from "@hydrowise/llm-client";
import { useEffect, useState } from "react";

type WebLLMEngineState = {
  isLoading: boolean;
  loadProgress: number;
  engineReady: boolean;
};

export const useWebLLMEngine = (): WebLLMEngineState => {
  const [isLoading, setIsLoading] = useState(true);
  const [loadProgress, setLoadProgress] = useState(0);
  const [engineReady, setEngineReady] = useState(false);

  useEffect(() => {
    let isActive = true;

    getOrInitEngine(setLoadProgress)
      .then(() => {
        if (!isActive) return;
        setIsLoading(false);
        setEngineReady(true);
      })
      .catch(() => {
        if (!isActive) return;
        setIsLoading(false);
      });

    return () => {
      isActive = false;
    };
  }, []);

  return {
    isLoading,
    loadProgress,
    engineReady,
  };
};

let engineInitPromise: Promise<void> | null = null;

const getOrInitEngine = (onProgress?: (progress: number) => void) => {
  if (!engineInitPromise) {
    engineInitPromise = initAllEngines(onProgress).then(() => undefined);
  }

  return engineInitPromise;
};
