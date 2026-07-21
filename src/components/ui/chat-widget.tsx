import { MessageSquare } from "lucide-react";
import { useState } from "react";

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {isOpen && (
        <div className="mb-3 w-80 bg-white border border-black p-4 text-xs font-favorit text-black">
          <div className="flex items-center justify-between border-b border-black pb-2 mb-3">
            <span className="font-bold tracking-wide text-xs">KANISHKA EDITORIAL SUPPORT</span>
            <button
              onClick={() => setIsOpen(false)}
              className="text-xs hover:opacity-60 cursor-pointer"
            >
              ✕
            </button>
          </div>
          <p className="mb-3 text-neutral-600 leading-relaxed">
            Welcome to Kanishka Garments. Ask us about bulk MOQ orders, custom lab-dips, or
            activewear sample kits.
          </p>
          <div className="space-y-2">
            <input
              type="text"
              placeholder="Your email or WhatsApp..."
              className="w-full border-b border-black py-1.5 text-xs placeholder:text-neutral-400 focus:outline-none"
            />
            <button
              onClick={() => setIsOpen(false)}
              className="w-full bg-black text-white py-2 text-xs font-medium rounded-[4px] hover:opacity-90 transition-opacity"
            >
              Start Conversation
            </button>
          </div>
        </div>
      )}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Live Support Chat"
        className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center cursor-pointer transition-transform hover:scale-105 active:scale-95"
      >
        <MessageSquare className="w-5 h-5 fill-white text-black stroke-1" />
      </button>
    </div>
  );
}
