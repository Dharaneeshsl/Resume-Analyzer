import React, { useState } from "react";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";

function App() {
  const [analysis, setAnalysis] = useState(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-primary/15 text-primary font-bold mr-2 shadow-sm shadow-primary/40">
            AI
          </span>
          <h1 className="text-lg sm:text-xl font-semibold text-slate-50 tracking-tight">
            AI Resume Analyzer
          </h1>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <Home onAnalysisComplete={setAnalysis} />
        {analysis && (
          <div className="mt-10">
            <Dashboard analysis={analysis} />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;

