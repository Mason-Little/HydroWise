import { Button } from "@base-ui/react/button";
import { Leaf } from "lucide-react";

function App() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <main className="mx-auto flex min-h-screen max-w-4xl flex-col items-start justify-center gap-6 px-6 py-16">
        <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
          HydroWise
        </p>
        <h1 className="flex items-center gap-3 text-4xl font-semibold tracking-tight text-slate-900">
          <Leaf className="h-8 w-8 text-slate-700" aria-hidden="true" />
          Local-first learning assistant
        </h1>
        <p className="max-w-xl text-base text-slate-600">
          Minimal React scaffold with Base UI and Tailwind.
        </p>
        <Button className="rounded-md border border-slate-200 px-4 py-2 text-sm font-medium shadow-sm transition hover:bg-slate-100">
          Get started
        </Button>
      </main>
    </div>
  );
}

export default App;
