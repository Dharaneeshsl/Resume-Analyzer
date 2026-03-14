import React from "react";

function ScoreCard({ score, summary }) {
  const normalized = Math.max(0, Math.min(10, score || 0));
  const percentage = (normalized / 10) * 100;

  let barColor = "bg-red-500";
  if (normalized >= 7.5) barColor = "bg-emerald-500";
  else if (normalized >= 5) barColor = "bg-amber-400";

  return (
    <div className="relative overflow-hidden bg-slate-950/80 border border-slate-800 rounded-2xl p-5 h-full flex flex-col justify-between shadow-xl shadow-slate-950/60">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.25),_transparent_55%)] opacity-70" />
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold text-slate-100">
            Resume Score
          </h3>
          <span className="text-xs uppercase tracking-wide text-slate-400">
            out of 10
          </span>
        </div>
        <div className="flex items-baseline gap-1 mb-3">
          <span className="text-3xl font-bold text-slate-50">
            {normalized.toFixed(1)}
          </span>
          <span className="text-sm text-slate-400">/ 10</span>
        </div>
        <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden mb-2">
          <div
            className={`h-2 ${barColor} transition-all duration-500`}
            style={{ width: `${percentage}%` }}
          />
        </div>
        <p className="text-xs text-slate-400">
          This score considers skills clarity, action verbs, project impact,
          formatting, and relevant keywords.
        </p>
      </div>
      {summary && (
        <div className="mt-4 rounded-xl bg-slate-950/80 border border-slate-800 px-3 py-2">
          <p className="text-xs uppercase tracking-wide text-slate-400 mb-1">
            AI-generated professional summary
          </p>
          <p className="text-sm text-slate-100">{summary}</p>
        </div>
      )}
    </div>
  );
}

export default ScoreCard;

