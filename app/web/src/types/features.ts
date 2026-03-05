import type { LucideIcon } from "lucide-react";

export type FeatureKey = "dashboard" | "chat" | "quiz" | "flash" | "notes";

export type FeatureDefinition = {
  label: string;
  icon: LucideIcon;
};

export type FeatureMap = Record<FeatureKey, FeatureDefinition>;
