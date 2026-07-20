import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowLeft,
  Check,
  Package,
  Heart,
  Download,
  MessageCircle,
  ShieldCheck,
  FileText,
  Layers,
  Clock,
  X,
  Send,
  CheckCircle2,
  Zap,
  ZoomIn,
  Play,
  RotateCw,
  Award,
  Sparkles,
  Printer,
  ChevronRight,
} from "lucide-react";
import { getAllProducts, getProduct } from "@/lib/products";
import { formatINR } from "@/lib/cart";
import { ProductCard } from "@/components/product-card";
import { toast } from "sonner";

const FALLBACK_MAIN = "";
const FALLBACK_FABRIC = "";

export const Route = createFileRoute("/products/$slug")({
  loader: ({ params }) => {
    const product = getProduct(params.slug);
    if (!product) throw notFound();
    return { product };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: loaderData ? `${loaderData.product.name} — B2B Specs & Wholesale | KANISHKA GARMENTS` : "Product Details" },
      { name: "description", content: loaderData?.product.shortDescription ?? "" },
    ],
  }),
  component: ProductDetail,
  notFoundComponent: () => (
    <div className="mx-auto max-w-[1440px] px-6 py-24 text-center font-favorit">
      <h1 className="text-[30px] font-normal text-black">PRODUCT NOT FOUND</h1>
      <Link to="/products" className="btn-ghost-cta mt-6 inline-block">RETURN TO CATALOGUE</Link>
    </div>
  ),
});

