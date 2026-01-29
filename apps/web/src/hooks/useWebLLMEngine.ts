import { initLLMClient } from "@hydrowise/llm-client";
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
    initLLMClient(setLoadProgress);
    setIsLoading(false);
    setEngineReady(true);
  }, []);

  return {
    isLoading,
    loadProgress,
    engineReady,
  };
};
