import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Loader2, Mail, MapPin, Phone } from "lucide-react";
import { z } from "zod";
import { toast } from "sonner";
import { createQuoteRequestApi } from "@/lib/quotes";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Mill — KANISHKA GARMENTS" },
      {
        name: "description",
        content:
          "Reach our Tirupur textile mill team directly. Address, phone, email, and inquiry form.",
      },
    ],
  }),
  component: ContactPage,
});

const schema = z.object({
  name: z.string().trim().min(2, "Name required").max(80),
  email: z.string().trim().email("Valid email required").max(200),
  subject: z.string().trim().min(2).max(140),
  message: z.string().trim().min(5, "Message too short").max(1500),
});

function ContactPage() {
  const [busy, setBusy] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const parsed = schema.safeParse(Object.fromEntries(new FormData(form).entries()));
    if (!parsed.success) {
      toast.error("Please check the form", { description: parsed.error.issues[0]?.message });
      return;
    }
    setBusy(true);
    await createQuoteRequestApi({
      productSlug: "contact-inquiry",
      productName: `Direct Contact: ${parsed.data.subject}`,
      quantity: "General Inquiry",
      destination: "India / Direct",
      email: parsed.data.email,
      notes: `Name: ${parsed.data.name} | Subject: ${parsed.data.subject} | Message: ${parsed.data.message}`,
    });
    setBusy(false);
    toast.success("Message sent to Mill Manager", {
      description: "We will get back to you within 1 business day.",
    });
    form.reset();
  };

  return (
    <div className="bg-white font-favorit text-black py-12 md:py-20">
      <div className="mx-auto max-w-[1440px] px-4 md:px-8">
        <div className="max-w-xl mb-12">
          <span className="text-[10px] font-bold uppercase tracking-[0.025em] text-neutral-500">
            GET IN TOUCH
          </span>
          <h1 className="favorit-display text-[30px] font-normal text-black mt-1">
            Talk to the Mill.
          </h1>
          <p className="text-[13px] text-neutral-600 font-normal mt-2 leading-relaxed">
            For sales inquiries, custom sample kits, factory visits, or private label consultations,
            our Tirupur office responds within 1 business day.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Direct Contact Cards */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-[#f0efe7] p-6 border border-black space-y-2 rounded-xl">
              <MapPin className="w-5 h-5 text-black" />
              <h4 className="text-[12px] font-bold uppercase text-black pt-1">
                HEAD OFFICE & FACTORY MILL
              </h4>
              <p className="text-[12px] text-neutral-700 font-normal leading-relaxed">
                <strong>TM KANISHKA GARMENTS</strong>
                <br />
                D.No.2/95A-3, Shop D S & S Complex,
                <br />
                HRHK Nagar, S.R.Nagar South,
                <br />
                Andipalayam Pirivu, TIRUPPUR - 641687
                <br />
                Tamil Nadu, India
              </p>
            </div>

            <div className="bg-[#f0efe7] p-6 border border-black space-y-2 rounded-xl">
              <Phone className="w-5 h-5 text-black" />
              <h4 className="text-[12px] font-bold uppercase text-black pt-1">PHONE & WHATSAPP</h4>
              <p className="text-[12px] text-neutral-700 font-normal leading-relaxed">
                Direct / Cell:{" "}
                <a href="tel:8754011563" className="underline font-medium text-black">
                  +91 87540 11563
                </a>
                <br />
                GSTIN: <strong>33CNRPT6310G1ZS</strong>
              </p>
            </div>

            <div className="bg-[#f0efe7] p-6 border border-black space-y-2 rounded-xl">
              <Mail className="w-5 h-5 text-black" />
              <h4 className="text-[12px] font-bold uppercase text-black pt-1">EMAIL & BANKING</h4>
              <p className="text-[12px] text-neutral-700 font-normal leading-relaxed">
                Official Email:{" "}
                <a
                  href="mailto:tmkanishkagarments@gmail.com"
                  className="underline font-medium text-black"
                >
                  tmkanishkagarments@gmail.com
                </a>
              </p>
              <div className="pt-2 border-t border-black/10 text-[11px] text-neutral-600 space-y-0.5">
                <p>
                  <strong>Bank:</strong> State Bank of India
                </p>
                <p>
                  <strong>A/C No:</strong> 43605722884
                </p>
                <p>
                  <strong>IFSC Code:</strong> SBIN0000935
                </p>
                <p>
                  <strong>Branch:</strong> Tirupur Main Branch
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7 bg-[#f0efe7] p-8 border border-black font-favorit">
            <h3 className="text-[16px] font-bold uppercase tracking-[0.025em] text-black mb-6">
              SEND DIRECT MESSAGE
            </h3>

            <form onSubmit={onSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-[10px] font-bold uppercase text-black mb-1.5"
                >
                  YOUR NAME *
                </label>
                <input
                  id="name"
                  name="name"
                  required
                  placeholder="e.g. Jane Doe"
                  className="w-full bg-white border border-[#333333] rounded-[4px] py-2 px-3 text-[12px] text-black placeholder:text-neutral-400 focus:outline-none focus:border-black"
                  maxLength={80}
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-[10px] font-bold uppercase text-black mb-1.5"
                >
                  EMAIL ADDRESS *
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="jane@company.com"
                  className="w-full bg-white border border-[#333333] rounded-[4px] py-2 px-3 text-[12px] text-black placeholder:text-neutral-400 focus:outline-none focus:border-black"
                  maxLength={200}
                />
              </div>

              <div>
                <label
                  htmlFor="subject"
                  className="block text-[10px] font-bold uppercase text-black mb-1.5"
                >
                  SUBJECT *
                </label>
                <input
                  id="subject"
                  name="subject"
                  required
                  placeholder="e.g. Sample Kit Request / Private Label Inquiries"
                  className="w-full bg-white border border-[#333333] rounded-[4px] py-2 px-3 text-[12px] text-black placeholder:text-neutral-400 focus:outline-none focus:border-black"
                  maxLength={140}
                />
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-[10px] font-bold uppercase text-black mb-1.5"
                >
                  MESSAGE *
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  required
                  placeholder="Type your message or inquiry here..."
                  className="w-full bg-white border border-[#333333] rounded-[4px] p-3 text-[12px] text-black placeholder:text-neutral-400 focus:outline-none focus:border-black resize-none"
                  maxLength={1500}
                />
              </div>

              <button
                type="submit"
                disabled={busy}
                className="btn-filled-add w-full py-3 text-[12px] uppercase tracking-[0.025em] mt-4 flex items-center justify-center gap-2 cursor-pointer"
              >
                {busy ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> SENDING MESSAGE...
                  </>
                ) : (
                  "SEND MESSAGE"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
