import { API_BASE } from "@/lib/api";

type Analytics = {
  total_documents: number;
  status_counts: Record<string, number>;
  type_counts: Record<string, number>;
  average_confidence: number;
  needs_review: number;
};

async function getAnalytics(): Promise<Analytics> {
  const response = await fetch(`${API_BASE}/analytics`, { cache: "no-store" });
  if (!response.ok) throw new Error("Failed to load analytics");
  return response.json();
}

export default async function AnalyticsPage() {
  const analytics = await getAnalytics();

  return (
    <section className="space-y-5">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-accent">Operations</p>
        <h2 className="mt-1 text-3xl font-semibold text-ink">Pipeline analytics</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Metric label="Total documents" value={analytics.total_documents} />
        <Metric label="Needs review" value={analytics.needs_review} />
        <Metric label="Avg confidence" value={`${Math.round(analytics.average_confidence * 100)}%`} />
        <Metric label="Document types" value={Object.keys(analytics.type_counts).length} />
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <Breakdown title="Status breakdown" data={analytics.status_counts} />
        <Breakdown title="Type breakdown" data={analytics.type_counts} />
      </div>
    </section>
  );
}

function Metric({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-lg border border-line bg-white p-5">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-2 text-3xl font-semibold text-ink">{value}</p>
    </div>
  );
}

function Breakdown({ title, data }: { title: string; data: Record<string, number> }) {
  return (
    <div className="rounded-lg border border-line bg-white p-5">
      <h3 className="text-lg font-semibold">{title}</h3>
      <div className="mt-4 space-y-3">
        {Object.entries(data).map(([key, value]) => (
          <div key={key} className="flex items-center justify-between rounded-md bg-panel px-3 py-2 text-sm">
            <span>{key.replace("_", " ")}</span>
            <span className="font-semibold">{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

