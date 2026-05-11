export const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:8000";

export type DocumentStatus = "processing" | "needs_review" | "approved" | "rejected";

export type ExtractedField = {
  name: string;
  value: string;
  confidence: number;
  source: string;
  approved: boolean;
};

export type ValidationIssue = {
  field: string;
  severity: string;
  message: string;
};

export type DocumentRecord = {
  id: string;
  filename: string;
  content_type: string;
  document_type: string;
  status: DocumentStatus;
  raw_text: string;
  summary: string;
  confidence_score: number;
  fields: ExtractedField[];
  validation_issues: ValidationIssue[];
  audit_history: Record<string, unknown>[];
  created_at: string;
  updated_at: string;
};

export async function getDocuments(): Promise<DocumentRecord[]> {
  const response = await fetch(`${API_BASE}/documents`, { cache: "no-store" });
  if (!response.ok) throw new Error("Failed to load documents");
  return response.json();
}

export async function getDocument(id: string): Promise<DocumentRecord> {
  const response = await fetch(`${API_BASE}/documents/${id}`, { cache: "no-store" });
  if (!response.ok) throw new Error("Failed to load document");
  return response.json();
}

export async function approveDocument(id: string): Promise<DocumentRecord> {
  const response = await fetch(`${API_BASE}/documents/${id}/approve`, { method: "POST" });
  if (!response.ok) throw new Error("Failed to approve document");
  return response.json();
}

export async function rejectDocument(id: string): Promise<DocumentRecord> {
  const response = await fetch(`${API_BASE}/documents/${id}/reject`, { method: "POST" });
  if (!response.ok) throw new Error("Failed to reject document");
  return response.json();
}

