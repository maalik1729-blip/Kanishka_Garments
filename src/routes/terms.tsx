import { createFileRoute, Link } from "@tanstack/react-router";
import { FileText, CheckCircle2, AlertCircle, Building2 } from "lucide-react";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms of Service — TM KANISHKA GARMENTS" },
      {
        name: "description",
        content:
          "Terms of Service & Wholesale Mill Supply Conditions for TM KANISHKA GARMENTS in Tirupur, India.",
      },
    ],
  }),
  component: TermsOfServicePage,
});

function TermsOfServicePage() {
  return (
    <div className="bg-white font-favorit text-black py-12 md:py-20 selection:bg-black selection:text-white">
      <div className="mx-auto max-w-[1000px] px-4 md:px-8 space-y-12">
        {/* Page Header */}
        <div className="border-b border-black pb-8 space-y-3">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-black" />
            <span className="text-[10px] font-bold uppercase tracking-[0.05em] text-neutral-500">
              TM KANISHKA GARMENTS · COMMERCIAL TERMS & CONDITIONS
            </span>
          </div>
          <h1 className="favorit-display text-[32px] md:text-[42px] font-bold tracking-tight uppercase text-black">
            TERMS OF SERVICE
          </h1>
          <p className="text-[13px] text-neutral-600 font-normal">
            Official B2B Manufacturing & Wholesale Supply Conditions | Effective July 2026
          </p>
        </div>

        {/* Banking & GST Highlight Box */}
        <div className="bg-[#f0efe7] border border-black p-6 md:p-8 rounded-xl space-y-3">
          <h3 className="text-[14px] font-bold uppercase tracking-[0.025em] text-black flex items-center gap-2">
            <Building2 className="w-4 h-4 text-black" /> Official Business & Banking Registration
          </h3>
          <div className="text-[12px] text-neutral-800 leading-relaxed font-normal grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-black/10">
            <div>
              <p>
                <strong>Entity Name:</strong> TM KANISHKA GARMENTS
              </p>
              <p>
                <strong>GSTIN:</strong> 33CNRPT6310G1ZS
              </p>
              <p>
                <strong>Address:</strong> D.No.2/95A-3, Shop D S & S Complex, HRHK Nagar, S.R.Nagar
                South, Andipalayam Pirivu, TIRUPPUR - 641687
              </p>
            </div>
            <div>
              <p>
                <strong>Payment Remittance:</strong> Official Bank Details provided on Proforma Invoice
              </p>
              <p>
                <strong>Registration:</strong> MSME Registered Apparel Unit
              </p>
            </div>
          </div>
        </div>

        {/* Terms Sections */}
        <div className="space-y-10 text-[13px] leading-relaxed text-neutral-800 font-normal">
          {/* 1. Wholesale Orders & MOQ */}
          <div className="space-y-3">
            <h2 className="text-[16px] font-bold uppercase tracking-[0.025em] text-black flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-black" /> 1. Minimum Order Quantity (MOQ) &
              Volume Pricing
            </h2>
            <p>
              All wholesale orders direct from our Tirupur factory mill are subject to minimum order
              quantity requirements specified per product tier (standard MOQ starting from 100 to
              500 pcs per style/colorway). Volume tier discounts are applied automatically at the
              time of quotation.
            </p>
          </div>

          {/* 2. Fabric Specs & Tolerances */}
          <div className="space-y-3">
            <h2 className="text-[16px] font-bold uppercase tracking-[0.025em] text-black flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-black" /> 2. Fabric GSM, Color Fastness &
              Shrinkage Rating
            </h2>
            <p>
              Our 100% Combed Cotton, Bio-washed, and Silicon-treated knits adhere to industry
              standard tolerance limits:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-neutral-700">
              <li>
                <strong>GSM Weight Tolerance:</strong> ±5% variation allowed due to yarn dye
                batches.
              </li>
              <li>
                <strong>Dimensional Shrinkage:</strong> Pre-shrunk fabric rating within 3%–5%
                post-wash.
              </li>
              <li>
                <strong>Lab-Dip Color Approvals:</strong> Pantone matching within 95% visual
                accuracy under standard light boxes (D65).
              </li>
            </ul>
          </div>

          {/* 3. Payment Terms & Bank Remittance */}
          <div className="space-y-3">
            <h2 className="text-[16px] font-bold uppercase tracking-[0.025em] text-black">
              3. Payment Terms & Remittance
            </h2>
            <p>
              Official invoices are issued under GSTIN <strong>33CNRPT6310G1ZS</strong>. Verified bank transfer details are provided directly to wholesale buyers upon order confirmation and Proforma Invoice issue.
            </p>
            <div className="bg-white p-4 border border-black text-[12px] font-mono space-y-1">
              <p>Entity: TM KANISHKA GARMENTS</p>
              <p>GSTIN: 33CNRPT6310G1ZS</p>
              <p>Remittance: RTGS / NEFT / IMPS (Details on Official Proforma Invoice)</p>
            </div>
          </div>

          {/* 4. Inspection & Quality Assurance */}
          <div className="space-y-3 border-t border-neutral-200 pt-8">
            <h2 className="text-[16px] font-bold uppercase tracking-[0.025em] text-black">
              4. AQL 2.5 Quality Control & Claims
            </h2>
            <p>
              All shipments undergo rigorous AQL 2.5 final inspections before dispatch. Any quality
              claims or quantity discrepancies must be reported in writing within 7 business days of
              delivery receipt along with photo/video evidence to{" "}
              <strong>tmkanishkagarments@gmail.com</strong> or WhatsApp (+91 87540 11563).
            </p>
          </div>
        </div>

        {/* Back Link */}
        <div className="pt-6 border-t border-black flex items-center justify-between">
          <Link to="/" className="btn-ghost-cta">
            ← RETURN TO HOME
          </Link>
          <Link to="/privacy" className="btn-filled-add py-2 px-6 text-[11px]">
            VIEW PRIVACY POLICY →
          </Link>
        </div>
      </div>
    </div>
  );
}
