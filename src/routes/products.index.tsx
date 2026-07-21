import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect, useMemo } from "react";
import { z } from "zod";
import { X, Search } from "lucide-react";
import { ProductCard } from "@/components/product-card";
import { mainCategories, staticProducts, getAdminProducts, fetchAdminProductsApi } from "@/lib/products";
import type { Product } from "@/lib/products";
import { formatINR } from "@/lib/cart";

const searchSchema = z.object({
  c: z.string().optional(),
  type: z.string().optional(),
  q: z.string().optional(),
  rm: z.enum(["all", "readymade", "fabric"]).optional(),
});

export const Route = createFileRoute("/products/")({
  head: () => ({
    meta: [
      { title: "Catalog & Lookbook — KANISHKA GARMENTS" },
      {
        name: "description",
        content:
          "Explore the gallery-like activewear and apparel catalog. Minimalist knitwear, fabrics, and custom wholesale manufacturing.",
      },
    ],
  }),
  validateSearch: searchSchema,
  component: ProductsPage,
});

const PRICE_RANGES = [
  { label: "All prices", min: 0, max: Infinity },
  { label: "Under ₹150", min: 0, max: 150 },
  { label: "₹150 – ₹300", min: 150, max: 300 },
  { label: "₹300 – ₹600", min: 300, max: 600 },
  { label: "₹600 – ₹1,200", min: 600, max: 1200 },
  { label: "Above ₹1,200", min: 1200, max: Infinity },
];

