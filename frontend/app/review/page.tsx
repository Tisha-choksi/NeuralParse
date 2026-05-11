import Link from "next/link";

import { StatusPill } from "@/components/status-pill";
import { getDocuments } from "@/lib/api";

export default async function ReviewPage() {
  const documents = (await getDocuments()).filter((document) => document.status === "needs_review");

  return (
    <section className="space-y-5">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-accent">Human in the loop</p>
        <h2 className="mt-1 text-3xl font-semibold text-ink">Review queue</h2>
      </div>

      <div className="grid gap-4">
        {documents.map((document) => (
          <Link key={document.id} href={`/documents/${document.id}`} className="rounded-lg border border-line bg-white p-5 hover:border-accent">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold">{document.filename}</h3>
                <p className="mt-1 text-sm text-slate-500">{document.document_type} | {document.validation_issues.length} validation issues</p>
              </div>
              <StatusPill status={document.status} />
            </div>
          </Link>
        ))}
        {documents.length === 0 && <div className="rounded-lg border border-line bg-white p-5 text-sm text-slate-500">No documents need review.</div>}
      </div>
    </section>
  );
}

