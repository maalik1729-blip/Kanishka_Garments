import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { Check, CheckCircle2, Loader2, Package, Phone, ShieldCheck, Truck } from "lucide-react";
import { mainCategories } from "@/lib/products";
import { createQuoteRequestApi } from "@/lib/quotes";

export const Route = createFileRoute("/wholesale")({
  head: () => ({
    meta: [
      { title: "Wholesale & Private Label RFQ — KANISHKA GARMENTS" },
      {
        name: "description",
        content:
          "Request wholesale pricing and sample kits. Direct-from-mill Tirupur activewear, knitwear, and organic fabric production.",
      },
    ],
  }),
  component: WholesalePage,
});

const schema = z.object({
  company: z.string().trim().min(2, "Company name is required").max(120),
  name: z.string().trim().min(2, "Your name is required").max(80),
  email: z.string().trim().email("Enter a valid email").max(200),
  phone: z.string().trim().min(6, "Enter a valid phone").max(30),
  country: z.string().trim().min(2).max(60),
  category: z.string().min(1, "Choose a product category"),
  quantity: z.string().trim().min(1, "Enter target quantity").max(30),
  target_price: z.string().trim().max(30).optional().or(z.literal("")),
  timeline: z.string().min(1, "Choose a timeline"),
  message: z.string().trim().max(1500).optional().or(z.literal("")),
});

