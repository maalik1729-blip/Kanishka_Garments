import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="mt-16 bg-[#f0efe7] text-black font-favorit border-t border-black">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {/* Column 1: Newsletter / Editorial voice */}
          <div className="flex flex-col">
            <h4 className="text-[12px] font-medium uppercase tracking-[0.025em] text-black mb-3">
              THE EDITORIAL LOOKBOOK
            </h4>
            <p className="text-[12px] text-neutral-600 font-normal leading-relaxed mb-4">
              Subscribe for exclusive seasonal lookbook drops, fabric lab-dip updates, and wholesale
              garment availability directly from our Tirupur mill.
            </p>
            <form onSubmit={(e) => e.preventDefault()} className="flex items-center gap-2">
              <input
                type="email"
                placeholder="ENTER YOUR EMAIL..."
                className="search-underline-input flex-1 text-[11px]"
              />
              <button
                type="submit"
                aria-label="Subscribe"
                className="btn-filled-add py-1.5 px-3 text-[11px] flex items-center gap-1 cursor-pointer"
              >
                JOIN <ArrowRight className="w-3 h-3" />
              </button>
            </form>
          </div>

          {/* Column 2: Navigation */}
          <div>
            <h4 className="text-[12px] font-medium uppercase tracking-[0.025em] text-black mb-3">
              SHOP COLLECTION
            </h4>
            <ul className="space-y-2 text-[12px] text-black font-normal">
              <li>
                <Link to="/products" className="hover:opacity-60 transition-opacity">
                  Activewear & Sets
                </Link>
              </li>
              <li>
                <Link to="/products" className="hover:opacity-60 transition-opacity">
                  Hoodies & Sweats
                </Link>
              </li>
              <li>
                <Link to="/products" className="hover:opacity-60 transition-opacity">
                  Cotton Fabrics & Knits
                </Link>
              </li>
              <li>
                <Link to="/products" className="hover:opacity-60 transition-opacity">
                  T-Shirts & Oversized Tops
                </Link>
              </li>
              <li>
                <Link to="/products" className="hover:opacity-60 transition-opacity">
                  New Arrivals
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Wholesale & Brand */}
          <div>
            <h4 className="text-[12px] font-medium uppercase tracking-[0.025em] text-black mb-3">
              MANUFACTURING
            </h4>
            <ul className="space-y-2 text-[12px] text-black font-normal">
              <li>
                <Link to="/wholesale" className="hover:opacity-60 transition-opacity">
                  Wholesale Inquiry & RFQ
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:opacity-60 transition-opacity">
                  Mill Architecture & Capacity
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:opacity-60 transition-opacity">
                  Private Labeling & OEM
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:opacity-60 transition-opacity">
                  Sample Kit Request
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Location & Direct Contact */}
          <div>
            <h4 className="text-[12px] font-medium uppercase tracking-[0.025em] text-black mb-3">
              HEADQUARTERS & MILL
            </h4>
            <p className="text-[12px] text-neutral-600 font-normal leading-relaxed">
              <strong>TM KANISHKA GARMENTS</strong>
              <br />
              D.No.2/95A-3, Shop D S & S Complex,
              <br />
              HRHK Nagar, S.R.Nagar South,
              <br />
              Andipalayam Pirivu, TIRUPPUR - 641687
            </p>
            <p className="mt-3 text-[12px] text-black font-normal">
              Cell: +91 87540 11563
              <br />
              Email: tmkanishkagarments@gmail.com
              <br />
              GSTIN: 33CNRPT6310G1ZS
            </p>
          </div>
        </div>

        {/* Hairline Divider & Copyright */}
        <div className="mt-16 pt-8 border-t border-neutral-300 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-neutral-500 font-normal">
          <p>© {new Date().getFullYear()} KANISHKA GARMENTS. ALL RIGHTS RESERVED.</p>
          <div className="flex gap-6">
            <Link to="/about" className="hover:text-black">
              PRIVACY POLICY
            </Link>
            <Link to="/about" className="hover:text-black">
              TERMS OF SERVICE
            </Link>
            <Link to="/contact" className="hover:text-black">
              LOCATION & MAP
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
