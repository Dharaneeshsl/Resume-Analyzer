import React from "react";

function Suggestions({ suggestions }) {
  const sections = ["skills", "projects", "experience", "formatting"];

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
      <h3 className="text-sm font-semibold text-slate-100 mb-3">
        Section-wise improvement suggestions
      </h3>
      <div className="grid md:grid-cols-2 gap-4 text-sm">
        {sections.map((section) => (
          <div
            key={section}
            className="rounded-xl bg-slate-950/80 border border-slate-800 p-3"
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-1">
              {section}
            </p>
            <p className="text-sm text-slate-100">
              {suggestions?.[section] ||
                "No specific suggestions. This section looks acceptable."}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Suggestions;