function ProductDetail() {
  const { product } = Route.useLoaderData();
  
  // Gallery & Media States
  const [activeImage, setActiveImage] = useState<string>(product.image || FALLBACK_MAIN);
  const [selectedColor, setSelectedColor] = useState<string>(product.colors[0]);
  const [selectedSize, setSelectedSize] = useState<string | undefined>(product.sizes?.[0]);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [activeTab, setActiveTab] = useState<"specs" | "oem" | "commercial" | "compliance">("specs");

  // Modal States
  const [showRfqModal, setShowRfqModal] = useState(false);
  const [rfqSubmitted, setRfqSubmitted] = useState(false);
  const [showFabricZoomModal, setShowFabricZoomModal] = useState(false);
  const [show3dModal, setShow3dModal] = useState(false);
  const [is3dRotating, setIs3dRotating] = useState(false);
  const [currentAngle, setCurrentAngle] = useState(0);

  // RFQ Form State
  const [rfqForm, setRfqForm] = useState({
    quantity: `500 ${product.unit}s`,
    destination: "United States",
    deliveryDate: "2026-08-30",
    email: "",
    phone: "",
    notes: "",
    fileName: "",
  });

  const related = getAllProducts()
    .filter((p) => p.category === product.category && p.slug !== product.slug)
    .slice(0, 4);

  const swatches = product.colorSwatches && product.colorSwatches.length > 0 
    ? product.colorSwatches 
    : product.colors.map((c) => ({ name: c, hex: "#1A1A1A" }));

  const galleryList = product.galleryImages && product.galleryImages.length > 0
    ? product.galleryImages
    : [product.image || FALLBACK_MAIN];

  const handleDownloadSpecSheet = () => {
    toast.success(`Preparing Spec Sheet for ${product.name}...`);

    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      window.print();
      return;
    }

    const tiersHtml = product.pricingTiers && product.pricingTiers.length > 0
      ? `
        <div style="margin-top: 20px;">
          <div style="font-size: 13px; font-weight: bold; text-transform: uppercase; border-bottom: 2px solid #000; padding-bottom: 4px; margin-bottom: 8px;">Dynamic Volume Wholesale Pricing</div>
          <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
            <thead>
              <tr style="background: #000; color: #fff;">
                <th style="padding: 8px 12px; text-align: left;">Quantity Tier</th>
                <th style="padding: 8px 12px; text-align: right;">Wholesale Price (Ex-Mill)</th>
              </tr>
            </thead>
            <tbody>
              ${product.pricingTiers.map(t => `
                <tr style="border-bottom: 1px solid #eee;">
                  <td style="padding: 8px 12px; font-weight: 500;">${t.tier}</td>
                  <td style="padding: 8px 12px; text-align: right; font-weight: bold; color: #000;">₹${t.price} / ${product.unit}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      `
      : '';

    const certsHtml = product.certifications && product.certifications.length > 0
      ? product.certifications.map(c => `<span style="display: inline-block; background: #f0efe7; border: 1px solid #000; padding: 4px 10px; font-size: 10px; margin-right: 6px; margin-bottom: 6px; font-weight: bold; text-transform: uppercase;">${c}</span>`).join('')
      : '';

    const customOptionsHtml = product.customizationOptions && product.customizationOptions.length > 0
      ? product.customizationOptions.map(opt => `<li style="margin-bottom: 4px; color: #333;">${opt}</li>`).join('')
      : '';

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>${product.name} — B2B Technical Spec Sheet | KANISHKA GARMENTS</title>
          <style>
            @media print {
              body { margin: 0; padding: 15mm; }
              .no-print { display: none !important; }
              @page { size: A4 portrait; margin: 10mm; }
            }
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; padding: 35px; color: #111; max-width: 820px; margin: 0 auto; background: #fff; }
            .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 3px solid #000; padding-bottom: 15px; margin-bottom: 20px; }
            .logo { font-size: 24px; font-weight: 900; letter-spacing: 1.5px; text-transform: uppercase; }
            .sub-logo { font-size: 10px; color: #666; font-weight: bold; margin-top: 3px; letter-spacing: 0.5px; }
            .doc-title { text-align: right; font-size: 12px; font-weight: bold; text-transform: uppercase; color: #333; }
            .product-header { display: flex; gap: 24px; margin-bottom: 25px; align-items: flex-start; }
            .product-img { width: 200px; height: 240px; object-fit: cover; border: 1px solid #000; flex-shrink: 0; }
            .product-info { flex-grow: 1; }
            .product-title { font-size: 24px; font-weight: 800; margin: 0 0 6px 0; text-transform: uppercase; letter-spacing: -0.5px; }
            .price-tag { font-size: 22px; font-weight: 900; color: #000; margin-bottom: 12px; }
            .spec-table { width: 100%; border-collapse: collapse; font-size: 12px; margin-top: 15px; border: 1px solid #000; }
            .spec-table th, .spec-table td { padding: 9px 14px; border: 1px solid #ddd; text-align: left; }
            .spec-table th { background-color: #f0efe7; font-weight: 700; width: 35%; color: #000; text-transform: uppercase; font-size: 11px; }
            .section-title { font-size: 13px; font-weight: 800; text-transform: uppercase; border-bottom: 2px solid #000; padding-bottom: 4px; margin-top: 25px; margin-bottom: 12px; letter-spacing: 0.5px; }
            .footer { margin-top: 40px; border-top: 2px solid #000; padding-top: 15px; font-size: 10px; color: #555; display: flex; justify-content: space-between; }
            .btn-print { background: #000; color: #fff; border: none; padding: 10px 20px; font-size: 12px; font-weight: bold; cursor: pointer; text-transform: uppercase; margin-bottom: 20px; }
          </style>
        </head>
        <body>
          <div class="no-print" style="text-align: right;">
            <button onclick="window.print()" class="btn-print">🖨️ PRINT / SAVE AS PDF</button>
          </div>

          <div class="header">
            <div>
              <div class="logo">KANISHKA GARMENTS</div>
              <div class="sub-logo">TIRUPPUR TEXTILE MANUFACTURING & EXPORTS (ISO 9001 / AQL 2.5)</div>
            </div>
            <div class="doc-title">
              TECHNICAL SPEC SHEET<br>
              <span style="font-size: 10px; color: #777;">REF: #KG-SPEC-${product.slug.toUpperCase()}</span>
            </div>
          </div>

          <div class="product-header">
            <img src="${product.image}" class="product-img" alt="${product.name}" />
            <div class="product-info">
              <div class="product-title">${product.name}</div>
              <div class="price-tag">₹${product.wholesalePrice} / ${product.unit.toUpperCase()} <span style="font-size: 11px; font-weight: normal; color: #666;">(EX-MILL TIRUPUR)</span></div>
              <p style="font-size: 12px; line-height: 1.5; color: #333; margin-bottom: 14px;">${product.description}</p>
              
              <div style="font-size: 11px; background: #f0efe7; padding: 12px; border: 1px solid #000;">
                <strong>MINIMUM ORDER (MOQ):</strong> ${product.moq} ${product.unit.toUpperCase()}S / COLOR<br>
                <strong>PRODUCTION LEAD TIME:</strong> ${product.leadTime}<br>
                <strong>CATEGORY:</strong> ${product.categoryLabel.toUpperCase()}
              </div>
            </div>
          </div>

          <div class="section-title">Technical Specifications & Fabric Parameters</div>
          <table class="spec-table">
            <tr><th>Fabric Composition</th><td><strong>${product.composition}</strong></td></tr>
            ${product.gsm ? `<tr><th>Fabric Weight (GSM)</th><td>${product.gsm}</td></tr>` : ''}
            ${product.yarnCount ? `<tr><th>Yarn Count & Type</th><td>${product.yarnCount}</td></tr>` : ''}
            ${product.dyeingFinishing ? `<tr><th>Dyeing & Finishing</th><td>${product.dyeingFinishing}</td></tr>` : ''}
            ${product.printingCompatibility ? `<tr><th>Printing & Embroidery</th><td>${product.printingCompatibility}</td></tr>` : ''}
            ${product.qualityParameters ? `<tr><th>Quality Standard</th><td>${product.qualityParameters}</td></tr>` : ''}
            ${product.colors ? `<tr><th>Available Stock Colors</th><td>${product.colors.join(', ')}</td></tr>` : ''}
            ${product.sizes ? `<tr><th>Available Sizes</th><td>${product.sizes.join(', ')}</td></tr>` : ''}
          </table>

          ${tiersHtml}

          ${customOptionsHtml ? `
            <div class="section-title">White-Label & OEM Customization Options</div>
            <ul style="font-size: 12px; line-height: 1.6; padding-left: 20px; margin-top: 5px;">
              ${customOptionsHtml}
            </ul>
          ` : ''}

          ${certsHtml ? `
            <div class="section-title">Factory Certifications & Quality Control</div>
            <div>${certsHtml}</div>
          ` : ''}

          <div class="footer">
            <div>KANISHKA GARMENTS · Tirupur, Tamil Nadu, India · Direct Sales: +91 421 420 4200</div>
            <div>Official Buyer Spec Sheet · Generated ${new Date().toLocaleDateString()}</div>
          </div>

          <script>
            window.onload = function() {
              setTimeout(function() {
                window.print();
              }, 400);
            };
          </script>
        </body>
      </html>
    `;

    printWindow.document.open();
    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  const handleRfqSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRfqSubmitted(true);
    setTimeout(() => {
      setShowRfqModal(false);
      setRfqSubmitted(false);
    }, 2500);
  };

  return (
    <div className="bg-white font-favorit text-black py-8 md:py-14">
      <div className="mx-auto max-w-[1440px] px-4 md:px-8">
        
        {/* ── BREADCRUMB & MILL SPEC REVISION HEADER ── */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-neutral-200 text-[11px] text-neutral-500">
          <Link
            to="/products"
            className="inline-flex items-center gap-2 font-medium text-black hover:opacity-60 transition-opacity uppercase"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> BACK TO WHOLESALE CATALOGUE
          </Link>
          <div className="flex items-center gap-4 hidden sm:flex">
            <span className="bg-[#f0efe7] text-black px-2.5 py-0.5 font-bold uppercase tracking-wider text-[10px]">
              TIRUPPUR MILL SPEC B2B-2026
            </span>
            <span className="text-neutral-400">|</span>
            <span>AQL 2.5 CERTIFIED PROCESS</span>
          </div>
        </div>

        {/* ── REQUIREMENT 1 & 7: HIGH-IMPACT VISUALS GALLERY & CORE SPECS GRID ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          
          {/* Left Column: High-Impact Visual Gallery (7 Columns) */}
          <div className="lg:col-span-7 space-y-4">
            
            {/* Main Featured Photo Display */}
            <div className="relative aspect-[4/5] bg-[#f0efe7] overflow-hidden border border-black/10 group">
              <img
                src={activeImage}
                alt={product.name}
                className="w-full h-full object-cover rounded-none transition-all duration-300"
                onError={(e) => { e.currentTarget.src = product.image; }}
              />

              {/* Top Action Floating Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
                {product.badge && (
                  <span className="bg-black text-white text-[9px] font-bold px-2.5 py-1 uppercase tracking-[0.05em] shadow-sm">
                    {product.badge}
                  </span>
                )}
                {product.gsm && (
                  <span className="bg-white/90 backdrop-blur-sm text-black border border-black/20 text-[9px] font-bold px-2.5 py-1 uppercase tracking-[0.05em]">
                    {product.gsm}
                  </span>
                )}
              </div>


              {/* Interactive Media Overlay Badges (Requirement 1: Texture & 3D Drape Viewer) */}
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between gap-2 z-10">
                {/* 1. Zoom Fabric Texture Button */}
                <button
                  onClick={() => setShowFabricZoomModal(true)}
                  className="bg-black/90 backdrop-blur-sm hover:bg-black text-white px-3.5 py-2 text-[10px] font-bold tracking-[0.05em] uppercase flex items-center gap-2 cursor-pointer transition-all border border-white/20"
                >
                  <ZoomIn className="w-3.5 h-3.5 text-white" /> FABRIC WEAVE CLOSE-UP (ZOOM)
                </button>

                {/* 2. 360° Drape Fit Video Preview Button */}
                <button
                  onClick={() => setShow3dModal(true)}
                  className="bg-white/95 backdrop-blur-sm hover:bg-white text-black px-3.5 py-2 text-[10px] font-bold tracking-[0.05em] uppercase flex items-center gap-2 cursor-pointer transition-all border border-black/20 shadow-sm"
                >
                  <Play className="w-3.5 h-3.5 fill-black text-black" /> 360° DRAPE & MOVEMENT
                </button>
              </div>
            </div>

            {/* Thumbnails Row: Multi-Angle High-Res Photos & Stitching Details */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[11px] text-neutral-500 font-medium">
                <span>MULTI-ANGLE SHOTS & TRIMS DETAIL</span>
                <span>{galleryList.length} VIEWS AVAILABLE</span>
              </div>
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
                {galleryList.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(imgUrl)}
                    className={`relative w-20 aspect-square shrink-0 overflow-hidden border-2 cursor-pointer transition-all ${
                      activeImage === imgUrl ? "border-black scale-105" : "border-neutral-200 hover:border-black opacity-80 hover:opacity-100"
                    }`}
                  >
                    <img src={imgUrl} alt={`Angle ${idx + 1}`} className="w-full h-full object-cover" />
                    <span className="absolute bottom-1 right-1 text-[8px] font-bold bg-black/70 text-white px-1 py-0.2">
                      #{idx + 1}
                    </span>
                  </button>
                ))}

                {/* Direct Fabric Weave Thumbnail Trigger */}
                <button
                  onClick={() => setShowFabricZoomModal(true)}
                  className="relative w-20 aspect-square shrink-0 overflow-hidden border-2 border-dashed border-black bg-[#f0efe7] flex flex-col items-center justify-center p-1 text-center cursor-pointer hover:bg-neutral-200 transition-colors"
                >
                  <ZoomIn className="w-4 h-4 text-black mb-1" />
                  <span className="text-[8px] font-bold uppercase leading-none">WEAVE ZOOM</span>
                </button>
              </div>
            </div>

            {/* Quick Fabric Guarantee Alert */}
            <div className="bg-[#f0efe7] border border-black/20 p-4 text-[12px] flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-black shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-black uppercase text-[11px] block">
                  TIRUPPUR MILL QUALITY GUARANTEE
                </span>
                <p className="text-neutral-600 text-[11px] mt-0.5 leading-relaxed">
                  Every batch undergoes 100% bio-wash treatment, pre-shrunk anti-torquing processing (shrinkage &lt;3%), and ISO Grade 4+ color fastness inspection prior to dispatch.
                </p>
              </div>
            </div>

          </div>

          {/* Right Column: Core Specs & Action-Oriented B2B CTAs (5 Columns) */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24 font-favorit">
            
            {/* Header info */}
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-[10px] font-bold uppercase tracking-[0.05em] text-neutral-500">
                  {product.categoryLabel} {product.subType ? `· ${product.subType.toUpperCase()}` : ""}
                </span>
                <span className="text-[10px] bg-neutral-100 text-neutral-700 px-2 py-0.5 font-bold uppercase">
                  {product.isReadymade ? "READYMADE APPAREL" : "RAW KNITTED FABRIC"}
                </span>
              </div>

              <h1 className="favorit-display text-[30px] font-normal leading-tight text-black">
                {product.name}
              </h1>

              {/* Pricing Display */}
              <div className="mt-3 flex items-baseline gap-3">
                <span className="text-[26px] font-bold text-black">
                  {formatINR(product.wholesalePrice)}
                </span>
                <span className="text-[12px] text-neutral-500 font-normal">
                  / {product.unit.toUpperCase()} (EX-MILL TIRUPUR)
                </span>
              </div>
            </div>

            <p className="text-[13px] text-neutral-600 font-normal leading-relaxed border-t border-neutral-200 pt-4">
              {product.description}
            </p>

            {/* REQUIREMENT 3: DYNAMIC VOLUME WHOLESALE PRICING TIERS TABLE */}
            {product.pricingTiers && product.pricingTiers.length > 0 && (
              <div className="border border-black p-4 bg-[#f0efe7] space-y-3">
                <div className="flex items-center justify-between border-b border-black pb-2">
                  <span className="font-bold text-[11px] uppercase tracking-[0.05em] text-black flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-black" /> DYNAMIC VOLUME WHOLESALE PRICING
                  </span>
                  <span className="text-[10px] text-neutral-500 font-bold uppercase">EX-FACTORY TIRUPUR</span>
                </div>
                <div className="divide-y divide-black/10 text-[12px]">
                  {product.pricingTiers.map((tier, i) => (
                    <div key={tier.tier} className={`flex justify-between items-center py-2 ${i === 0 ? "font-bold text-black" : "text-neutral-700"}`}>
                      <span className="font-medium">{tier.tier}</span>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-black">{formatINR(tier.price)}</span>
                        <span className="text-[10px] text-neutral-500">/ {product.unit}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-[10px] text-neutral-500 italic pt-1">
                  * Bulk discounts applied automatically at quote generation for orders over 5,000 pcs.
                </p>
              </div>
            )}

            {/* REQUIREMENT 4: COLORWAY & SIZE SELECTION */}
            <div className="space-y-4 border-t border-neutral-200 pt-4">
              
              {/* Stock Colors Swatch Selector */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[12px]">
                  <span className="font-bold uppercase tracking-[0.025em]">STOCK COLORWAY:</span>
                  <span className="text-neutral-600 font-medium">{selectedColor}</span>
                </div>
                <div className="flex flex-wrap gap-2.5 pt-1">
                  {swatches.map((sw) => (
                    <button
                      key={sw.name}
                      onClick={() => setSelectedColor(sw.name)}
                      title={sw.name}
                      className={`w-7 h-7 rounded-none cursor-pointer transition-transform relative ${
                        selectedColor === sw.name ? "border-2 border-black scale-110 shadow-sm" : "border border-neutral-300 hover:border-black"
                      }`}
                      style={{ backgroundColor: sw.hex }}
                    >
                      {selectedColor === sw.name && (
                        <span className={`absolute inset-0 flex items-center justify-center ${sw.hex === "#FFFFFF" || sw.hex === "#FFF2B2" ? "text-black" : "text-white"}`}>
                          <Check className="w-3 h-3 stroke-[3]" />
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Size Ratio Picker */}
              {product.sizes && product.sizes.length > 0 && (
                <div className="space-y-2 pt-2">
                  <div className="flex items-center justify-between text-[12px]">
                    <span className="font-bold uppercase tracking-[0.025em]">SIZE RATIO / SPECS:</span>
                    <span className="text-neutral-600 font-medium">{selectedSize}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((sz) => (
                      <button
                        key={sz}
                        onClick={() => setSelectedSize(sz)}
                        className={`px-3.5 py-1.5 text-[11px] font-medium transition-colors cursor-pointer ${
                          selectedSize === sz
                            ? "bg-black text-white rounded-none shadow-sm"
                            : "bg-white text-black border border-neutral-300 hover:border-black"
                        }`}
                      >
                        {sz}
                      </button>
                    ))}
                  </div>
                </div>
              )}

            </div>

            {/* REQUIREMENT 3: MOQ & SAMPLE POLICY QUICK SUMMARY BOX */}
            <div className="bg-white border border-black p-4 text-[12px] space-y-2.5">
              <div className="flex items-center justify-between border-b border-neutral-200 pb-2">
                <span className="font-bold uppercase text-black">MINIMUM ORDER (MOQ):</span>
                <span className="font-bold text-black bg-black text-white px-2 py-0.5 text-[11px]">
                  {product.moq} {product.unit.toUpperCase()}S / COLOR
                </span>
              </div>
              <div className="flex items-center justify-between text-neutral-600 text-[11px]">
                <span className="font-medium">PRODUCTION LEAD TIME:</span>
                <span className="font-bold text-black">{product.leadTime}</span>
              </div>
              <div className="flex items-center justify-between text-neutral-600 text-[11px]">
                <span className="font-medium">SAMPLE DISPATCH:</span>
                <span className="font-bold text-black">3–5 DAYS (REFUNDABLE)</span>
              </div>
              {product.vendors && (
                <div className="text-[11px] text-neutral-600 border-t border-neutral-100 pt-2">
                  <span className="font-bold text-black block mb-0.5">PRIMARY MILL VENDORS:</span>
                  <span>{product.vendors}</span>
                </div>
              )}
            </div>

            {/* ── REQUIREMENT 6: ACTION-ORIENTED B2B CTAS ── */}
            <div className="space-y-3 pt-2">
              
              {/* CTA 1: Request Bulk Quote (RFQ) Form Modal Trigger */}
              <button
                onClick={() => setShowRfqModal(true)}
                className="btn-filled-add w-full py-4 text-[12px] font-bold uppercase tracking-[0.05em] flex items-center justify-center gap-2 shadow-sm cursor-pointer"
              >
                <FileText className="w-4 h-4" /> REQUEST BULK QUOTE (RFQ)
              </button>

              {/* CTA 2: Order Sample Kit Button */}
              <Link
                to="/wholesale"
                className="btn-ghost-cta w-full text-center py-3 text-[12px] font-bold uppercase tracking-[0.05em] flex items-center justify-center gap-2 cursor-pointer"
              >
                <Package className="w-4 h-4" /> ORDER SAMPLE KIT (3–5 DAYS DISPATCH)
              </Link>

              {/* CTA 3: Instant WhatsApp / Live Chat */}
              <a
                href={`https://wa.me/914214204200?text=${encodeURIComponent(
                  `Hello Kanishka Garments, I would like to request a wholesale quote for ${product.name} (GSM: ${product.gsm || "Standard"}, MOQ: ${product.moq} ${product.unit}s).`
                )}`}
                target="_blank"
                rel="noreferrer"
                className="w-full py-3 border border-black text-center text-[12px] font-bold uppercase tracking-[0.05em] bg-[#f0efe7] text-black hover:bg-black hover:text-white transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 text-emerald-600 group-hover:text-white" /> INSTANT WHATSAPP / LIVE CHAT (+91 421 420 4200)
              </a>

              {/* CTA 4: Download Spec Sheet (PDF) */}
              <button
                onClick={handleDownloadSpecSheet}
                className="w-full py-2.5 text-center text-[11px] font-medium text-neutral-600 hover:text-black transition-colors flex items-center justify-center gap-2 cursor-pointer border border-transparent hover:border-black/20"
              >
                <Printer className="w-3.5 h-3.5 text-black" /> EXPORT TECHNICAL SPEC SHEET (PDF)
              </button>

            </div>

          </div>
        </div>

        {/* ── REQUIREMENT 2, 4, 5, 7: RECOMMENDED 4-TAB WIREFRAME STRUCTURE ── */}
        <div className="mt-20 border-t border-black pt-12">
          
          <div className="mb-4 flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-[0.05em] text-neutral-500">
              DETAILED MANUFACTURING DOCUMENTATION
            </span>
            <span className="text-[10px] text-neutral-400 hidden md:inline">
              CLICK TABS TO EXPLORE MILL SPECIFICATIONS & OEM CUSTOMIZATION
            </span>
          </div>

          {/* Tab Navigation Bar */}
          <div className="flex items-center gap-2 border-b border-black overflow-x-auto scrollbar-none pb-px bg-white">
            {[
              { id: "specs" as const, label: "1. TECHNICAL SPECIFICATIONS", icon: Layers },
              { id: "oem" as const, label: "2. CUSTOMIZATION & OEM / ODM", icon: FileText },
              { id: "commercial" as const, label: "3. COMMERCIAL TERMS & LOGISTICS", icon: Clock },
              { id: "compliance" as const, label: "4. CERTIFICATIONS & QUALITY CONTROL", icon: ShieldCheck },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3.5 text-[12px] font-bold uppercase whitespace-nowrap tracking-[0.025em] flex items-center gap-2 cursor-pointer transition-colors ${
                  activeTab === tab.id
                    ? "bg-black text-white rounded-none"
                    : "bg-[#f0efe7] text-neutral-700 hover:text-black hover:bg-neutral-200"
                }`}
              >
                <tab.icon className="w-4 h-4" /> {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content Panes */}
          <div className="py-8 bg-[#f0efe7] p-6 md:p-10 border border-t-0 border-black font-favorit">
            
            {/* ── TAB 1: Detailed Specifications (Requirement 2 Table) ── */}
            {activeTab === "specs" && (
              <div className="space-y-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-black/20 pb-4">
                  <div>
                    <h3 className="text-[18px] font-bold uppercase text-black tracking-[0.025em]">
                      CORE TEXTILE & FABRIC SPECIFICATIONS
                    </h3>
                    <p className="text-[12px] text-neutral-600 mt-0.5">
                      Comprehensive mill technical metrics evaluated for export quality & brand production.
                    </p>
                  </div>
                  <span className="bg-black text-white text-[10px] font-bold px-3 py-1 uppercase tracking-wider self-start md:self-auto">
                    TIRUPPUR MILL STANDARD
                  </span>
                </div>

                {/* Requirement 2 Table */}
                <div className="overflow-x-auto border border-black bg-white">
                  <table className="w-full text-left text-[12px] border-collapse">
                    <thead>
                      <tr className="bg-black text-white text-[11px] font-bold uppercase tracking-wider">
                        <th className="py-3.5 px-4 border-r border-neutral-700 w-1/4">Parameter</th>
                        <th className="py-3.5 px-4 border-r border-neutral-700 w-2/5">Specification Details</th>
                        <th className="py-3.5 px-4 w-1/3">Mill Benchmark / Standard</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-200">
                      <tr>
                        <td className="py-3.5 px-4 font-bold text-black border-r border-neutral-200 bg-neutral-50">Fabric Composition</td>
                        <td className="py-3.5 px-4 font-medium text-black border-r border-neutral-200">{product.composition}</td>
                        <td className="py-3.5 px-4 text-neutral-600">100% Combed Cotton, Poly-Cotton, Organic Cotton, Bamboo Blends</td>
                      </tr>
                      {product.gsm && (
                        <tr>
                          <td className="py-3.5 px-4 font-bold text-black border-r border-neutral-200 bg-neutral-50">Fabric Weight (GSM)</td>
                          <td className="py-3.5 px-4 font-medium text-black border-r border-neutral-200">{product.gsm}</td>
                          <td className="py-3.5 px-4 text-neutral-600">140 GSM to 340 GSM Heavyweight Knits</td>
                        </tr>
                      )}
                      {product.yarnCount && (
                        <tr>
                          <td className="py-3.5 px-4 font-bold text-black border-r border-neutral-200 bg-neutral-50">Yarn Count & Type</td>
                          <td className="py-3.5 px-4 font-medium text-black border-r border-neutral-200">{product.yarnCount}</td>
                          <td className="py-3.5 px-4 text-neutral-600">30s Super Combed, 24s Carded, 20s Compact Yarn</td>
                        </tr>
                      )}
                      {product.dyeingFinishing && (
                        <tr>
                          <td className="py-3.5 px-4 font-bold text-black border-r border-neutral-200 bg-neutral-50">Dyeing & Finishing</td>
                          <td className="py-3.5 px-4 font-medium text-black border-r border-neutral-200">{product.dyeingFinishing}</td>
                          <td className="py-3.5 px-4 text-neutral-600">Bio-washed, Silicon-washed, Softener, Reactive Dyes</td>
                        </tr>
                      )}
                      {product.printingCompatibility && (
                        <tr>
                          <td className="py-3.5 px-4 font-bold text-black border-r border-neutral-200 bg-neutral-50">Printing & Decor</td>
                          <td className="py-3.5 px-4 font-medium text-black border-r border-neutral-200">{product.printingCompatibility}</td>
                          <td className="py-3.5 px-4 text-neutral-600">Screen Print, DTG, Puff Print, HD Print, High-density Embroidery</td>
                        </tr>
                      )}
                      {product.qualityParameters && (
                        <tr>
                          <td className="py-3.5 px-4 font-bold text-black border-r border-neutral-200 bg-neutral-50">Quality Parameters</td>
                          <td className="py-3.5 px-4 font-medium text-black border-r border-neutral-200">{product.qualityParameters}</td>
                          <td className="py-3.5 px-4 text-neutral-600">Pre-shrunk (&lt;3%), ISO Grade 4+ Color Fastness</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Multi-angle & Stitching Visual Spec Card */}
                {galleryList.length > 1 && (
                  <div className="bg-white border border-black p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-[14px] uppercase text-black flex items-center gap-2">
                        <Layers className="w-4 h-4 text-black" /> MULTI-ANGLE & STITCHING SPECIFICATION DIAGRAM
                      </h4>
                      <span className="text-[10px] font-bold bg-black text-white px-2 py-0.5 uppercase">
                        FULL TECH PACK VIEWER
                      </span>
                    </div>
                    <div className="border border-neutral-200 bg-neutral-50 overflow-hidden">
                      <img
                        src={galleryList[1]}
                        alt={`${product.name} specification diagram`}
                        className="w-full h-auto object-contain cursor-pointer hover:scale-[1.01] transition-transform"
                        onClick={() => setActiveImage(galleryList[1])}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ── TAB 2: Customization & OEM / ODM Options (Requirement 4) ── */}
            {activeTab === "oem" && (
              <div className="space-y-8">
                <div className="border-b border-black/20 pb-4">
                  <h3 className="text-[18px] font-bold uppercase text-black tracking-[0.025em]">
                    WHITE-LABEL & OEM / ODM CUSTOMIZATION OPTIONS
                  </h3>
                  <p className="text-[12px] text-neutral-600 mt-0.5">
                    Demonstrating how this base product can be fully modified for private labeling & brand launches.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-[12px]">
                  <div className="bg-white p-6 border border-black/10 space-y-3">
                    <div className="flex items-center gap-2 text-black font-bold uppercase text-[13px]">
                      <FileText className="w-4 h-4 text-black" /> CUSTOM BRAND TAGGING & LABELS
                    </div>
                    <p className="text-neutral-600 leading-relaxed">
                      Custom woven neck labels, satin wash care labels, heat-seal tagless size transfers, and custom printed cardstock hangtags with safety pin or cord fasteners.
                    </p>
                    <div className="flex flex-wrap gap-2 pt-1">
                      {["Woven Neck Tag", "Care Label", "Heat Press Tagless", "Hangtag"].map((t) => (
                        <span key={t} className="bg-[#f0efe7] text-black text-[10px] font-bold px-2 py-0.5 border border-black/10">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white p-6 border border-black/10 space-y-3">
                    <div className="flex items-center gap-2 text-black font-bold uppercase text-[13px]">
                      <Sparkles className="w-4 h-4 text-black" /> CUSTOM COLORS & PANTONE MATCHING
                    </div>
                    <p className="text-neutral-600 leading-relaxed">
                      Full support for customized TPX/TCX Pantone matching alongside stock color options. Standard 48-hour lab-dip swatch approval turnaround before bulk dyeing.
                    </p>
                    <div className="flex items-center gap-2 pt-1 text-[11px] font-bold text-black">
                      <span className="w-3 h-3 rounded-full bg-rose-500 inline-block" />
                      <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
                      <span className="w-3 h-3 rounded-full bg-amber-500 inline-block" />
                      <span>TPX / TCX PANTONE DYED MATCHING AVAILABLE</span>
                    </div>
                  </div>

                  <div className="bg-white p-6 border border-black/10 space-y-3">
                    <div className="flex items-center gap-2 text-black font-bold uppercase text-[13px]">
                      <Layers className="w-4 h-4 text-black" /> SIZE RATIOS & TECH-PACK ADOPTION
                    </div>
                    <p className="text-neutral-600 leading-relaxed">
                      Standard size charts (US, UK, EU, Asian fit) plus full adoption of your custom measurement tech-pack specifications (chest width, length, shoulder drop, sleeve opening).
                    </p>
                    <span className="text-[11px] font-bold text-black block">
                      FITS: US FIT · EU FIT · ASIAN FIT · OVERSIZED DROP-SHOULDER
                    </span>
                  </div>

                  <div className="bg-white p-6 border border-black/10 space-y-3">
                    <div className="flex items-center gap-2 text-black font-bold uppercase text-[13px]">
                      <Package className="w-4 h-4 text-black" /> CUSTOM PACKAGING & BARCODING
                    </div>
                    <p className="text-neutral-600 leading-relaxed">
                      Single polybags, eco-friendly/biodegradable packaging, custom printed boxes, or flat-pack options. Includes custom barcode stickers & retail hanger prep.
                    </p>
                    <span className="text-[11px] font-bold text-black block">
                      PACKS: RECYCLED POLYBAG · ECO KRAFT BOX · FBA BARCODE READY
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* ── TAB 3: Commercial Terms & Lead Times (Requirement 3) ── */}
            {activeTab === "commercial" && (
              <div className="space-y-8 text-[12px]">
                <div className="border-b border-black/20 pb-4">
                  <h3 className="text-[18px] font-bold uppercase text-black tracking-[0.025em]">
                    COMMERCIAL GUIDELINES, SAMPLES & LOGISTICS
                  </h3>
                  <p className="text-[12px] text-neutral-600 mt-0.5">
                    Clear commercial parameters for procurement teams and international importers.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white p-6 border border-black/10 space-y-3">
                    <span className="text-[10px] font-bold uppercase text-neutral-500">MINIMUM ORDER QUANTITY</span>
                    <h4 className="font-bold text-black text-[14px]">{product.moq} {product.unit.toUpperCase()}S / COLOR</h4>
                    <p className="text-neutral-600 leading-relaxed">
                      Clear breakdown for bulk production. Custom Pantone color dyeing requires {product.moq} pcs minimum per shade.
                    </p>
                  </div>

                  <div className="bg-white p-6 border border-black/10 space-y-3">
                    <span className="text-[10px] font-bold uppercase text-neutral-500">SAMPLE POLICY & TURNAROUND</span>
                    <h4 className="font-bold text-black text-[14px]">3 TO 7 DAYS DISPATCH</h4>
                    <p className="text-neutral-600 leading-relaxed">
                      {product.samplePolicy || "Tech-pack samples provided prior to bulk production. Sample costs are 100% refunded or credited against bulk PO placement."}
                    </p>
                  </div>

                  <div className="bg-white p-6 border border-black/10 space-y-3">
                    <span className="text-[10px] font-bold uppercase text-neutral-500">PRODUCTION LEAD TIME</span>
                    <h4 className="font-bold text-black text-[14px]">{product.leadTime}</h4>
                    <p className="text-neutral-600 leading-relaxed">
                      Fast-track sampling in 3–5 days. Bulk execution delivered within 12–20 days depending on order volume and decoration type.
                    </p>
                  </div>
                </div>

                {/* Logistics & Payment Terms */}
                <div className="bg-white p-6 border border-black/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <h4 className="font-bold uppercase text-black text-[13px]">EXPORT PORTS & FREIGHT TERMS</h4>
                    <p className="text-neutral-600 mt-0.5">
                      FOB / CIF / DDP shipment via Air Freight (Tuticorin / Chennai Airport) & Sea Containers (Tirupur ICD / Tuticorin Port / Chennai Port).
                    </p>
                  </div>
                  <button
                    onClick={() => setShowRfqModal(true)}
                    className="btn-filled-add py-2.5 px-6 text-[11px] whitespace-nowrap cursor-pointer"
                  >
                    INQUIRE FREIGHT QUOTE
                  </button>
                </div>
              </div>
            )}

            {/* ── TAB 4: Factory Certifications & Quality Control (Requirement 5) ── */}
            {activeTab === "compliance" && (
              <div className="space-y-8 text-[12px]">
                <div className="border-b border-black/20 pb-4">
                  <h3 className="text-[18px] font-bold uppercase text-black tracking-[0.025em]">
                    INTERNATIONAL COMPLIANCE & QUALITY CONTROL (AQL 2.5)
                  </h3>
                  <p className="text-[12px] text-neutral-600 mt-0.5">
                    Tiruppur standard international audit certifications & defect inspection limits.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { title: "OEKO-TEX STANDARD 100", tag: "Chemical Safety", desc: "Tested and certified for harmful substances, AZO-free dyes, and skin safety." },
                    { title: "GOTS ORGANIC CERTIFIED", tag: "Eco Cotton", desc: "Global Organic Textile Standard certification for 100% organic cotton inputs." },
                    { title: "BSCI & SEDEX AUDITED", tag: "Social Compliance", desc: "Passes international ethical audit requirements, fair wages, zero child labor." },
                    { title: "AQL 2.5 QC INSPECTION", tag: "Quality Assurance", desc: "Strict ISO defect limit inspection (AQL 2.5 Level II) on 100% finished garments." },
                  ].map((cert) => (
                    <div key={cert.title} className="bg-white p-5 border border-black/10 space-y-2">
                      <div className="flex items-center justify-between">
                        <ShieldCheck className="w-5 h-5 text-black" />
                        <span className="text-[9px] font-bold uppercase bg-black text-white px-2 py-0.5">
                          {cert.tag}
                        </span>
                      </div>
                      <h4 className="font-bold text-black text-[12px] pt-1">{cert.title}</h4>
                      <p className="text-[11px] text-neutral-600 leading-relaxed">{cert.desc}</p>
                    </div>
                  ))}
                </div>

                {/* Quality Control Process Diagram Card */}
                <div className="bg-white p-6 border border-black/10 space-y-4">
                  <h4 className="font-bold uppercase text-black text-[13px] flex items-center gap-2">
                    <Award className="w-4 h-4 text-black" /> 5-STAGE TIRUPPUR QC INSPECTION PIPELINE
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 text-[11px] text-center">
                    {[
                      { step: "1. YARN & FABRIC", desc: "GSM & Spirality check" },
                      { step: "2. LAB-DIP DYEING", desc: "Pantone color matching" },
                      { step: "3. PRINT & EMB", desc: "Adhesion & wash test" },
                      { step: "4. IN-LINE SEWING", desc: "Stitching & seam tension" },
                      { step: "5. FINAL PACK", desc: "AQL 2.5 final audit" },
                    ].map((s) => (
                      <div key={s.step} className="bg-[#f0efe7] p-3 border border-black/10">
                        <span className="font-bold text-black block">{s.step}</span>
                        <span className="text-neutral-600 text-[10px]">{s.desc}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>

        {/* ── SECTION: DOWNLOAD TECH PACK SHEET CTA (Requirement 7) ── */}
        <div className="mt-16 bg-[#f0efe7] p-8 md:p-10 border border-black flex flex-col md:flex-row items-center justify-between gap-6 font-favorit">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <FileText className="w-4 h-4 text-black" />
              <span className="text-[10px] font-bold uppercase tracking-[0.05em] text-neutral-600">
                OFFICIAL BUYER DOCUMENTATION
              </span>
            </div>
            <h3 className="text-[20px] font-bold text-black uppercase">
              DOWNLOAD TECHNICAL SPEC SHEET (PDF)
            </h3>
            <p className="text-[12px] text-neutral-600 mt-1 max-w-xl">
              Export a complete printable spec sheet containing fabric composition, yarn counts, volume pricing tiers, and mill certifications for internal procurement review.
            </p>
          </div>
          <button
            onClick={handleDownloadSpecSheet}
            className="btn-filled-add py-3 px-8 text-[12px] font-bold uppercase tracking-[0.05em] flex items-center gap-2 whitespace-nowrap cursor-pointer shadow-sm"
          >
            <Download className="w-4 h-4" /> EXPORT PDF SPEC SHEET
          </button>
        </div>

        {/* ── SECTION: RELATED / RECOMMENDED APPAREL STYLES (Requirement 7) ── */}
        {related.length > 0 && (
          <div className="mt-24 border-t border-neutral-200 pt-12">
            <div className="flex items-center justify-between mb-8">
              <h3 className="favorit-heading text-[20px] font-bold text-black uppercase">
                RECOMMENDED APPAREL STYLES FROM TIRUPPUR
              </h3>
              <Link to="/products" className="text-[12px] font-bold text-black hover:opacity-60 flex items-center gap-1">
                VIEW ALL PRODUCTS <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-16">
              {related.map((p) => (
                <ProductCard key={p.slug} product={p} />
              ))}
            </div>
          </div>
        )}

      </div>

      {/* ── REQUIREMENT 6: INTERACTIVE RFQ FORM MODAL POPUP ── */}
      {showRfqModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-lg bg-white border border-black p-6 md:p-8 font-favorit text-black shadow-2xl max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowRfqModal(false)}
              className="absolute top-4 right-4 text-black hover:opacity-60 cursor-pointer p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-1">
              <FileText className="w-4 h-4 text-black" />
              <span className="text-[10px] font-bold uppercase tracking-[0.05em] text-neutral-500">
                KANISHKA GARMENTS MILL RFQ
              </span>
            </div>

            <h3 className="text-[18px] font-bold uppercase tracking-[0.025em] text-black">
              REQUEST BULK QUOTE (RFQ)
            </h3>
            <p className="text-[12px] text-neutral-600 mt-1 mb-6">
              <strong className="text-black">{product.name}</strong> — Ex-Mill Tirupur Direct Quotation
            </p>

            {rfqSubmitted ? (
              <div className="py-10 text-center space-y-3 bg-[#f0efe7] border border-black p-6">
                <CheckCircle2 className="w-12 h-12 text-black mx-auto stroke-[2]" />
                <h4 className="text-[16px] font-bold uppercase text-black">RFQ SUBMITTED SUCCESSFULLY!</h4>
                <p className="text-[12px] text-neutral-600 leading-relaxed max-w-md mx-auto">
                  Quote Reference <strong className="text-black">#KG-RFQ-2026-{Math.floor(1000 + Math.random() * 9000)}</strong> generated. Our export procurement manager will email you official pricing within 24 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleRfqSubmit} className="space-y-4 text-[12px]">
                <div>
                  <label className="block font-bold uppercase text-[10px] text-neutral-700 mb-1">
                    TARGET ORDER QUANTITY *
                  </label>
                  <input
                    type="text"
                    required
                    value={rfqForm.quantity}
                    onChange={(e) => setRfqForm({ ...rfqForm, quantity: e.target.value })}
                    placeholder={`e.g. 500 ${product.unit}s`}
                    className="w-full border border-black p-2.5 outline-none text-[12px] bg-white focus:bg-neutral-50"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold uppercase text-[10px] text-neutral-700 mb-1">
                      DESTINATION COUNTRY *
                    </label>
                    <input
                      type="text"
                      required
                      value={rfqForm.destination}
                      onChange={(e) => setRfqForm({ ...rfqForm, destination: e.target.value })}
                      placeholder="e.g. United States / UK"
                      className="w-full border border-black p-2.5 outline-none text-[12px] bg-white focus:bg-neutral-50"
                    />
                  </div>
                  <div>
                    <label className="block font-bold uppercase text-[10px] text-neutral-700 mb-1">
                      TARGET DELIVERY DATE
                    </label>
                    <input
                      type="date"
                      value={rfqForm.deliveryDate}
                      onChange={(e) => setRfqForm({ ...rfqForm, deliveryDate: e.target.value })}
                      className="w-full border border-black p-2.5 outline-none text-[12px] bg-white focus:bg-neutral-50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold uppercase text-[10px] text-neutral-700 mb-1">
                    WORK EMAIL *
                  </label>
                  <input
                    type="email"
                    required
                    value={rfqForm.email}
                    onChange={(e) => setRfqForm({ ...rfqForm, email: e.target.value })}
                    placeholder="procurement@brand.com"
                    className="w-full border border-black p-2.5 outline-none text-[12px] bg-white focus:bg-neutral-50"
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase text-[10px] text-neutral-700 mb-1">
                    PHONE / WHATSAPP NUMBER
                  </label>
                  <input
                    type="tel"
                    value={rfqForm.phone}
                    onChange={(e) => setRfqForm({ ...rfqForm, phone: e.target.value })}
                    placeholder="+1 (555) 000-0000"
                    className="w-full border border-black p-2.5 outline-none text-[12px] bg-white focus:bg-neutral-50"
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase text-[10px] text-neutral-700 mb-1">
                    CUSTOMIZATION & TECH PACK SPECIFICATIONS
                  </label>
                  <textarea
                    rows={3}
                    value={rfqForm.notes}
                    onChange={(e) => setRfqForm({ ...rfqForm, notes: e.target.value })}
                    placeholder="Specify target GSM, Pantone codes, woven label requirements or custom measurement chart..."
                    className="w-full border border-black p-2.5 outline-none text-[12px] bg-white focus:bg-neutral-50"
                  />
                </div>

                {/* Simulated Tech Pack File Upload */}
                <div>
                  <label className="block font-bold uppercase text-[10px] text-neutral-700 mb-1">
                    ATTACH TECH PACK / DESIGN FILE (PDF, ZIP, AI)
                  </label>
                  <input
                    type="file"
                    onChange={(e) => setRfqForm({ ...rfqForm, fileName: e.target.files?.[0]?.name || "" })}
                    className="w-full text-[11px] text-neutral-600 border border-neutral-300 p-2 cursor-pointer"
                  />
                  {rfqForm.fileName && (
                    <span className="text-[10px] text-black font-bold mt-1 block">
                      Attached: {rfqForm.fileName}
                    </span>
                  )}
                </div>

                <button
                  type="submit"
                  className="btn-filled-add w-full py-3.5 text-[12px] font-bold uppercase tracking-[0.05em] flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                >
                  <Send className="w-4 h-4" /> SUBMIT RFQ TO MILL MANAGER
                </button>
              </form>
            )}

          </div>
        </div>
      )}

      {/* ── REQUIREMENT 1: FABRIC TEXTURE WEAVE ZOOM MODAL ── */}
      {showFabricZoomModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="relative w-full max-w-2xl bg-white border border-black p-6 font-favorit text-black shadow-2xl">
            <button
              onClick={() => setShowFabricZoomModal(false)}
              className="absolute top-4 right-4 text-black hover:opacity-60 cursor-pointer p-1 z-10 bg-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-2">
              <ZoomIn className="w-4 h-4 text-black" />
              <span className="text-[10px] font-bold uppercase tracking-[0.05em] font-mono text-neutral-500">
                HIGH-RESOLUTION TEXTURE & FABRIC WEAVE CLOSE-UP
              </span>
            </div>

            <h3 className="text-[18px] font-bold uppercase text-black mb-1">
              {product.name} — WEAVE DETAIL
            </h3>
            <p className="text-[12px] text-neutral-600 mb-4">
              Composition: <strong>{product.composition}</strong> | Weight: <strong>{product.gsm || "180 GSM"}</strong> | Yarn: <strong>{product.yarnCount || "30s Combed"}</strong>
            </p>

            <div className="relative aspect-square w-full bg-neutral-900 border border-black overflow-hidden group">
              <img
                src={product.fabricTextureImage || product.image}
                alt="Fabric weave zoom"
                className="w-full h-full object-cover scale-150 group-hover:scale-[2.2] transition-transform duration-500 cursor-zoom-in"
              />
              <div className="absolute bottom-4 left-4 bg-black/80 text-white px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-3 h-3 text-amber-300" /> HOVER OVER FABRIC FOR MICRO-WEAVE MAGNIFICATION
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between text-[11px] text-neutral-600">
              <span>Finish: {product.dyeingFinishing || "Bio-washed Silicon Softener"}</span>
              <button
                onClick={() => setShowFabricZoomModal(false)}
                className="btn-ghost-cta py-1.5 px-4 text-[11px]"
              >
                CLOSE VIEWER
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── REQUIREMENT 1: 360° DRAPE & MOVEMENT VIEWER MODAL ── */}
      {show3dModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="relative w-full max-w-xl bg-white border border-black p-6 font-favorit text-black shadow-2xl">
            <button
              onClick={() => setShow3dModal(false)}
              className="absolute top-4 right-4 text-black hover:opacity-60 cursor-pointer p-1 z-10 bg-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-2">
              <RotateCw className="w-4 h-4 text-black" />
              <span className="text-[10px] font-bold uppercase tracking-[0.05em] font-mono text-neutral-500">
                360-DEGREE INTERACTIVE DRAPE & MOVEMENT VIEWER
              </span>
            </div>

            <h3 className="text-[18px] font-bold uppercase text-black mb-1">
              {product.name} — FIT & DRAPE PREVIEW
            </h3>
            <p className="text-[12px] text-neutral-600 mb-4">
              Simulated interactive drape model showing movement, shoulder fall, and hem structure.
            </p>

            <div className="relative aspect-[4/5] w-full bg-[#f0efe7] border border-black overflow-hidden flex items-center justify-center">
              <img
                src={galleryList[currentAngle % galleryList.length]}
                alt="360 angle view"
                className={`w-full h-full object-cover transition-all duration-300 ${is3dRotating ? "scale-[1.02]" : ""}`}
              />
              <div className="absolute top-4 right-4 bg-black text-white text-[10px] font-mono font-bold px-2 py-1">
                ROTATION ANGLE: {((currentAngle % 4) * 90)}°
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between gap-4">
              <button
                onClick={() => setCurrentAngle((prev) => prev + 1)}
                className="btn-ghost-cta py-2 px-4 text-[11px] font-bold uppercase flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCw className="w-3.5 h-3.5" /> ROTATE ANGLE (+90°)
              </button>

              <button
                onClick={() => setIs3dRotating(!is3dRotating)}
                className={`py-2 px-5 text-[11px] font-bold uppercase flex items-center gap-1.5 cursor-pointer ${
                  is3dRotating ? "bg-black text-white" : "bg-[#f0efe7] border border-black text-black"
                }`}
              >
                {is3dRotating ? "PAUSE AUTO-ROTATE" : "AUTO-ROTATE 360°"}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
