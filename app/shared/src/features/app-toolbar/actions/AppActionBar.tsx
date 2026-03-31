import { Input } from "@/components/ui/input";

export const AppActionBar = () => (
  <div className="pointer-events-none absolute inset-x-0 flex justify-center px-3">
    <div className="pointer-events-auto w-full max-w-2xl min-w-0">
      <Input
        placeholder="Search courses, documents, topics..."
        className="h-8 w-full rounded-md border border-border bg-transparent outline outline-1 outline-border focus-visible:ring-0"
      />
    </div>
  </div>
);
