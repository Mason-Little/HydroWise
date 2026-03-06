import type { ComponentType } from "react";
import { Chat } from "@/features/chat/Chat";
import { Dashboard } from "@/features/dashboard/Dashboard";
import { Flash } from "@/features/flash/Flash";
import { Notes } from "@/features/notes/Notes";
import { Quiz } from "@/features/quiz/Quiz";
import type { FeatureKey } from "@/types";

export const featureComponents: Record<FeatureKey, ComponentType> = {
  dashboard: Dashboard,
  chat: Chat,
  quiz: Quiz,
  flash: Flash,
  notes: Notes,
};
