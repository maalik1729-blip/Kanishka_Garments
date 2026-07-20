import { Link, useRouterState } from "@tanstack/react-router";
import { useState } from "react";
import { Search, User, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const categoryLinks = [
  { to: "/products", label: "SHOP" },
  { to: "/wholesale", label: "WHOLESALE" },
  { to: "/about", label: "ABOUT" },
  { to: "/contact", label: "CONTACT" },
] as const;

export function SiteHeader() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white font-favorit">

      {/* Main Header Bar */}
      <div className="border-b border-black bg-white px-4 md:px-8 py-[6px]">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between min-h-[52px]">
          
          {/* Left: Desktop Category Links */}
          <nav className="hidden lg:flex items-center gap-6">
            {categoryLinks.map((item) => {
              const active =
                item.to === "/"
                  ? pathname === "/"
                  : pathname === item.to || pathname.startsWith(item.to + "/");
              return (
                <Link
                  key={item.label}
                  to={item.to}
                  className={cn(
                    "text-[12px] font-medium tracking-[0.025em] text-black hover:opacity-60 transition-opacity",
                    active && "underline underline-offset-4 decoration-[1px]"
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Mobile Menu Button (Left) */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-1 text-black cursor-pointer"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5 stroke-[1.5]" /> : <Menu className="w-5 h-5 stroke-[1.5]" />}
          </button>

          {/* Center: Brand Wordmark (Favorit 30px Weight 700) */}
          <Link
            to="/"
            className="text-[24px] sm:text-[28px] md:text-[30px] font-bold tracking-[0.025em] text-black uppercase hover:opacity-90 transition-opacity text-center"
          >
            KANISHKA
          </Link>

          {/* Right: Icon Cluster */}
          <div className="flex items-center gap-4">
            {/* Search Trigger */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-1 text-black hover:opacity-60 transition-opacity cursor-pointer"
              aria-label="Search"
            >
              <Search className="w-[18px] h-[18px] stroke-[1.5]" />
            </button>

            {/* Account Icon */}
            <Link
              to="/wholesale"
              className="hidden sm:block p-1 text-black hover:opacity-60 transition-opacity"
              aria-label="Account"
            >
              <User className="w-[18px] h-[18px] stroke-[1.5]" />
            </Link>
          </div>
        </div>
      </div>

      {/* Expandable Search Input Bar */}
      {searchOpen && (
        <div className="bg-[#f0efe7] border-b border-black px-4 py-3 transition-all">
          <div className="mx-auto max-w-[600px] flex items-center gap-3">
            <Search className="w-4 h-4 text-black stroke-[1.5]" />
            <input
              type="text"
              autoFocus
              placeholder="SEARCH ACTIVEWEAR, SWEATS, FABRICS..."
              className="search-underline-input w-full text-[12px] placeholder:text-neutral-500 uppercase focus:outline-none"
            />
            <button
              onClick={() => setSearchOpen(false)}
              className="text-[11px] font-medium text-black hover:opacity-60 uppercase cursor-pointer"
            >
              CLOSE
            </button>
          </div>
        </div>
      )}

      {/* Mobile Drawer Navigation */}
      {mobileOpen && (
        <div className="lg:hidden border-b border-black bg-white px-6 py-6 font-favorit">
          <nav className="flex flex-col gap-4">
            {categoryLinks.map((item) => (
              <Link
                key={item.label}
                to={item.to}
                onClick={() => setMobileOpen(false)}
                className="text-[14px] font-medium tracking-[0.025em] text-black border-b border-neutral-200 pb-2 hover:opacity-60"
              >
                {item.label}
              </Link>
            ))}
            <Link
              to="/wholesale"
              onClick={() => setMobileOpen(false)}
              className="btn-filled-add mt-2 text-center py-2 text-[12px]"
            >
              REQUEST WHOLESALE QUOTE
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
