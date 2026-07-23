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
  } catch (err) {
    console.warn("Failed to save quote requests to LocalStorage:", err);
  }
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

// ── MONGO DB API ASYNC HELPERS ─────────────────────────────────────────────

export async function fetchQuoteRequestsApi(): Promise<QuoteRequest[]> {
  try {
    const res = await fetch("/api/quotes");
    if (!res.ok) throw new Error("Failed to fetch quotes from API");
    const data: QuoteRequest[] = await res.json();
    if (Array.isArray(data)) {
      saveQuoteRequests(data);
      return data;
    }
  } catch (err) {
    console.warn("API fetch quotes failed, falling back to LocalStorage:", err);
  }
  return getQuoteRequests();
}

export async function createQuoteRequestApi(
  quote: Omit<QuoteRequest, "id" | "refCode" | "status" | "createdAt">,
): Promise<QuoteRequest> {
  try {
    const res = await fetch("/api/quotes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(quote),
    });
    if (res.ok) {
      const created: QuoteRequest = await res.json();
      const existing = getQuoteRequests();
      saveQuoteRequests([created, ...existing.filter((q) => q.id !== created.id)]);
      return created;
    }
  } catch (err) {
    console.warn("API create quote failed, falling back to LocalStorage:", err);
  }
  return addQuoteRequest(quote);
}

export async function updateQuoteStatusApi(
  id: string,
  status: QuoteRequest["status"],
): Promise<QuoteRequest[]> {
  try {
    const res = await fetch("/api/quotes", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    if (res.ok) {
      const updatedLocal = updateQuoteStatus(id, status);
      return updatedLocal;
    }
  } catch (err) {
    console.warn("API update status failed, falling back to LocalStorage:", err);
  }
  return updateQuoteStatus(id, status);
}

export async function deleteQuoteRequestApi(id: string): Promise<QuoteRequest[]> {
  try {
    const res = await fetch("/api/quotes", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (res.ok) {
      const updatedLocal = deleteQuoteRequest(id);
      return updatedLocal;
    }
  } catch (err) {
    console.warn("API delete quote failed, falling back to LocalStorage:", err);
  }
  return deleteQuoteRequest(id);
}
