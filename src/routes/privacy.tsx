import { createFileRoute, Link } from "@tanstack/react-router";
import { ShieldCheck, Lock, Eye, FileText } from "lucide-react";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — TM KANISHKA GARMENTS" },
      {
        name: "description",
        content:
          "Privacy Policy & B2B Data Security Statement for TM KANISHKA GARMENTS in Tirupur, India.",
      },
    ],
  }),
  component: PrivacyPolicyPage,
});

function PrivacyPolicyPage() {
  return (
    <div className="bg-white font-favorit text-black py-12 md:py-20 selection:bg-black selection:text-white">
      <div className="mx-auto max-w-[1000px] px-4 md:px-8 space-y-12">
        {/* Page Header */}
        <div className="border-b border-black pb-8 space-y-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-black" />
            <span className="text-[10px] font-bold uppercase tracking-[0.05em] text-neutral-500">
              TM KANISHKA GARMENTS · LEGAL & COMPLIANCE
            </span>
          </div>
          <h1 className="favorit-display text-[32px] md:text-[42px] font-bold tracking-tight uppercase text-black">
            PRIVACY POLICY
          </h1>
          <p className="text-[13px] text-neutral-600 font-normal">
            Last Updated: July 2026 | Applies to all Wholesale Inquiries, Tech Pack Submissions &
            Client Data
          </p>
        </div>

        {/* Overview Banner */}
        <div className="bg-[#f0efe7] border border-black p-6 md:p-8 rounded-xl space-y-3">
          <h3 className="text-[14px] font-bold uppercase tracking-[0.025em] text-black">
            Our Commitment to B2B Confidentiality
          </h3>
          <p className="text-[13px] text-neutral-700 leading-relaxed font-normal">
            At <strong>TM KANISHKA GARMENTS</strong> (D.No.2/95A-3, Shop D S & S Complex, HRHK
            Nagar, S.R.Nagar South, Andipalayam Pirivu, TIRUPPUR - 641687), we respect the privacy
            of our wholesale buyers, private label brands, and retail partners worldwide. This
            Privacy Policy details how we collect, use, and protect your commercial information.
          </p>
        </div>

        {/* Policy Sections Grid */}
        <div className="space-y-10 text-[13px] leading-relaxed text-neutral-800 font-normal">
          {/* Section 1 */}
          <div className="space-y-3">
            <h2 className="text-[16px] font-bold uppercase tracking-[0.025em] text-black flex items-center gap-2">
              <Lock className="w-4 h-4 text-black" /> 1. Information We Collect
            </h2>
            <p>
              When you submit a Request for Quote (RFQ), register an inquiry, or request sample
              kits, we collect:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-neutral-700">
              <li>
                <strong>Business Identification:</strong> Company name, GSTIN (if applicable),
                billing address, and point-of-contact details.
              </li>
              <li>
                <strong>Communication Details:</strong> Direct phone/WhatsApp numbers, official
                business email address, and order specifications.
              </li>
              <li>
                <strong>Design & Proprietary Tech Packs:</strong> Measurement spec sheets, Pantone
                color references, artwork files, and custom label designs.
              </li>
            </ul>
          </div>

          {/* Section 2 */}
          <div className="space-y-3">
            <h2 className="text-[16px] font-bold uppercase tracking-[0.025em] text-black flex items-center gap-2">
              <Eye className="w-4 h-4 text-black" /> 2. Tech Pack & Proprietary Design Security
            </h2>
            <p>
              We treat all client tech packs, artwork, cut-and-sew measurements, and private label
              branding specifications as strictly confidential property. We execute standard
              Non-Disclosure Agreements (NDAs) upon request prior to bulk production.
            </p>
          </div>

          {/* Section 3 */}
          <div className="space-y-3">
            <h2 className="text-[16px] font-bold uppercase tracking-[0.025em] text-black flex items-center gap-2">
              <FileText className="w-4 h-4 text-black" /> 3. How We Use Your Data
            </h2>
            <p>Your commercial information is used exclusively for:</p>
            <ul className="list-disc pl-5 space-y-1 text-neutral-700">
              <li>
                Calculating MOQ volume pricing tier quotes direct from our Tirupur factory mill.
              </li>
              <li>Processing fabric lab-dips, pre-production samples, and shipping logistics.</li>
              <li>
                Generating tax invoices under GSTIN <strong>33CNRPT6310G1ZS</strong> and dispatch
                documentation.
              </li>
              <li>
                Communicating order status updates via WhatsApp (+91 87540 11563) or email
                (tmkanishkagarments@gmail.com).
              </li>
            </ul>
          </div>

          {/* Section 4 */}
          <div className="space-y-3 border-t border-neutral-200 pt-8">
            <h2 className="text-[16px] font-bold uppercase tracking-[0.025em] text-black">
              4. Contact Us Regarding Privacy
            </h2>
            <p>
              For privacy requests, NDA executions, or data updates, reach our compliance team
              directly:
            </p>
            <div className="bg-[#f0efe7] p-4 border border-black/20 text-[12px] space-y-1 font-mono">
              <p>
                <strong>TM KANISHKA GARMENTS</strong>
              </p>
              <p>Email: tmkanishkagarments@gmail.com</p>
              <p>Cell / WhatsApp: +91 87540 11563</p>
              <p>
                Address: D.No.2/95A-3, HRHK Nagar, S.R.Nagar South, Andipalayam Pirivu, TIRUPPUR -
                641687
              </p>
            </div>
          </div>
        </div>

        {/* Back Link */}
        <div className="pt-6 border-t border-black flex items-center justify-between">
          <Link to="/" className="btn-ghost-cta">
            ← RETURN TO HOME
          </Link>
          <Link to="/terms" className="btn-filled-add py-2 px-6 text-[11px]">
            VIEW TERMS OF SERVICE →
          </Link>
        </div>
      </div>
    </div>
  );
}
