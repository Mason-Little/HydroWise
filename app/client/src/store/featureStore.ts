import { create } from "zustand";
import { defaultFeature } from "@/config";
import type { FeatureKey } from "@/types";

interface FeatureStore {
  activeFeature: FeatureKey;
  setActiveFeature: (feature: FeatureKey) => void;
}

export const useFeatureStore = create<FeatureStore>((set) => ({
  activeFeature: defaultFeature,
  setActiveFeature: (feature) => set({ activeFeature: feature }),
}));
