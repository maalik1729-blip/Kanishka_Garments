export type QuoteRequest = {
  id: string;
  refCode: string;
  productSlug: string;
  productName: string;
  quantity: string;
  destination: string;
  deliveryDate?: string;
  email: string;
  phone?: string;
  notes?: string;
  fileName?: string;
  status: "Pending" | "Contacted" | "Fulfilled";
  createdAt: string;
};

const QUOTES_STORAGE_KEY = "KANISHKA_bulk_quote_requests";

export function getQuoteRequests(): QuoteRequest[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(QUOTES_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveQuoteRequests(quotes: QuoteRequest[]): void {
  try {
    localStorage.setItem(QUOTES_STORAGE_KEY, JSON.stringify(quotes));
  } catch {}
}

export function addQuoteRequest(
  quote: Omit<QuoteRequest, "id" | "refCode" | "status" | "createdAt">,
): QuoteRequest {
  const existing = getQuoteRequests();
  const refCode = `KG-RFQ-2026-${Math.floor(1000 + Math.random() * 9000)}`;
  const newQuote: QuoteRequest = {
    ...quote,
    id: `quote-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    refCode,
    status: "Pending",
    createdAt: new Date().toISOString(),
  };
  const updated = [newQuote, ...existing];
  saveQuoteRequests(updated);
  return newQuote;
}

export function updateQuoteStatus(id: string, status: QuoteRequest["status"]): QuoteRequest[] {
  const existing = getQuoteRequests();
  const updated = existing.map((q) => (q.id === id ? { ...q, status } : q));
  saveQuoteRequests(updated);
  return updated;
}

export function deleteQuoteRequest(id: string): QuoteRequest[] {
  const existing = getQuoteRequests();
  const updated = existing.filter((q) => q.id !== id);
  saveQuoteRequests(updated);
  return updated;
}
