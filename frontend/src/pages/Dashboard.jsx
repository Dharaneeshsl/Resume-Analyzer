import React from "react";
import ScoreCard from "../components/ScoreCard";
import Skills from "../components/Skills";
import Suggestions from "../components/Suggestions";
import JDComparison from "../components/JDComparison";

function Dashboard({ analysis }) {
  if (!analysis) return null;

  const {
    skills,
    projects,
    keywords,
    suggestions,
    resume_score,
    professional_summary,
    raw_text
  } = analysis;

  return (
    <section className="space-y-6">
      <div className="flex items-center gap-3">
        <span className="inline-flex h-7 px-3 items-center rounded-full bg-slate-900/80 border border-slate-700 text-xs text-slate-300">
          Dashboard
        </span>
        <span className="text-xs text-slate-500">
          Score · skills · suggestions · JD match
        </span>
      </div>

      <div className="grid md:grid-cols-3 gap-5">
        <div className="md:col-span-1">
          <ScoreCard score={resume_score} summary={professional_summary} />
        </div>
        <div className="md:col-span-2">
          <Skills skills={skills} projects={projects} keywords={keywords} />
        </div>
      </div>

      <Suggestions suggestions={suggestions} />

      <JDComparison resumeText={raw_text} />
    </section>
  );
}

export default Dashboard;

