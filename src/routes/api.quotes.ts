import { createFileRoute } from "@tanstack/react-router";
import { getQuotesCollection } from "@/lib/db";
import type { QuoteRequest } from "@/lib/quotes";

export const Route = createFileRoute("/api/quotes")({
  server: {
    handlers: {
      GET: async () => {
        try {
          const quotesCol = await getQuotesCollection();
          const quotes = await quotesCol
            .find({}, { projection: { _id: 0 } })
            .sort({ createdAt: -1 })
            .toArray();
          return new Response(JSON.stringify(quotes), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          });
        } catch (error) {
          console.error("MongoDB GET Quotes Error:", error);
          return new Response(JSON.stringify([]), {
            status: 500,
            headers: { "Content-Type": "application/json" },
          });
        }
      },
      POST: async ({ request }) => {
        try {
          const body = await request.json();
          const quotesCol = await getQuotesCollection();

          const refCode = `KG-RFQ-2026-${Math.floor(1000 + Math.random() * 9000)}`;
          const id = `quote-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

          const newQuote: QuoteRequest = {
            id,
            refCode,
            productSlug: body.productSlug || "",
            productName: body.productName || "Apparel RFQ",
            quantity: String(body.quantity || "100"),
            destination: body.destination || "",
            deliveryDate: body.deliveryDate || undefined,
            email: body.email || "",
            phone: body.phone || undefined,
            notes: body.notes || undefined,
            fileName: body.fileName || undefined,
            status: "Pending",
            createdAt: new Date().toISOString(),
          };

          await quotesCol.insertOne({ ...newQuote });

          return new Response(JSON.stringify(newQuote), {
            status: 201,
            headers: { "Content-Type": "application/json" },
          });
        } catch (error) {
          console.error("MongoDB POST Quote Error:", error);
          return new Response(JSON.stringify({ error: "Failed to create quote request" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
          });
        }
      },
      PATCH: async ({ request }) => {
        try {
          const body = await request.json();
          const { id, status } = body;
          if (!id || !status) {
            return new Response(JSON.stringify({ error: "Missing id or status" }), {
              status: 400,
              headers: { "Content-Type": "application/json" },
            });
          }
          const quotesCol = await getQuotesCollection();
          await quotesCol.updateOne({ id }, { $set: { status } });
          return new Response(JSON.stringify({ success: true, id, status }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          });
        } catch (error) {
          console.error("MongoDB PATCH Quote Error:", error);
          return new Response(JSON.stringify({ error: "Failed to update status" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
          });
        }
      },
      DELETE: async ({ request }) => {
        try {
          const body = await request.json();
          const { id } = body;
          if (!id) {
            return new Response(JSON.stringify({ error: "Missing id" }), {
              status: 400,
              headers: { "Content-Type": "application/json" },
            });
          }
          const quotesCol = await getQuotesCollection();
          await quotesCol.deleteOne({ id });
          return new Response(JSON.stringify({ success: true, id }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          });
        } catch (error) {
          console.error("MongoDB DELETE Quote Error:", error);
          return new Response(JSON.stringify({ error: "Failed to delete quote" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
          });
        }
      },
    },
  },
});
