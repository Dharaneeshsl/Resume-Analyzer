import React, { useState } from "react";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8000";

function JDComparison({ resumeText }) {
  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleCompare = async () => {
    setError("");
    setResult(null);
    if (!jobDescription.trim()) {
      setError("Please paste a job description.");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE}/compare_jd`, {
        resume_text: resumeText,
        job_title: jobTitle,
        job_description: jobDescription
      });
      setResult(res.data);
    } catch (err) {
      console.error(err);
      setError(
        err?.response?.data?.detail ||
          "Failed to compare with Job Description. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-slate-100">
          Job Description Comparison
        </h3>
        <span className="text-xs text-slate-400">
          See missing skills & alignment
        </span>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="md:col-span-1 space-y-3">
          <div>
            <label className="block text-xs text-slate-400 mb-1">
              Job Title (optional)
            </label>
            <input
              type="text"
              className="w-full rounded-lg bg-slate-950/70 border border-slate-800 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="e.g. Senior Full Stack Engineer"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1">
              Job Description
            </label>
            <textarea
              rows={7}
              className="w-full rounded-lg bg-slate-950/70 border border-slate-800 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-primary resize-none"
              placeholder="Paste the job description here..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
            />
          </div>
          <button
            onClick={handleCompare}
            disabled={loading}
            className="inline-flex items-center justify-center w-full rounded-xl bg-secondary px-4 py-2.5 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-500/30 hover:bg-cyan-400 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Analyzing match..." : "Compare with JD"}
          </button>
          {error && (
            <p className="text-xs text-red-400 bg-red-950/30 border border-red-900/40 rounded-lg px-3 py-2">
              {error}
            </p>
          )}
        </div>

        <div className="md:col-span-2 space-y-4">
          {result ? (
            <>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="rounded-xl bg-slate-950/80 border border-slate-800 p-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-1">
                    Matching Skills
                  </p>
                  {result.matching_skills?.length ? (
                    <ul className="flex flex-wrap gap-2 text-xs">
                      {result.matching_skills.map((skill, idx) => (
                        <li
                          key={`match-${idx}`}
                          className="inline-flex rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/40 px-3 py-1"
                        >
                          {skill}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-xs text-slate-500">
                      No strong matches detected.
                    </p>
                  )}
                </div>

                <div className="rounded-xl bg-slate-950/80 border border-slate-800 p-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-1">
                    Missing Skills
                  </p>
                  {result.missing_skills?.length ? (
                    <ul className="flex flex-wrap gap-2 text-xs">
                      {result.missing_skills.map((skill, idx) => (
                        <li
                          key={`missing-${idx}`}
                          className="inline-flex rounded-full bg-red-500/10 text-red-300 border border-red-500/40 px-3 py-1"
                        >
                          {skill}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-xs text-slate-500">
                      No obvious missing skills from the JD.
                    </p>
                  )}
                </div>
              </div>

              <div className="rounded-xl bg-slate-950/80 border border-slate-800 p-3 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-1">
                    Alignment Score
                  </p>
                  <p className="text-2xl font-bold text-slate-50">
                    {result.alignment_score.toFixed(1)}%
                  </p>
                </div>
                <div className="flex-1">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-1">
                    AI Notes
                  </p>
                  <p className="text-sm text-slate-100">{result.notes}</p>
                </div>
              </div>
            </>
          ) : (
            <div className="h-full flex items-center justify-center text-sm text-slate-500 border border-dashed border-slate-800 rounded-xl p-6">
              Paste a job description and click &quot;Compare with JD&quot; to
              see alignment, matching skills, and missing skills.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default JDComparison;

