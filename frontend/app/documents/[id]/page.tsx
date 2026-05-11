import { notFound } from "next/navigation";

import { StatusPill } from "@/components/status-pill";
import { getDocument } from "@/lib/api";

export default async function DocumentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let document;

  try {
    document = await getDocument(id);
  } catch {
    notFound();
  }

  return (
    <section className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-accent">Document</p>
          <h2 className="mt-1 text-3xl font-semibold text-ink">{document.filename}</h2>
          <p className="mt-2 max-w-3xl text-sm text-slate-600">{document.summary}</p>
        </div>
        <StatusPill status={document.status} />
      </div>

      <div className="grid gap-5 lg:grid-cols-[1fr_360px]">
        <div className="rounded-lg border border-line bg-white p-5">
          <h3 className="text-lg font-semibold">Extracted fields</h3>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {document.fields.map((field) => (
              <div key={field.name} className="rounded-md border border-line p-3">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-xs font-semibold uppercase text-slate-500">{field.name.replace("_", " ")}</p>
                  <p className="text-xs text-slate-500">{Math.round(field.confidence * 100)}%</p>
                </div>
                <p className="mt-2 text-sm font-medium">{field.value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-5">
          <div className="rounded-lg border border-line bg-white p-5">
            <h3 className="text-lg font-semibold">Validation</h3>
            <p className="mt-1 text-sm text-slate-500">Overall confidence: {Math.round(document.confidence_score * 100)}%</p>
            <div className="mt-4 space-y-3">
              {document.validation_issues.map((issue) => (
                <div key={`${issue.field}-${issue.message}`} className="rounded-md bg-amber-50 p-3 text-sm text-amber-900">
                  <p className="font-semibold">{issue.field}</p>
                  <p>{issue.message}</p>
                </div>
              ))}
              {document.validation_issues.length === 0 && <p className="text-sm text-slate-500">No validation issues detected.</p>}
            </div>
          </div>

          <div className="rounded-lg border border-line bg-white p-5">
            <h3 className="text-lg font-semibold">Audit trail</h3>
            <div className="mt-3 space-y-2">
              {document.audit_history.map((event, index) => (
                <p key={index} className="rounded-md bg-panel px-3 py-2 text-xs text-slate-600">
                  {String(event.action)} by {String(event.actor)}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

