import React from "react";
import Upload from "../components/Upload";

function Home({ onAnalysisComplete }) {
  return (
    <section className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6 items-center">
        <div>
          <p className="inline-flex items-center rounded-full bg-primary/15 text-primary px-3 py-1 text-xs font-medium mb-3 border border-primary/30">
            Built for hackathons · ATS-style feedback
          </p>
          <h2 className="text-3xl sm:text-4xl font-semibold text-slate-50 mb-3 leading-tight">
            Upload your resume and get{" "}
            <span className="text-primary">AI-powered feedback</span> in
            seconds.
          </h2>
          <p className="text-sm text-slate-400 mb-4">
            The AI Resume Analyzer extracts skills, projects, and keywords,
            computes a resume score, suggests improvements, generates a
            professional summary, and compares your profile to a specific Job
            Description.
          </p>
          <ul className="text-sm text-slate-300 space-y-1">
            <li>• Smart PDF parsing and text extraction</li>
            <li>• AI-based resume scoring out of 10</li>
            <li>• Section-wise improvement suggestions</li>
            <li>• JD comparison with missing skills & alignment score</li>
          </ul>
        </div>
        <div>
          <Upload onAnalysisComplete={onAnalysisComplete} />
        </div>
      </div>
    </section>
  );
}

export default Home;

