import { createFileRoute } from "@tanstack/react-router";
import { getProductsCollection } from "@/lib/db";
import type { Product } from "@/lib/products";

export const Route = createFileRoute("/api/products")({
  server: {
    handlers: {
      GET: async () => {
        try {
          const productsCol = await getProductsCollection();
          const products = await productsCol.find({}, { projection: { _id: 0 } }).toArray();
          return new Response(JSON.stringify(products), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          });
        } catch (error) {
          console.error("MongoDB GET Products Error:", error);
          return new Response(JSON.stringify([]), {
            status: 500,
            headers: { "Content-Type": "application/json" },
          });
        }
      },
      POST: async ({ request }) => {
        try {
          const product: Product = await request.json();
          if (!product.slug || !product.name) {
            return new Response(JSON.stringify({ error: "Missing required product fields" }), {
              status: 400,
              headers: { "Content-Type": "application/json" },
            });
          }
          const productsCol = await getProductsCollection();
          await productsCol.updateOne(
            { slug: product.slug },
            { $set: { ...product, isAdminAdded: true } },
            { upsert: true },
          );
          return new Response(JSON.stringify(product), {
            status: 201,
            headers: { "Content-Type": "application/json" },
          });
        } catch (error) {
          console.error("MongoDB POST Product Error:", error);
          return new Response(JSON.stringify({ error: "Failed to save product to MongoDB" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
          });
        }
      },
      PUT: async ({ request }) => {
        try {
          const product: Product = await request.json();
          const productsCol = await getProductsCollection();
          await productsCol.updateOne(
            { slug: product.slug },
            { $set: { ...product, isAdminAdded: true } },
            { upsert: true },
          );
          return new Response(JSON.stringify(product), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          });
        } catch (error) {
          console.error("MongoDB PUT Product Error:", error);
          return new Response(JSON.stringify({ error: "Failed to update product in MongoDB" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
          });
        }
      },
      DELETE: async ({ request }) => {
        try {
          const body = await request.json();
          const { slug } = body;
          if (!slug) {
            return new Response(JSON.stringify({ error: "Missing product slug" }), {
              status: 400,
              headers: { "Content-Type": "application/json" },
            });
          }
          const productsCol = await getProductsCollection();
          const product = await productsCol.findOne({ slug });

          // If the product has a Cloudinary image, delete it from Cloudinary
          if (product && product.image && product.image.includes("res.cloudinary.com")) {
            try {
              let publicId: string | null = null;
              const parts = product.image.split("/image/upload/");
              if (parts.length >= 2) {
                let pathSegment = parts[1];
                if (pathSegment.startsWith("v")) {
                  const slashIndex = pathSegment.indexOf("/");
                  if (slashIndex !== -1) {
                    pathSegment = pathSegment.substring(slashIndex + 1);
                  }
                }
                pathSegment = pathSegment.split("?")[0];
                const lastDotIdx = pathSegment.lastIndexOf(".");
                if (lastDotIdx !== -1) {
                  pathSegment = pathSegment.substring(0, lastDotIdx);
                }
                publicId = pathSegment;
              }

              if (publicId) {
                const { v2: cloudinary } = require("cloudinary");
                cloudinary.config({
                  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "espliwjf",
                  api_key: process.env.CLOUDINARY_API_KEY || "335983481924183",
                  api_secret: process.env.CLOUDINARY_API_SECRET || "4hHI620lkH2lAYU-TNfIO9-3Nt4",
                });
                await cloudinary.uploader.destroy(publicId);
                console.log(`🧹 Deleted Cloudinary asset: ${publicId}`);
              }
            } catch (clError) {
              console.warn("Cloudinary delete failed during product deletion:", clError);
            }
          }

          await productsCol.deleteOne({ slug });
          return new Response(JSON.stringify({ success: true, slug }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          });
        } catch (error) {
          console.error("MongoDB DELETE Product Error:", error);
          return new Response(JSON.stringify({ error: "Failed to delete product from MongoDB" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
          });
        }
      },
    },
  },
});
