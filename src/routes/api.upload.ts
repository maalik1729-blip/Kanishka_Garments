import { createFileRoute } from "@tanstack/react-router";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "espliwjf",
  api_key: process.env.CLOUDINARY_API_KEY || "335983481924183",
  api_secret: process.env.CLOUDINARY_API_SECRET || "4hHI620lkH2lAYU-TNfIO9-3Nt4",
});

export const Route = createFileRoute("/api/upload")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = await request.json();
          const { image } = body;

          if (!image) {
            return new Response(JSON.stringify({ error: "No image file provided" }), {
              status: 400,
              headers: { "Content-Type": "application/json" },
            });
          }

          const uploadResponse = await cloudinary.uploader.upload(image, {
            folder: "kanishka_products",
          });

          return new Response(
            JSON.stringify({
              url: uploadResponse.secure_url,
              public_id: uploadResponse.public_id,
            }),
            {
              status: 200,
              headers: { "Content-Type": "application/json" },
            },
          );
        } catch (error) {
          console.error("Cloudinary Upload Error:", error);
          const message =
            error instanceof Error ? error.message : "Failed to upload image to Cloudinary";
          return new Response(JSON.stringify({ error: message }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
          });
        }
      },
    },
  },
});
