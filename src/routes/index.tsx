import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { ProductCard } from "@/components/product-card";
import { staticProducts, getAdminProducts } from "@/lib/products";
import type { Product } from "@/lib/products";
import heroImg from "@/assets/hero.png";

const EDITORIAL_LEFT = "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&h=1000&fit=crop&q=85&auto=format";
const EDITORIAL_RIGHT = "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=800&h=1000&fit=crop&q=85&auto=format";
const BLUSH_SECTION_IMG = "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1000&h=650&fit=crop&q=85&auto=format";

const CATEGORY_TABS = [
  { id: "ALL", label: "ALL COLLECTION" },
  { id: "ACTIVEWEAR", label: "ACTIVEWEAR" },
  { id: "HOODIES", label: "HOODIES & SWEATS" },
  { id: "LADIES", label: "LADIES WEAR" },
  { id: "GENTS", label: "GENTS WEAR" },
  { id: "FABRIC", label: "COTTON FABRICS" },
];

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "KANISHKA GARMENTS — Editorial Apparel Lookbook & Wholesale Mill" },
      {
        name: "description",
        content:
          "Gallery-like fashion canvas. Monochrome activewear, organic knitwear, and wholesale textile production direct from Tirupur.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  const [allProducts, setAllProducts] = useState<Product[]>(staticProducts);
  const [activeTab, setActiveTab] = useState("ALL");

  useEffect(() => {
    setAllProducts([...staticProducts, ...getAdminProducts()]);
  }, []);

  const filteredProducts = allProducts.filter((p) => {
    if (activeTab === "ALL") return true;
    if (activeTab === "ACTIVEWEAR") return p.category === "ladies" || p.category === "gents";
    if (activeTab === "HOODIES") return p.name.toLowerCase().includes("kurti") || p.name.toLowerCase().includes("tee") || p.name.toLowerCase().includes("shirt");
    if (activeTab === "LADIES") return p.category === "ladies";
    if (activeTab === "GENTS") return p.category === "gents";
    if (activeTab === "FABRIC") return p.category === "fabric" || p.category === "home-textiles";
    return true;
  });

  return (
    <div className="bg-white font-favorit text-black selection:bg-black selection:text-white">
      
      {/* ── 1. HERO SECTION — Poster Style Layout with hero.png on Right ── */}
      <section className="w-full bg-[#f0efe7] border-b border-black">
        <div className="mx-auto max-w-[1440px] px-6 lg:px-12 py-10 lg:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Content (Urban Street / Kanishka Apparel Poster Style) */}
            <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
              
              {/* Top Logo / Brand Badge */}
              <div className="flex flex-col items-start">
                <div className="border border-black px-3 py-1 font-bold text-[14px] leading-none tracking-[0.05em] uppercase text-black">
                  KANISHKA
                </div>
                <div className="text-[10px] font-bold tracking-[0.2em] uppercase text-neutral-600 mt-1">
                  STREETWEAR & FABRICS
                </div>
              </div>

              {/* Decorative Line Rule */}
              <div className="w-28 h-[3px] bg-black my-2" />

              {/* Main Extended Headline */}
              <h1 className="font-bold text-[32px] sm:text-[44px] lg:text-[50px] leading-[1.08] tracking-tight uppercase text-black font-favorit">
                PROVE YOUR GENERATION URBAN STYLE
              </h1>

              {/* Subtitle */}
              <p className="text-[14px] sm:text-[15px] text-neutral-700 font-normal leading-relaxed max-w-md">
                Activewear, knitwear and more than just clothes
              </p>

              {/* Button & Graphic Line Accent */}
              <div className="pt-2">
                <div className="inline-block relative">
                  <Link
                    to="/products"
                    className="bg-black text-white px-8 py-3.5 text-[12px] font-bold tracking-[0.05em] uppercase rounded-none hover:bg-neutral-800 transition-colors inline-block cursor-pointer shadow-none"
                  >
                    NEW COLLECTION
                  </Link>

                  {/* Decorative Diagonal Hatched Lines */}
                  <div className="mt-2 w-48 h-6 overflow-hidden">
                    <svg className="w-full h-full" viewBox="0 0 200 30" fill="none">
                      <line x1="10" y1="30" x2="30" y2="0" stroke="black" strokeWidth="2" />
                      <line x1="25" y1="30" x2="45" y2="0" stroke="black" strokeWidth="2" />
                      <line x1="40" y1="30" x2="60" y2="0" stroke="black" strokeWidth="2" />
                      <line x1="55" y1="30" x2="75" y2="0" stroke="black" strokeWidth="2" />
                      <line x1="70" y1="30" x2="90" y2="0" stroke="black" strokeWidth="2" />
                      <line x1="85" y1="30" x2="105" y2="0" stroke="black" strokeWidth="2" />
                      <line x1="100" y1="30" x2="120" y2="0" stroke="black" strokeWidth="2" />
                      <line x1="115" y1="30" x2="135" y2="0" stroke="black" strokeWidth="2" />
                      <line x1="130" y1="30" x2="150" y2="0" stroke="black" strokeWidth="2" />
                      <line x1="145" y1="30" x2="165" y2="0" stroke="black" strokeWidth="2" />
                      <line x1="160" y1="30" x2="180" y2="0" stroke="black" strokeWidth="2" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Bottom Reference & Right Accent Line */}
              <div className="pt-6 flex items-center justify-between border-t border-black/20 text-[11px] text-neutral-600 font-medium tracking-[0.025em]">
                <span>www.kanishkagarments.com</span>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-[4px] bg-black" />
                  <div className="w-12 h-[4px] bg-black" />
                </div>
              </div>

            </div>

            {/* Right Column: Hero Image (hero.png) */}
            <div className="lg:col-span-6 flex justify-center items-center h-full">
              <div className="w-full h-full max-h-[580px] overflow-hidden bg-[#f0efe7] flex items-center justify-center">
                <img
                  src={heroImg}
                  alt="Kanishka Garments Hero Urban Style Collection"
                  className="w-full h-full object-contain object-center rounded-none mix-blend-multiply"
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── 2. NEW & TRENDING PRODUCT GRID SECTION ── */}
      <section className="mx-auto max-w-[1440px] px-4 md:px-8 py-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div>
            <h2 className="favorit-heading text-[20px] font-bold text-black uppercase tracking-[0.025em]">
              New & Trending
            </h2>
            <p className="text-[12px] text-neutral-500 font-normal mt-1">
              Curated editorial activewear, knitwear, and wholesale textile essentials.
            </p>
          </div>

          {/* Category Tab Filter */}
          <div className="flex items-center gap-[6px] overflow-x-auto pb-2 md:pb-0 scrollbar-none">
            {CATEGORY_TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`text-[12px] font-medium px-3 py-1.5 whitespace-nowrap cursor-pointer transition-colors ${
                  activeTab === tab.id
                    ? "bg-black text-white rounded-none"
                    : "bg-transparent text-black hover:opacity-60"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* 4-Column Desktop Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-16">
          {filteredProducts.slice(0, 12).map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>

        {/* View All Products Action */}
        <div className="mt-16 text-center">
          <Link
            to="/products"
            className="btn-ghost-cta inline-block px-10 py-3 text-[12px] font-medium"
          >
            VIEW ENTIRE CATALOGUE ({allProducts.length})
          </Link>
        </div>
      </section>

      {/* ── 3. SPLIT EDITORIAL SECTION — Two equal-width 50%/50% photos ── */}
      <section className="w-full my-16">
        <div className="mx-auto max-w-[1440px] grid grid-cols-1 md:grid-cols-2 gap-1 md:gap-2 px-4 md:px-8">
          <div className="relative aspect-[4/5] overflow-hidden bg-[#f0efe7]">
            <img
              src={EDITORIAL_LEFT}
              alt="Editorial split feature left"
              className="w-full h-full object-cover rounded-none transition-transform duration-500 hover:scale-[1.01]"
            />
            <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur-sm p-4 max-w-xs border border-black/10">
              <span className="text-[10px] uppercase font-bold tracking-[0.025em] text-neutral-500">LOOKBOOK SPREAD 01</span>
              <h3 className="text-[16px] font-normal text-black mt-1">Form & Function Activewear</h3>
              <Link to="/products" className="text-[11px] font-medium underline underline-offset-4 mt-2 inline-block">EXPLORE LOOKBOOK →</Link>
            </div>
          </div>

          <div className="relative aspect-[4/5] overflow-hidden bg-[#f0efe7]">
            <img
              src={EDITORIAL_RIGHT}
              alt="Editorial split feature right"
              className="w-full h-full object-cover rounded-none transition-transform duration-500 hover:scale-[1.01]"
            />
            <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur-sm p-4 max-w-xs border border-black/10">
              <span className="text-[10px] uppercase font-bold tracking-[0.025em] text-neutral-500">LOOKBOOK SPREAD 02</span>
              <h3 className="text-[16px] font-normal text-black mt-1">Direct Tirupur Mill Knits</h3>
              <Link to="/wholesale" className="text-[11px] font-medium underline underline-offset-4 mt-2 inline-block">REQUEST MILL SPECS →</Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. BLUSH SAND EDITORIAL HIGHLIGHT SECTION ── */}
      <section className="bg-[#f5ebd5] py-20 px-4 md:px-8 my-16 border-y border-black">
        <div className="mx-auto max-w-[1440px] grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-4 max-w-xl">
            <span className="text-[11px] font-bold uppercase tracking-[0.025em] text-neutral-600">
              CRAFT & CAPACITY
            </span>
            <h2 className="favorit-display text-[30px] font-normal leading-tight text-black">
              Monochrome Precision. Vertically Integrated Textile Manufacturing.
            </h2>
            <p className="text-[14px] leading-relaxed text-neutral-700">
              Founded in Tirupur, India, Kanishka Garments operates a gallery-like manufacturing canvas. We produce 100% combed cotton, biowashed fleece, activewear sets, and custom yarn for global private label partners and wholesale buyers.
            </p>
            <div className="pt-4 flex flex-wrap gap-4">
              <Link to="/wholesale" className="btn-filled-add py-3 px-8 text-[12px] font-medium">
                REQUEST WHOLESALE QUOTE
              </Link>
              <Link to="/about" className="btn-ghost-cta py-3 px-8 text-[12px] font-medium">
                ABOUT OUR MILL
              </Link>
            </div>
          </div>

          <div className="aspect-[16/10] overflow-hidden bg-neutral-200">
            <img
              src={BLUSH_SECTION_IMG}
              alt="Tirupur mill production detail"
              className="w-full h-full object-cover rounded-none"
            />
          </div>
        </div>
      </section>

      {/* ── 5. SECONDARY PRODUCT GRID — SWEATS & FABRICS ── */}
      <section className="mx-auto max-w-[1440px] px-4 md:px-8 py-16">
        <div className="mb-8">
          <h2 className="favorit-heading text-[20px] font-bold text-black uppercase tracking-[0.025em]">
            Sweats, Hoodies & Raw Knits
          </h2>
          <p className="text-[12px] text-neutral-500 font-normal mt-1">
            Heavyweight 350 GSM fleece, French terry, and organic cotton fabric rolls.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-16">
          {allProducts.slice(4, 12).map((product) => (
            <ProductCard key={product.slug + "-second"} product={product} />
          ))}
        </div>
      </section>

    </div>
  );
}
