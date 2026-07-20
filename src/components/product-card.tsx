import { Link } from "@tanstack/react-router";
import { formatINR } from "@/lib/cart";
import type { Product } from "@/lib/products";
import { ShieldCheck, FileText } from "lucide-react";
import { useState } from "react";

const FALLBACK = "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&h=750&fit=crop&q=80";

export function ProductCard({ product }: { product: Product }) {
  const [activeColorIndex, setActiveColorIndex] = useState(0);

  const swatches = product.colorSwatches && product.colorSwatches.length > 0 
    ? product.colorSwatches 
    : [
        { name: "Carbon Black", hex: "#000000" },
        { name: "Paper White", hex: "#FFFFFF" },
        { name: "Soft Mist", hex: "#E5E7EB" },
        { name: "Slate Gray", hex: "#677284" },
      ];

  return (
    <article className="group flex flex-col bg-white p-[14px] rounded-none border border-black/10 hover:border-black transition-colors font-favorit">
      
      {/* Image container with B2B Badges & Wishlist */}
      <div className="relative w-full overflow-hidden bg-[#f0efe7]" style={{ aspectRatio: "4/5" }}>
        <Link to="/products/$slug" params={{ slug: product.slug }} className="block w-full h-full">
          <img
            src={product.image || FALLBACK}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover object-center rounded-none transition-transform duration-300 group-hover:scale-[1.03]"
            onError={(e) => {
              e.currentTarget.src = FALLBACK;
            }}
          />
        </Link>
        

        {/* B2B Badges overlay */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10">
          {product.badge && (
            <span className="bg-black text-white text-[8px] font-bold tracking-[0.05em] px-2 py-0.5 uppercase shadow-sm">
              {product.badge}
            </span>
          )}
          {product.gsm && (
            <span className="bg-white/95 backdrop-blur-sm text-black border border-black/20 text-[8px] font-bold px-2 py-0.5 uppercase tracking-[0.05em]">
              {product.gsm}
            </span>
          )}
        </div>

        {/* Quality Standard Overlay Footer */}
        <div className="absolute bottom-0 left-0 right-0 bg-black/80 backdrop-blur-sm text-white px-2.5 py-1 text-[8px] font-bold uppercase tracking-wider flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-emerald-400" /> AQL 2.5 INSPECTED
          </span>
          <span>EX-MILL</span>
        </div>
      </div>

      {/* Product Information */}
      <div className="mt-3 flex flex-col flex-1">
        
        {/* Category & Material Snippet */}
        <div className="flex items-center justify-between text-[10px] text-neutral-500 font-medium uppercase mb-1">
          <span className="truncate">{product.categoryLabel}</span>
          <span className="shrink-0">{product.isReadymade ? "READYMADE" : "FABRIC ROLL"}</span>
        </div>

        {/* Color Swatch Row */}
        <div className="flex items-center gap-[4px] mb-2">
          {swatches.slice(0, 5).map((swatch, idx) => (
            <button
              key={swatch.name + idx}
              onClick={() => setActiveColorIndex(idx)}
              title={swatch.name}
              className={`w-[12px] h-[12px] rounded-none cursor-pointer box-border transition-all ${
                activeColorIndex === idx
                  ? "border border-black scale-110"
                  : "border border-neutral-300"
              }`}
              style={{ backgroundColor: swatch.hex }}
            />
          ))}
          {swatches.length > 5 && (
            <span className="text-[9px] text-neutral-400 font-favorit ml-1">
              +{swatches.length - 5}
            </span>
          )}
        </div>

        {/* Product Name */}
        <Link
          to="/products/$slug"
          params={{ slug: product.slug }}
          className="text-[13px] font-bold text-black leading-tight hover:opacity-75 transition-opacity line-clamp-1"
        >
          {product.name}
        </Link>

        {/* Specs Short Info */}
        <p className="text-[10px] text-neutral-500 line-clamp-1 mt-0.5 font-normal">
          {product.composition} {product.yarnCount ? `· ${product.yarnCount}` : ""}
        </p>

        {/* Price & Wholesale Action CTA Row */}
        <div className="mt-3 flex items-center justify-between pt-2 border-t border-neutral-200">
          <div className="flex flex-col">
            <span className="text-[13px] font-bold text-black">
              {formatINR(product.wholesalePrice)}
              <span className="text-[9px] font-normal text-neutral-500"> / {product.unit}</span>
            </span>
            <span className="text-[9px] text-neutral-600 font-bold uppercase">
              MOQ: {product.moq} {product.unit}S
            </span>
          </div>

          {/* B2B Specs Action Button */}
          <Link
            to="/products/$slug"
            params={{ slug: product.slug }}
            className="btn-filled-add inline-flex items-center justify-center text-[10px] font-bold text-white bg-black uppercase px-2.5 py-1.5 hover:bg-neutral-800 transition-colors gap-1"
          >
            <FileText className="w-3 h-3" /> SPECS & RFQ
          </Link>
        </div>

      </div>
    </article>
  );
}