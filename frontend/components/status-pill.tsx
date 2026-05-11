import type { DocumentStatus } from "@/lib/api";

const statusStyles: Record<DocumentStatus, string> = {
  processing: "bg-slate-100 text-slate-700",
  needs_review: "bg-amber-100 text-amber-800",
  approved: "bg-emerald-100 text-emerald-800",
  rejected: "bg-rose-100 text-rose-800",
};

export function StatusPill({ status }: { status: DocumentStatus }) {
  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${statusStyles[status]}`}>
      {status.replace("_", " ")}
    </span>
  );
}