function WholesalePage() {
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const raw = Object.fromEntries(new FormData(form).entries());
    const parsed = schema.safeParse(raw);
    if (!parsed.success) {
      alert(parsed.error.issues[0]?.message ?? "Please check the form.");
      return;
    }
    setSubmitting(true);
    await createQuoteRequestApi({
      productSlug: String(raw.category || "wholesale"),
      productName: `Wholesale RFQ: ${raw.company || "Brand"} (${raw.category || "General"})`,
      quantity: String(raw.quantity || "100"),
      destination: String(raw.country || ""),
      deliveryDate: String(raw.timeline ? `${raw.timeline} Days` : ""),
      email: String(raw.email || ""),
      phone: String(raw.phone || ""),
      notes: `Contact: ${raw.name} | Target Price: ${raw.target_price || "N/A"} | Notes: ${raw.message || ""}`,
    });
    setSubmitting(false);
    setSent(true);
    form.reset();
  };

  return (
    <div className="bg-white font-favorit text-black py-12 md:py-20">
      <div className="mx-auto max-w-[1440px] px-4 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Editorial Info */}
          <div className="lg:col-span-5 space-y-8">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-[0.025em] text-neutral-500">
                WHOLESALE & PRIVATE LABEL
              </span>
              <h1 className="favorit-display text-[30px] font-normal leading-tight text-black mt-1">
                Direct Tirupur Mill Procurement.
              </h1>
              <p className="text-[13px] text-neutral-600 font-normal leading-relaxed mt-3">
                Submit your garment specifications, lab-dip color codes, or sample kit requests. Our
                export team responds within 48 business hours.
              </p>
            </div>

            {sent && (
              <div className="bg-[#f0efe7] border border-black p-4 text-[12px] text-black flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 stroke-[2]" /> Request submitted successfully. Our
                mill representative will reach out shortly.
              </div>
            )}

            <div className="space-y-4 border-t border-neutral-200 pt-6">
              {[
                {
                  title: "MOQ FROM 50–300 PCS",
                  desc: "Pilot runs, capsule drops, and full-scale production batches.",
                  icon: Package,
                },
                {
                  title: "GLOBAL LOGISTICS & DDP",
                  desc: "Direct air & sea freight from Tirupur and Chennai port.",
                  icon: Truck,
                },
                {
                  title: "OEKO-TEX CERTIFIED KNITS",
                  desc: "AQL 2.5 quality control inspection on every single batch.",
                  icon: ShieldCheck,
                },
              ].map((item) => (
                <div key={item.title} className="flex gap-3">
                  <item.icon className="w-4 h-4 text-black shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-[11px] font-bold uppercase text-black">{item.title}</h4>
                    <p className="text-[12px] text-neutral-600 font-normal">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-[#f0efe7] border border-black p-6 space-y-2 text-[12px] rounded-xl">
              <span className="font-bold uppercase tracking-[0.025em] text-black block mb-2">
                DIRECT MILL CONTACT & PAYMENT INFO
              </span>
              <p className="text-black font-normal flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-black" /> +91 87540 11563 (Call / WhatsApp)
              </p>
              <p className="text-black font-normal">Email: tmkanishkagarments@gmail.com</p>
              <p className="text-black font-normal">GSTIN: 33CNRPT6310G1ZS</p>
              <p className="text-neutral-600">
                Address: D.No.2/95A-3, Shop D S & S Complex, HRHK Nagar, S.R.Nagar South,
                Andipalayam Pirivu, TIRUPPUR - 641687
              </p>
              <div className="pt-2 border-t border-black/10 text-[11px] text-neutral-700 space-y-0.5">
                <p>
                  <strong>Payment Remittance:</strong> Official bank details provided upon order confirmation & proforma invoice.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Inquiry Form */}
          <div className="lg:col-span-7 bg-[#f0efe7] p-8 border border-black font-favorit">
            <h3 className="text-[16px] font-bold uppercase tracking-[0.025em] text-black mb-6">
              REQUEST WHOLESALE PRICE LIST & SPECS
            </h3>

            <form onSubmit={onSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field
                  label="COMPANY NAME *"
                  name="company"
                  required
                  placeholder="e.g. Kanishka Retailers Ltd"
                />
                <Field label="CONTACT NAME *" name="name" required placeholder="e.g. Jane Doe" />
                <Field
                  label="EMAIL ADDRESS *"
                  name="email"
                  type="email"
                  required
                  placeholder="jane@company.com"
                />
                <Field
                  label="PHONE / WHATSAPP *"
                  name="phone"
                  required
                  placeholder="+1 (555) 000-0000"
                />
                <Field
                  label="DESTINATION COUNTRY *"
                  name="country"
                  required
                  placeholder="United Kingdom / USA"
                />

                <div>
                  <label
                    htmlFor="category"
                    className="block text-[10px] font-bold uppercase text-black mb-1.5"
                  >
                    PRODUCT CATEGORY *
                  </label>
                  <select
                    id="category"
                    name="category"
                    required
                    className="w-full bg-white border border-[#333333] rounded-[4px] py-2 px-3 text-[12px] text-black focus:outline-none focus:border-black"
                  >
                    <option value="">Select Category</option>
                    {mainCategories.map((cat) => (
                      <option key={cat.slug} value={cat.slug}>
                        {cat.label}
                      </option>
                    ))}
                    <option value="mixed">Mixed Activewear & Sweats</option>
                  </select>
                </div>

                <Field
                  label="TARGET QUANTITY *"
                  name="quantity"
                  required
                  placeholder="e.g. 1,000 pcs"
                />
                <Field
                  label="TARGET PRICE (OPTIONAL)"
                  name="target_price"
                  placeholder="e.g. $4.50 / pc"
                />

                <div className="sm:col-span-2">
                  <label
                    htmlFor="timeline"
                    className="block text-[10px] font-bold uppercase text-black mb-1.5"
                  >
                    PRODUCTION TIMELINE *
                  </label>
                  <select
                    id="timeline"
                    name="timeline"
                    required
                    className="w-full bg-white border border-[#333333] rounded-[4px] py-2 px-3 text-[12px] text-black focus:outline-none focus:border-black"
                  >
                    <option value="">Select Timeline</option>
                    <option value="30">Urgent (Within 30 Days)</option>
                    <option value="60">Standard (30–60 Days)</option>
                    <option value="90">Future Collection (60–90 Days)</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label
                    htmlFor="message"
                    className="block text-[10px] font-bold uppercase text-black mb-1.5"
                  >
                    CUSTOM SPECIFICATIONS & LAB-DIP DETAILS
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    placeholder="Specify GSM, pantone color codes, packaging preferences, or private label tags..."
                    className="w-full bg-white border border-[#333333] rounded-[4px] p-3 text-[12px] text-black focus:outline-none focus:border-black resize-none"
                    maxLength={1500}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="btn-filled-add w-full py-3 text-[12px] uppercase tracking-[0.025em] mt-4 flex items-center justify-center gap-2 cursor-pointer"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> SUBMITTING RFQ...
                  </>
                ) : (
                  "SUBMIT RFQ INQUIRY"
                )}
              </button>

              <p className="text-[10px] text-neutral-500 text-center flex items-center justify-center gap-1 mt-2">
                <Check className="w-3 h-3" /> Guaranteed reply within 48 business hours
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <div>
      <label htmlFor={name} className="block text-[10px] font-bold uppercase text-black mb-1.5">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className="w-full bg-white border border-[#333333] rounded-[4px] py-2 px-3 text-[12px] text-black placeholder:text-neutral-400 focus:outline-none focus:border-black"
        maxLength={200}
      />
    </div>
  );
}
