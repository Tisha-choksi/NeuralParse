"use client";

import { useState } from "react";
import { UploadCloud } from "lucide-react";

import { API_BASE, type DocumentRecord } from "@/lib/api";

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [document, setDocument] = useState<DocumentRecord | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function uploadDocument() {
    if (!file) return;
    setIsUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(`${API_BASE}/documents/upload`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Upload failed with status ${response.status}`);
      }

      setDocument(await response.json());
    } catch (uploadError) {
      setError(
        uploadError instanceof Error
          ? uploadError.message
          : "Could not connect to the backend upload API."
      );
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <section className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-accent">Intake</p>
        <h2 className="mt-1 text-3xl font-semibold text-ink">Upload business documents</h2>
      </div>

      <div className="rounded-lg border border-dashed border-line bg-white p-8">
        <label className="flex min-h-56 cursor-pointer flex-col items-center justify-center rounded-md bg-panel text-center">
          <UploadCloud className="h-10 w-10 text-accent" />
          <span className="mt-4 text-base font-semibold">Choose PDF, DOCX, image, or text file</span>
          <span className="mt-1 text-sm text-slate-500">The pipeline will classify, extract fields, validate, and route it.</span>
          <input
            className="sr-only"
            type="file"
            accept=".pdf,.docx,.png,.jpg,.jpeg,.txt,.csv"
            onChange={(event) => setFile(event.target.files?.[0] ?? null)}
          />
        </label>
        <div className="mt-5 flex items-center justify-between gap-4">
          <p className="text-sm text-slate-600">{file ? file.name : "No file selected"}</p>
          <button
            className="rounded-md bg-accent px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-slate-300"
            disabled={!file || isUploading}
            onClick={uploadDocument}
          >
            {isUploading ? "Processing..." : "Run pipeline"}
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-md border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-800">
          {error}. Check that FastAPI is running on {API_BASE}.
        </div>
      )}

      {document && (
        <div className="rounded-lg border border-line bg-white p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold">{document.filename}</h3>
              <p className="mt-1 text-sm text-slate-500">{document.document_type} | confidence {Math.round(document.confidence_score * 100)}%</p>
            </div>
            <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">{document.status.replace("_", " ")}</span>
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {document.fields.map((field) => (
              <div key={field.name} className="rounded-md border border-line p-3">
                <p className="text-xs font-semibold uppercase text-slate-500">{field.name.replace("_", " ")}</p>
                <p className="mt-1 text-sm font-medium">{field.value}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
