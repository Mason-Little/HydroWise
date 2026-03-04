import { QueryClientProvider } from "@tanstack/react-query";
import { Workspace } from "@/components/Workspace";
import { queryClient } from "@/lib/query/query-client";

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Workspace />
    </QueryClientProvider>
  );
}

export default App;
