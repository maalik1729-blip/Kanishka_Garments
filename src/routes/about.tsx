import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2 } from "lucide-react";
import factory from "@/assets/factory-hero.png";
import loom from "@/assets/carousel-2.png";
import yarn from "@/assets/carousel-4.png";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "Our Mill & Craft — KANISHKA GARMENTS" },
      {
        name: "description",
        content:
          "Gallery-like fashion canvas. Tirupur textile manufacturing, organic knitwear, and private label apparel production.",
      },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="bg-white font-favorit text-black py-12 md:py-20">
      
      {/* ── 1. HERO SECTION ── */}
      <section className="mx-auto max-w-[1440px] px-4 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <span className="text-[10px] font-bold uppercase tracking-[0.025em] text-neutral-500">
              OUR HERITAGE & MILL ARCHITECTURE
            </span>
            <h1 className="favorit-display text-[30px] sm:text-[36px] font-normal leading-tight text-black">
              A gallery-like fashion canvas where product photography is the visual language.
            </h1>
            <p className="text-[13px] text-neutral-600 font-normal leading-relaxed">
              Founded in 2004 in Tirupur, India, Kanishka Garments operates as a vertically integrated textile manufacturer. We produce 100% combed cotton knitwear, activewear sets, biowashed fleece, and custom private label apparel for global retail brands.
            </p>
            <div className="pt-2 flex flex-wrap gap-4">
              <Link to="/wholesale" className="btn-filled-add py-3 px-8 text-[12px] font-medium">
                REQUEST WHOLESALE QUOTE
              </Link>
              <Link to="/contact" className="btn-ghost-cta py-3 px-8 text-[12px] font-medium">
                CONTACT MILL REPRESENTATIVE
              </Link>
            </div>
          </div>

          <div className="lg:col-span-6 aspect-[4/3] bg-[#f0efe7] overflow-hidden">
            <img
              src={factory}
              alt="Kanishka Garments manufacturing floor, Tirupur"
              className="w-full h-full object-cover rounded-none"
            />
          </div>
        </div>
      </section>

      {/* ── 2. METRICS DISPLAY ── */}
      <section className="bg-[#f0efe7] py-16 px-4 md:px-8 my-20 border-y border-black">
        <div className="mx-auto max-w-[1440px] grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { k: "2004", v: "ESTABLISHED IN TIRUPUR" },
            { k: "180+", v: "KNITTING & SEWING UNITS" },
            { k: "2.4M", v: "GARMENTS / MONTH" },
            { k: "5,000+", v: "GLOBAL RETAIL CLIENTS" },
          ].map((s) => (
            <div key={s.k} className="space-y-1">
              <div className="favorit-display text-[32px] font-normal text-black">{s.k}</div>
              <div className="text-[11px] font-medium text-neutral-600 uppercase tracking-[0.025em]">{s.v}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 3. VERTICAL INTEGRATION ── */}
      <section className="mx-auto max-w-[1440px] px-4 md:px-8 my-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 order-2 lg:order-1 aspect-[4/3] bg-[#f0efe7] overflow-hidden">
            <img src={loom} alt="Weaving & knitting process" className="w-full h-full object-cover rounded-none" />
          </div>

          <div className="lg:col-span-6 order-1 lg:order-2 space-y-4">
            <span className="text-[10px] font-bold uppercase tracking-[0.025em] text-neutral-500">
              FROM YARN TO FINISHED GARMENT
            </span>
            <h2 className="favorit-display text-[30px] font-normal leading-tight text-black">
              Unfiltered Quality & Monochrome Precision.
            </h2>
            <p className="text-[13px] text-neutral-600 font-normal leading-relaxed">
              Knitting, dyeing (ZLD-certified eco plant), cutting, precision stitching, printing, and AQL quality inspections are executed strictly in-house at our Tirupur facility.
            </p>
            <p className="text-[13px] text-neutral-600 font-normal leading-relaxed">
              This vertical integration ensures direct factory pricing, strict color fastness, and reliable delivery windows for bulk orders.
            </p>
          </div>
        </div>
      </section>

      {/* ── 4. CERTIFICATIONS & STANDARDS ── */}
      <section className="mx-auto max-w-[1440px] px-4 md:px-8 my-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <span className="text-[10px] font-bold uppercase tracking-[0.025em] text-neutral-500">
              AUDIT & ACCREDITATION
            </span>
            <h2 className="favorit-display text-[30px] font-normal text-black">
              Global Compliance & OEKO-TEX Standards.
            </h2>
            <ul className="space-y-3 text-[12px] text-neutral-700">
              {[
                "OEKO-TEX Standard 100 Certified dye & yarn materials",
                "Global Organic Textile Standard (GOTS) compliance",
                "SEDEX SMETA 4-pillar social accountability audit",
                "AQL 2.5 quality inspection on every shipment batch",
                "ISO 9001:2015 quality management system",
                "Zero Liquid Discharge (ZLD) eco-friendly dyeing plant",
              ].map((t) => (
                <li key={t} className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-black shrink-0 mt-0.5" />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-6 aspect-[4/3] bg-[#f0efe7] overflow-hidden">
            <img src={yarn} alt="Certified textile yarn rolls" className="w-full h-full object-cover rounded-none" />
          </div>
        </div>
      </section>

      {/* ── 5. BOTTOM EDITORIAL CALLOUT ── */}
      <section className="bg-[#f5ebd5] py-16 px-4 md:px-8 mt-20 border-t border-black text-center">
        <div className="mx-auto max-w-[800px] space-y-4">
          <h2 className="favorit-display text-[30px] font-normal text-black">
            Ready to initiate a custom production batch?
          </h2>
          <p className="text-[13px] text-neutral-700 max-w-xl mx-auto">
            Share your garment tech packs, fabric preferences, or order volumes for a 48-hour mill quote.
          </p>
          <div className="pt-4 flex justify-center gap-4">
            <Link to="/wholesale" className="btn-filled-add py-3 px-8 text-[12px]">
              GET WHOLESALE QUOTE
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
