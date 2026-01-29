import { createWebLLMEngine, type WebLLMEngine } from "@hydrowise/llm-client";
import { useEffect, useState } from "react";

type WebLLMEngineState = {
  engine: WebLLMEngine | null;
  isLoading: boolean;
  loadProgress: number;
};

export const useWebLLMEngine = (): WebLLMEngineState => {
  const [engine, setEngine] = useState<WebLLMEngine | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadProgress, setLoadProgress] = useState(0);
  useEffect(() => {
    createWebLLMEngine((progress) => {
      setLoadProgress(progress);
    })
      .then((nextEngine: WebLLMEngine) => {
        setEngine(nextEngine);
        setLoadProgress(100);
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
      });
  }, []);

  return {
    engine,
    isLoading,
    loadProgress,
  };
};
