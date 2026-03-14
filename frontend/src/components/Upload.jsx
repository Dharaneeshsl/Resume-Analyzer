import React, { useState } from "react";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8000";

function Upload({ onAnalysisComplete }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [uploadResult, setUploadResult] = useState(null);

  const handleFileChange = (e) => {
    setError("");
    setUploadResult(null);
    setFile(e.target.files[0] || null);
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a PDF resume first.");
      return;
    }
    setError("");
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await axios.post(`${API_BASE}/upload_resume`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      setUploadResult(res.data);
      onAnalysisComplete(res.data);
    } catch (err) {
      console.error(err);
      setError(
        err?.response?.data?.detail ||
          "Failed to analyze resume. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-900/80 p-6 sm:p-8 shadow-2xl shadow-slate-950/60 backdrop-blur-sm transition hover:shadow-primary/30 hover:-translate-y-0.5">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(37,99,235,0.25),_transparent_50%),radial-gradient(circle_at_bottom,_rgba(14,165,233,0.18),_transparent_55%)] opacity-60" />
      <div className="relative">
        <h2 className="text-xl font-semibold text-slate-50 mb-1">
          Upload your resume
        </h2>
        <p className="text-xs text-slate-400 mb-4">
          PDF only · local analysis · no data stored
        </p>
      </div>

      <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <label className="w-full sm:w-auto inline-flex items-center justify-between gap-3 rounded-xl border border-dashed border-slate-700/80 bg-slate-950/70 px-4 py-3 text-sm text-slate-300 hover:border-primary hover:bg-slate-900 cursor-pointer transition">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
              ⬆
            </span>
            <div className="flex flex-col">
              <span className="font-medium">
                {file ? file.name : "Choose PDF file"}
              </span>
              <span className="text-xs text-slate-500">
                Max ~5MB · PDF only
              </span>
            </div>
          </div>
          <input
            type="file"
            accept="application/pdf"
            className="hidden"
            onChange={handleFileChange}
          />
        </label>

        <button
          onClick={handleUpload}
          disabled={loading}
          className="inline-flex items-center justify-center rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary/30 hover:bg-primary/90 disabled:opacity-60 disabled:cursor-not-allowed transition"
        >
          {loading ? "Analyzing..." : "Analyze Resume"}
        </button>
      </div>

      {error && (
        <p className="relative mt-3 text-sm text-red-300 bg-red-950/40 border border-red-900/40 rounded-lg px-3 py-2">
          {error}
        </p>
      )}

      {uploadResult && (
        <p className="relative mt-3 text-sm text-emerald-300 bg-emerald-950/30 border border-emerald-900/40 rounded-lg px-3 py-2">
          Analysis complete. Scroll down to see detailed results.
        </p>
      )}
    </div>
  );
}

export default Upload;

