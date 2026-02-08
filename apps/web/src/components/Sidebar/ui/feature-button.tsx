import { Button } from "@/components/ui/button";

type ChatFeatureButtonProps = {
  feature: "Chat" | "Documents";
  icon: React.ReactNode;
  onClick: () => void;
};

export const ChatFeatureButton = ({
  feature,
  icon,
  onClick,
}: ChatFeatureButtonProps) => {
  return (
    <Button
      type="button"
      className="w-full justify-start gap-2 rounded-xl px-3"
      aria-label={`${feature} feature`}
      onClick={onClick}
    >
      {icon}
      <span>{feature}</span>
    </Button>
  );
};
