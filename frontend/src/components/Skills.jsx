import React from "react";

function Skills({ skills, projects, keywords }) {
  const renderList = (title, items, emptyText) => (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex flex-col">
      <h3 className="text-sm font-semibold text-slate-100 mb-2">{title}</h3>
      {items && items.length > 0 ? (
        <ul className="flex flex-wrap gap-2 text-xs">
          {items.map((item, idx) => (
            <li
              key={`${title}-${idx}`}
              className="inline-flex items-center rounded-full bg-slate-800/80 text-slate-100 px-3 py-1"
            >
              {item}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-xs text-slate-500">{emptyText}</p>
      )}
    </div>
  );

  return (
    <div className="grid md:grid-cols-3 gap-4">
      {renderList("Extracted Skills", skills, "No skills detected.")}
      {renderList(
        "Key Projects",
        projects,
        "No projects extracted. Add impact-driven project bullets."
      )}
      {renderList(
        "Important Keywords",
        keywords,
        "No strong keywords detected. Align more with your target role."
      )}
    </div>
  );
}

export default Skills;