function ProductsPage() {
  const { c, type, q, rm } = Route.useSearch();
  const navigate = useNavigate({ from: "/products/" });

  const [allProducts, setAllProducts] = useState<Product[]>(() => [
    ...staticProducts,
    ...getAdminProducts(),
  ]);
  const [priceRange, setPriceRange] = useState(0);
  const [searchQuery, setSearchQuery] = useState(q || "");

  useEffect(() => {
    const refreshProducts = () => {
      setAllProducts([...staticProducts, ...getAdminProducts()]);
    };
    
    const fetchProducts = async () => {
      const data = await fetchAdminProductsApi();
      setAllProducts([...staticProducts, ...data]);
    };
    
    fetchProducts();

    window.addEventListener("kanishka_products_updated", refreshProducts);
    window.addEventListener("storage", refreshProducts);
    return () => {
      window.removeEventListener("kanishka_products_updated", refreshProducts);
      window.removeEventListener("storage", refreshProducts);
    };
  }, []);

  const categoriesList = useMemo(() => {
    const mainSlugs = new Set(mainCategories.map((m) => m.slug));
    const extraMap = new Map<string, { slug: string; label: string; blurb: string }>();

    allProducts.forEach((p) => {
      if (!mainSlugs.has(p.category) && !extraMap.has(p.category)) {
        extraMap.set(p.category, {
          slug: p.category,
          label: p.categoryLabel || p.category.charAt(0).toUpperCase() + p.category.slice(1),
          blurb: p.shortDescription || "",
        });
      }
    });

    return [...mainCategories, ...Array.from(extraMap.values())];
  }, [allProducts]);

  const subTypes = useMemo(() => {
    const base = c ? allProducts.filter((p) => p.category === c) : allProducts;
    const types = Array.from(new Set(base.map((p) => p.subType).filter(Boolean))) as string[];
    return types.sort();
  }, [allProducts, c]);

  const getCategoryCount = (slug: string) => {
    return allProducts.filter((p) => p.category === slug).length;
  };

  const filtered = useMemo(() => {
    let list = allProducts;
    if (c) {
      list = list.filter((p) => p.category === c);
    }
    if (type) list = list.filter((p) => p.subType === type);
    if (searchQuery.trim()) {
      const qLower = searchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(qLower) ||
          p.categoryLabel.toLowerCase().includes(qLower) ||
          p.composition.toLowerCase().includes(qLower),
      );
    }
    if (rm === "readymade") list = list.filter((p) => p.isReadymade !== false);
    if (rm === "fabric") list = list.filter((p) => p.isReadymade === false);
    const pr = PRICE_RANGES[priceRange];
    list = list.filter((p) => p.wholesalePrice >= pr.min && p.wholesalePrice < pr.max);
    return list;
  }, [allProducts, c, type, searchQuery, rm, priceRange]);

  const activeCat = categoriesList.find((m) => m.slug === c);

  const setSearch = (patch: Record<string, string | undefined>) =>
    navigate({ search: (prev) => ({ ...prev, ...patch }) });

  return (
    <div className="bg-white font-favorit text-black py-10 md:py-16">
      <div className="mx-auto max-w-[1440px] px-4 md:px-8">
        {/* Editorial Heading */}
        <div className="mb-8 border-b border-black pb-6">
          <span className="text-[10px] font-bold uppercase tracking-[0.025em] text-neutral-500">
            EDITORIAL CATALOGUE
          </span>
          <h1 className="favorit-display text-[30px] font-normal text-black mt-1">
            {activeCat ? activeCat.label.toUpperCase() : "ALL COLLECTION"}
          </h1>
          <p className="text-[12px] text-neutral-600 font-normal mt-2 max-w-xl">
            {activeCat
              ? activeCat.blurb
              : "Explore our monochrome activewear, heavyweight sweat sets, premium cotton fabrics, and custom private label manufacturing."}
          </p>
        </div>

        {/* Search & Category Tab Switcher Bar */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-8">
          {/* Underlined Search Input */}
          <div className="relative w-full md:w-80">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="SEARCH PRODUCTS OR FABRICS..."
              className="search-underline-input w-full pr-8 text-[12px]"
            />
            <Search className="w-4 h-4 absolute right-0 top-2 text-black stroke-[1.5]" />
          </div>

          {/* Category Tabs (Sharp rectangle 0px radius active tab) */}
          <div className="flex items-center gap-[6px] overflow-x-auto pb-2 md:pb-0 scrollbar-none">
            <button
              onClick={() => navigate({ search: {} })}
              className={`text-[12px] font-medium px-4 py-1.5 whitespace-nowrap cursor-pointer transition-colors ${
                !c
                  ? "bg-black text-white rounded-none"
                  : "bg-transparent text-black hover:opacity-60"
              }`}
            >
              ALL ({allProducts.length})
            </button>
            {categoriesList.map((cat) => {
              const count = getCategoryCount(cat.slug);
              return (
                <button
                  key={cat.slug}
                  onClick={() => navigate({ search: { c: cat.slug } })}
                  className={`text-[12px] font-medium px-4 py-1.5 whitespace-nowrap cursor-pointer transition-colors ${
                    c === cat.slug
                      ? "bg-black text-white rounded-none"
                      : "bg-transparent text-black hover:opacity-60"
                  }`}
                >
                  {cat.label.toUpperCase()} ({count})
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 mt-8">
          {/* Sidebar Filters */}
          <aside className="w-full lg:w-64 shrink-0 border-t lg:border-t-0 lg:border-r border-black pt-6 lg:pt-0 lg:pr-6">
            <div className="space-y-6">
              {/* Type Filter */}
              <div>
                <h4 className="text-[11px] font-bold uppercase tracking-[0.025em] text-black mb-3">
                  GARMENT TYPE
                </h4>
                <div className="flex flex-col gap-1.5 text-[12px]">
                  {[
                    { value: undefined, label: "All Types" },
                    { value: "readymade" as const, label: "Readymade Apparel" },
                    { value: "fabric" as const, label: "Raw Fabrics & Knits" },
                  ].map((opt) => (
                    <button
                      key={opt.label}
                      onClick={() => setSearch({ rm: opt.value })}
                      className={`text-left py-1 hover:opacity-60 transition-opacity ${
                        rm === opt.value || (!rm && !opt.value)
                          ? "font-bold text-black underline underline-offset-4"
                          : "text-neutral-600 font-normal"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sub-types */}
              {subTypes.length > 0 && (
                <div>
                  <h4 className="text-[11px] font-bold uppercase tracking-[0.025em] text-black mb-3">
                    SUB-CATEGORY
                  </h4>
                  <div className="flex flex-col gap-1.5 max-h-48 overflow-y-auto text-[12px]">
                    <button
                      onClick={() => setSearch({ type: undefined })}
                      className={`text-left py-1 hover:opacity-60 transition-opacity capitalize ${
                        !type
                          ? "font-bold text-black underline underline-offset-4"
                          : "text-neutral-600 font-normal"
                      }`}
                    >
                      All Sub-categories
                    </button>
                    {subTypes.map((st) => (
                      <button
                        key={st}
                        onClick={() => setSearch({ type: st })}
                        className={`text-left py-1 hover:opacity-60 transition-opacity capitalize ${
                          type === st
                            ? "font-bold text-black underline underline-offset-4"
                            : "text-neutral-600 font-normal"
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Price Range */}
              <div>
                <h4 className="text-[11px] font-bold uppercase tracking-[0.025em] text-black mb-3">
                  WHOLESALE PRICE
                </h4>
                <div className="flex flex-col gap-1.5 text-[12px]">
                  {PRICE_RANGES.map((pr, i) => (
                    <button
                      key={pr.label}
                      onClick={() => setPriceRange(i)}
                      className={`text-left py-1 hover:opacity-60 transition-opacity ${
                        priceRange === i
                          ? "font-bold text-black underline underline-offset-4"
                          : "text-neutral-600 font-normal"
                      }`}
                    >
                      {pr.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Reset Filters button */}
              {(c || type || rm || priceRange > 0 || searchQuery) && (
                <button
                  onClick={() => {
                    navigate({ search: {} });
                    setPriceRange(0);
                    setSearchQuery("");
                  }}
                  className="btn-ghost-cta w-full text-center py-2 text-[11px] font-medium"
                >
                  CLEAR ALL FILTERS
                </button>
              )}
            </div>
          </aside>

          {/* Main Grid View */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6 pb-2 border-b border-neutral-200 text-[12px] text-neutral-500 font-normal">
              <span>
                {filtered.length} ITEM{filtered.length !== 1 ? "S" : ""} FOUND
              </span>
              {filtered.length > 0 && (
                <span>
                  RANGE: {formatINR(Math.min(...filtered.map((p) => p.wholesalePrice)))} –{" "}
                  {formatINR(Math.max(...filtered.map((p) => p.wholesalePrice)))}
                </span>
              )}
            </div>

            {filtered.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-16">
                {filtered.map((product) => (
                  <ProductCard key={product.slug} product={product} />
                ))}
              </div>
            ) : (
              <div className="py-24 text-center border border-black/10 p-8 font-favorit">
                <p className="text-[16px] font-normal text-black">
                  NO PRODUCTS MATCH YOUR SELECTION
                </p>
                <p className="text-[12px] text-neutral-500 mt-2">
                  Try adjusting your category filter or search query.
                </p>
                <button
                  onClick={() => {
                    navigate({ search: {} });
                    setPriceRange(0);
                    setSearchQuery("");
                  }}
                  className="btn-ghost-cta mt-6 inline-block"
                >
                  RESET SEARCH
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Editorial Quote Callout */}
        <div className="mt-24 bg-[#f0efe7] p-8 md:p-12 border border-black flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.025em] text-neutral-500">
              CUSTOM LAB-DIPS & PRIVATE LABELING
            </span>
            <h3 className="text-[20px] font-normal text-black mt-1">
              Need custom PMS pantone matching or tailored GSM weights?
            </h3>
            <p className="text-[12px] text-neutral-600 mt-1">
              Our Tirupur spinning & knitting facility manufactures custom specs with 48-hour quote
              turnaround.
            </p>
          </div>
          <Link to="/wholesale" className="btn-filled-add py-3 px-8 text-[12px] whitespace-nowrap">
            REQUEST MILL QUOTE
          </Link>
        </div>
      </div>
    </div>
  );
}
