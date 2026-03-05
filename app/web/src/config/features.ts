import {
  BookIcon,
  CopyIcon,
  LayoutDashboardIcon,
  MessageSquareIcon,
  PencilIcon,
} from "lucide-react";
import type { FeatureKey, FeatureMap } from "@/types/features";

export const features: FeatureMap = {
  dashboard: {
    label: "Dashboard",
    icon: LayoutDashboardIcon,
  },
  chat: {
    label: "Chat",
    icon: MessageSquareIcon,
  },
  quiz: {
    label: "Quiz",
    icon: BookIcon,
  },
  flash: {
    label: "Flash Cards",
    icon: CopyIcon,
  },
  notes: {
    label: "Notes Assistant",
    icon: PencilIcon,
  },
};

export const defaultFeature: FeatureKey = "dashboard";

export const featureOrder: FeatureKey[] = [
  "dashboard",
  "chat",
  "quiz",
  "flash",
  "notes",
];
