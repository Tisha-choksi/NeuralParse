import Link from "next/link";

import { StatusPill } from "@/components/status-pill";
import { getDocuments } from "@/lib/api";

export default async function DocumentsPage() {
  const documents = await getDocuments();

  return (
    <section className="space-y-5">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-accent">Repository</p>
        <h2 className="mt-1 text-3xl font-semibold text-ink">Processed documents</h2>
      </div>

      <div className="overflow-hidden rounded-lg border border-line bg-white">
        <table className="w-full border-collapse text-left text-sm">
          <thead className="bg-panel text-xs uppercase text-slate-500">
            <tr>
              <th className="px-4 py-3">File</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Confidence</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {documents.map((document) => (
              <tr key={document.id} className="border-t border-line">
                <td className="px-4 py-3 font-medium">{document.filename}</td>
                <td className="px-4 py-3">{document.document_type}</td>
                <td className="px-4 py-3">{Math.round(document.confidence_score * 100)}%</td>
                <td className="px-4 py-3"><StatusPill status={document.status} /></td>
                <td className="px-4 py-3">
                  <Link className="font-semibold text-accent" href={`/documents/${document.id}`}>
                    Open
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {documents.length === 0 && <p className="p-5 text-sm text-slate-500">No documents uploaded yet.</p>}
      </div>
    </section>
  );
}

