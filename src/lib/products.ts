import imgP1 from "@/assets/p1.png";
import imgP2 from "@/assets/p2.png";
import imgP3 from "@/assets/p3.png";
import imgP4 from "@/assets/p4.png";
import imgP5 from "@/assets/p5.png";
import imgP6 from "@/assets/p6.png";
import imgP7 from "@/assets/p7.png";
import imgP8 from "@/assets/p8.png";
import imgP9 from "@/assets/p9.png";
import imgP9Spec from "@/assets/p9-spec.jpg";
import imgP10 from "@/assets/p10.png";
import imgSingleJerseyWhite from "@/assets/7b623247-291d-4ff9-a70a-9d48aa0fdcd1.png";
import imgSingleJerseyNavy from "@/assets/d7399407-a6fe-4798-8de2-f698b4e7cb7d.png";
import imgBabySkyBlue from "@/assets/e9a8c112-8585-41e0-8d6f-57507bfa5ce3.png";
import imgBabyPink from "@/assets/538bd947-361b-45f6-94d1-fa08d8160d6a.png";
import imgVestWhite from "@/assets/b6fba935-c1ad-4181-bcfe-1e6676862140.png";
import imgVestBlack from "@/assets/ccacd5cf-5609-4aca-8e56-8ec55cf30ca1.png";
import imgNavyBlue from "@/assets/15aa1a6b-3f60-415e-91de-6b67caca50b1.png";
import imgWhite from "@/assets/bd8a002c-fcba-4b70-af34-cc1b424a95fa.png";
import imgMelangeGrey from "@/assets/720a034f-1a4d-473e-80ba-1d0e2b93d490.png";
import imgPoloRoyalBlue from "@/assets/65d1436c-f676-48ad-af75-e17aa63f251a.png";
import imgPoloWhite from "@/assets/fb61db15-756a-49bf-87b7-d6d23c463670.png";
import imgPoloCharcoal from "@/assets/c498bec3-7516-46c8-b6e5-b0d7a859eb6b.png";
import imgOversizedOffWhite from "@/assets/c966e5c5-f34b-4ed4-8823-aa0dd47836b0.png";
import imgOversizedBeige from "@/assets/89e4db30-a061-41d0-aeb8-b6a50d278b22.png";
import imgOversizedSageGreen from "@/assets/92b8ee90-45f9-4fd6-83bd-7d7f7025a764.png";
import imgHoodieHeatherGrey from "@/assets/c59162de-97c9-460b-b2dc-1e665e32a79e.png";
import imgHoodieNavyBlue from "@/assets/26fb42d3-ed4f-4eb5-b871-d915be795e59.png";
import imgJoggerNavy from "@/assets/21410269-6475-49ff-83ae-e0121c2639aa.png";
import imgJoggerDarkCharcoal from "@/assets/69897a39-c3ed-4b55-8ef6-65c1a9479c66.png";
import imgGymNavy from "@/assets/61607911-75fa-4a28-afa7-53c2695ad160.png";
import imgGymDarkCharcoal from "@/assets/5668f50b-d53e-45c1-89c2-aea8aa4e7b35.png";
import imgLeggingsNavyBlue from "@/assets/4bffaf6b-f15f-4aa8-9acd-52090c0968c9.png";
import imgLeggingsMaroon from "@/assets/538d59f2-88b2-4407-9d94-30bb4cdf925c.png";

export type ColorSwatch = { name: string; hex: string };

export type PricingTier = {
  tier: string;
  price: number;
};

export type Product = {
  slug: string;
  name: string;
  category: string;
  categoryLabel: string;
  subType?: string;
  isReadymade: boolean;
  shortDescription: string;
  description: string;
  image: string;
  galleryImages?: string[];
  fabricTextureImage?: string;
  videoPreviewUrl?: string;
  wholesalePrice: number;
  unit: string;
  moq: number;
  composition: string;
  gsm?: string;
  yarnCount?: string;
  dyeingFinishing?: string;
  printingCompatibility?: string;
  qualityParameters?: string;
  colors: string[];
  colorSwatches?: ColorSwatch[];
  colorImages?: Record<string, string>;
  sizes?: string[];
  leadTime: string;
  samplePolicy?: string;
  customizationOptions?: string[];
  certifications?: string[];
  badge?: string;
  vendors?: string;
  pricingTiers?: PricingTier[];
  gender?: string;
  occasion?: string;
  isAdminAdded?: boolean;
};

export type MainCategory = {
  slug: string;
  label: string;
  icon: string;
  blurb: string;
  image: string;
};

export const mainCategories: MainCategory[] = [
  {
    slug: "activewear",
    label: "Activewear",
    icon: "",
    blurb: "Dry-Fit Gym Tops · Track Pants · Stretch Leggings · Workout Tees",
    image: imgP6,
  },
  {
    slug: "sweats",
    label: "Sweats & Hoodies",
    icon: "",
    blurb: "Cotton Fleece Hoodies · Zip-ups · Heavyweight Sweatshirts · Joggers",
    image: imgP4,
  },
  {
    slug: "gents",
    label: "Gents & Unisex Wear",
    icon: "",
    blurb: "Basic Tees · Polo T-Shirts · Oversized Streetwear",
    image: imgP1,
  },
  {
    slug: "ladies",
    label: "Ladies Wear",
    icon: "",
    blurb: "Cotton-Lycra Leggings · Treggings · Kurtis",
    image: imgP7,
  },
  {
    slug: "kids",
    label: "Kids & Baby Wear",
    icon: "",
    blurb: "Organic Cotton Baby Onesies · Rompers · Infant Sets",
    image: imgP8,
  },
  {
    slug: "innerwear",
    label: "Innerwear & Vests",
    icon: "",
    blurb: "100% Fine Combed Rib Cotton Vests · Undershirts · Briefs",
    image: imgP9,
  },
  {
    slug: "fabric",
    label: "Raw Knitted Fabrics",
    icon: "",
    blurb: "Single Jersey · French Terry · Fleece · Pique Knit Fabric Rolls by Kg",
    image: imgP10,
  },
];

// ── ADMIN PRODUCT PERSISTENCE ─────────────────────────────────────────────
const ADMIN_PRODUCTS_KEY = "kanishka_admin_products_v1";

export function getAdminProducts(): Product[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(ADMIN_PRODUCTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveAdminProducts(products: Product[]) {
  try {
    localStorage.setItem(ADMIN_PRODUCTS_KEY, JSON.stringify(products));
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("kanishka_products_updated"));
    }
  } catch {}
}

export async function fetchAdminProductsApi(): Promise<Product[]> {
  try {
    const res = await fetch("/api/products");
    if (!res.ok) throw new Error("Failed to fetch products API");
    const data: Product[] = await res.json();
    if (Array.isArray(data)) {
      saveAdminProducts(data);
      return data;
    }
  } catch (err) {
    console.warn("API fetch products failed, falling back to LocalStorage:", err);
  }
  return getAdminProducts();
}

export async function saveAdminProductApi(product: Product): Promise<Product[]> {
  try {
    const res = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(product),
    });
    if (res.ok) {
      const existing = getAdminProducts();
      const updated = [product, ...existing.filter((p) => p.slug !== product.slug)];
      saveAdminProducts(updated);
      return updated;
    }
  } catch (err) {
    console.warn("API save product failed, falling back to LocalStorage:", err);
  }
  const existing = getAdminProducts();
  const updated = [product, ...existing.filter((p) => p.slug !== product.slug)];
  saveAdminProducts(updated);
  return updated;
}

export async function deleteAdminProductApi(slug: string): Promise<Product[]> {
  try {
    const res = await fetch("/api/products", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug }),
    });
    if (res.ok) {
      const existing = getAdminProducts();
      const updated = existing.filter((p) => p.slug !== slug);
      saveAdminProducts(updated);
      return updated;
    }
  } catch (err) {
    console.warn("API delete product failed, falling back to LocalStorage:", err);
  }
  const existing = getAdminProducts();
  const updated = existing.filter((p) => p.slug !== slug);
  saveAdminProducts(updated);
  return updated;
}

// ── TOP 10 TIRUPPUR MANUFACTURED B2B PRODUCTS CATALOGUE ────────────────────
export const staticProducts: Product[] = [
  {
    slug: "basic-round-neck-tee",
    name: "Basic Round-Neck T-Shirts",
    category: "gents",
    categoryLabel: "Gents & Unisex Wear",
    subType: "t-shirt",
    isReadymade: true,
    shortDescription: "100% Combed Cotton, 180 GSM, Bio-washed, Pre-shrunk, Regular Fit.",
    description:
      "Premium 180 GSM 100% combed cotton basic round-neck t-shirts manufactured in Tirupur. Features bio-wash treatment for maximum softness, pre-shrunk fabric to eliminate post-wash shrinkage, and reinforced rib neck taping. Ideal for retail brands and private labeling.",
    image: imgP1,
    galleryImages: [imgP1, imgWhite, imgNavyBlue, imgMelangeGrey],
    fabricTextureImage: imgP1,
    wholesalePrice: 130,
    unit: "piece",
    moq: 100,
    composition: "100% Combed Cotton",
    gsm: "180 GSM",
    yarnCount: "30s Super Combed Yarn",
    dyeingFinishing: "Bio-washed, Silicon-washed, Reactive Dyes",
    printingCompatibility: "Screen Print, DTG, Puff Print, High-density Embroidery",
    qualityParameters: "Pre-shrunk (Under 3% shrinkage), ISO Grade 4+ Color Fastness",
    samplePolicy:
      "Sample kit available in 3–5 days. Sample cost 100% refunded on bulk order confirmation.",
    customizationOptions: [
      "Custom Woven Neck Labels & Size Tags",
      "Custom PMS/TPX Pantone Color Matching",
      "US / EU / Asian Tech-Pack Fit Adoption",
      "Single Polybag & Recycled Paper Packaging",
    ],
    certifications: [
      "OEKO-TEX Standard 100",
      "GOTS Organic Certified",
      "BSCI Audit Passed",
      "AQL 2.5 QC Standard",
    ],
    colors: ["Chocolate Brown", "White", "Navy Blue", "Melange Grey", "Olive Green", "Maroon"],
    colorSwatches: [
      { name: "Chocolate Brown", hex: "#5C3428" },
      { name: "White", hex: "#FFFFFF" },
      { name: "Navy Blue", hex: "#1B2A5A" },
      { name: "Melange Grey", hex: "#8A8D91" },
    ],
    colorImages: {
      "Chocolate Brown": imgP1,
      White: imgWhite,
      "Navy Blue": imgNavyBlue,
      "Melange Grey": imgMelangeGrey,
    },
    sizes: ["S", "M", "L", "XL", "2XL"],
    leadTime: "Sampling: 3–5 days | Bulk: 12–15 days",
    badge: "BESTSELLER",
    vendors: "Tirupur Knitwears Exports Private Limited, Priya Garments",
    pricingTiers: [
      { tier: "100 – 499 pcs", price: 130 },
      { tier: "500 – 1,999 pcs", price: 110 },
      { tier: "2,000+ pcs", price: 90 },
    ],
  },
  {
    slug: "polo-t-shirts",
    name: "Polo T-Shirts",
    category: "gents",
    categoryLabel: "Gents Wear",
    subType: "polo",
    isReadymade: true,
    shortDescription: "220–240 GSM Pique Cotton / CVC Blend, Flat-knit tipped collars & cuffs.",
    description:
      "Classic corporate and retail polo t-shirts in 220–240 GSM pique knit fabric. Features flat-knit collars and cuffs with contrast tipping, 2-button placket, side slits, and high color fastness.",
    image: imgP2,
    galleryImages: [imgP2, imgPoloRoyalBlue, imgPoloWhite, imgPoloCharcoal],
    fabricTextureImage: imgP2,
    wholesalePrice: 240,
    unit: "piece",
    moq: 100,
    composition: "220–240 GSM Pique Cotton / CVC Blend",
    gsm: "220–240 GSM",
    yarnCount: "24s Combed Pique Yarn",
    dyeingFinishing: "Bio-washed, Softener Treatment, Soft-feel Reactive Dyes",
    printingCompatibility: "Embroidery, HD Chest Print, Leather Patch, Screen Print",
    qualityParameters: "Pre-shrunk, Anti-pilling, ISO Grade 4+ Color Retention",
    samplePolicy: "Tech-pack counter sample in 4–6 days. Cost deductible against bulk purchase.",
    customizationOptions: [
      "Flat-knit Tipped Collar & Cuff Customization",
      "Custom Engraved Buttons & Placket Tags",
      "Custom Pantone Dyed Shades",
      "Individual Polybag Packaging",
    ],
    certifications: ["OEKO-TEX Standard 100", "WRAP Certified Facility", "AQL 2.5 QC Standard"],
    colors: ["Slate Grey", "Royal Blue", "White", "Charcoal", "Burgundy"],
    colorSwatches: [
      { name: "Slate Grey", hex: "#707A8A" },
      { name: "Royal Blue", hex: "#2B50AA" },
      { name: "White", hex: "#FFFFFF" },
      { name: "Charcoal", hex: "#363636" },
    ],
    colorImages: {
      "Slate Grey": imgP2,
      "Royal Blue": imgPoloRoyalBlue,
      White: imgPoloWhite,
      Charcoal: imgPoloCharcoal,
    },
    sizes: ["S", "M", "L", "XL", "2XL", "3XL"],
    leadTime: "Sampling: 4–6 days | Bulk: 14–18 days",
    badge: "CORPORATE FAV",
    vendors: "Tirupur Hub, Rae Exports",
    pricingTiers: [
      { tier: "100 – 499 pcs", price: 240 },
      { tier: "500 – 1,999 pcs", price: 200 },
      { tier: "2,000+ pcs", price: 170 },
    ],
  },
  {
    slug: "oversized-streetwear-tees",
    name: "Oversized & Streetwear Tees",
    category: "gents",
    categoryLabel: "Streetwear & Unisex",
    subType: "oversized tee",
    isReadymade: true,
    shortDescription: "240–280 GSM Heavyweight French Terry / Heavy Jersey, Drop-shoulder style.",
    description:
      "Heavyweight drop-shoulder streetwear t-shirts constructed from 240–280 GSM high-density jersey or French terry. Features thick ribbed crew neck, boxy oversized fit, and smooth surface for screen printing or embroidery.",
    image: imgP3,
    galleryImages: [imgP3, imgOversizedOffWhite, imgOversizedBeige, imgOversizedSageGreen],
    fabricTextureImage: imgP3,
    wholesalePrice: 220,
    unit: "piece",
    moq: 100,
    composition: "100% Heavy Jersey Cotton",
    gsm: "240–280 GSM",
    yarnCount: "20s Open-End / Compact Heavy Yarn",
    dyeingFinishing: "Garment Washed, Vintage Acid Wash Option, Bio-washed",
    printingCompatibility: "Puff Print, High-Density Screen Print, DTG, Chenille Embroidery",
    qualityParameters: "Heavy drape, Dimensional stability, Zero neck sag",
    samplePolicy: "Custom sample dispatch in 5 days. Fully credited upon PO placement.",
    customizationOptions: [
      "Custom Vintage & Acid Wash Effects",
      "Thick 1.25 inch Rib Collar Customization",
      "Custom Brand Hangtags & Back Neck Printing",
      "Custom Printed Box & Polybag Options",
    ],
    certifications: ["OEKO-TEX Standard 100", "SEDEX Audited", "AQL 2.5 QC Standard"],
    colors: ["Olive Green", "Off White", "Beige", "Sage Green", "Charcoal"],
    colorSwatches: [
      { name: "Olive Green", hex: "#4B5338" },
      { name: "Off White", hex: "#F5F3ED" },
      { name: "Beige", hex: "#D9CBB6" },
      { name: "Sage Green", hex: "#879883" },
    ],
    colorImages: {
      "Olive Green": imgP3,
      "Off White": imgOversizedOffWhite,
      Beige: imgOversizedBeige,
      "Sage Green": imgOversizedSageGreen,
    },
    sizes: ["S", "M", "L", "XL", "2XL"],
    leadTime: "Sampling: 5 days | Bulk: 14–20 days",
    badge: "TRENDING",
    vendors: "Tirupur Hub, Flairmart Lifestyle",
    pricingTiers: [
      { tier: "100 – 499 pcs", price: 220 },
      { tier: "500 – 1,999 pcs", price: 180 },
      { tier: "2,000+ pcs", price: 150 },
    ],
  },
  {
    slug: "hoodies-zipup-pullover",
    name: "Hoodies (Zip-up and Pullover)",
    category: "sweats",
    categoryLabel: "Sweats & Hoodies",
    subType: "hoodie",
    isReadymade: true,
    shortDescription:
      "300–340 GSM Cotton Fleece, Brushed Interior, Matching drawstrings & kangaroo pocket.",
    description:
      "Heavyweight 300–340 GSM cotton fleece hoodies engineered with plush brushed interior for superior warmth. Double-layered hood, flat drawstrings, heavy 2x2 rib cuffs, and roomy front kangaroo pocket.",
    image: imgP4,
    galleryImages: [imgP4, imgHoodieHeatherGrey, imgHoodieNavyBlue],
    fabricTextureImage: imgP4,
    wholesalePrice: 380,
    unit: "piece",
    moq: 100,
    composition: "80% Cotton / 20% Polyester Fleece",
    gsm: "300–340 GSM",
    yarnCount: "3-Thread Fleece Yarn (30s/20s/10s)",
    dyeingFinishing: "Brushed Back Fleece, Anti-pilling bio-wash, Reactive Dyes",
    printingCompatibility: "Embroidery, HD Screen Print, Puff Print, Applique",
    qualityParameters: "Thermal retention, Zero interior lint shedding, Pre-shrunk",
    samplePolicy: "Physical prototype sample in 5–7 days with customer logo.",
    customizationOptions: [
      "Custom Metal Aglets & Drawstring Eyelets",
      "YKK Metal / Nylon Zipper for Zip-up Styles",
      "Custom Private Label Woven Tags",
      "Export Container Carton Packaging",
    ],
    certifications: ["OEKO-TEX Standard 100", "BSCI Audit Passed", "AQL 2.5 QC Standard"],
    colors: ["Forest Green", "Heather Grey", "Navy Blue"],
    colorSwatches: [
      { name: "Forest Green", hex: "#1B4D3E" },
      { name: "Heather Grey", hex: "#9E9E9E" },
      { name: "Navy Blue", hex: "#1A2542" },
    ],
    colorImages: {
      "Forest Green": imgP4,
      "Heather Grey": imgHoodieHeatherGrey,
      "Navy Blue": imgHoodieNavyBlue,
    },
    sizes: ["S", "M", "L", "XL", "2XL"],
    leadTime: "Sampling: 5–7 days | Bulk: 18–25 days",
    badge: "WINTER ESSENTIAL",
    vendors: "Tirupur Hub",
    pricingTiers: [
      { tier: "100 – 499 pcs", price: 380 },
      { tier: "500 – 1,999 pcs", price: 320 },
      { tier: "2,000+ pcs", price: 270 },
    ],
  },
  {
    slug: "joggers-track-pants",
    name: "Joggers & Track Pants",
    category: "activewear",
    categoryLabel: "Activewear & Bottoms",
    subType: "jogger",
    isReadymade: true,
    shortDescription:
      "240–280 GSM French Terry / Interlock, Elastic waistband, Drawstring, Side zip pockets.",
    description:
      "Ergonomic activewear joggers crafted from 240–280 GSM French Terry. Includes high-grade elastic waistband with cord drawstrings, reinforced crotch gusset, deep side zip pockets, and snug ankle ribbing.",
    image: imgP5,
    galleryImages: [imgP5, imgJoggerNavy, imgJoggerDarkCharcoal],
    fabricTextureImage: imgP5,
    wholesalePrice: 250,
    unit: "piece",
    moq: 100,
    composition: "95% Cotton / 5% Spandex French Terry",
    gsm: "240–280 GSM",
    yarnCount: "30s/20s French Terry Loop Yarn",
    dyeingFinishing: "Silicon-softened, Bio-washed, High Elasticity Retention",
    printingCompatibility: "Thigh Screen Print, Reflective Heat Transfer, Zipper Tape Print",
    qualityParameters: "4-way recovery, Anti-bagging knee shape memory",
    samplePolicy: "Sample in 4–6 days. 100% refundable against initial production order.",
    customizationOptions: [
      "Custom Waterproof Side Zipper Tapes",
      "Custom Waistband Cord Color Matching",
      "Custom Woven Brand Labels",
      "Individual Polybag with Barcode Sticker",
    ],
    certifications: ["OEKO-TEX Standard 100", "ISO 9001 Certified Mill", "AQL 2.5 QC Standard"],
    colors: ["Heather Grey", "Dark Charcoal", "Navy"],
    colorSwatches: [
      { name: "Heather Grey", hex: "#D3D3D3" },
      { name: "Dark Charcoal", hex: "#2C2C2C" },
      { name: "Navy", hex: "#1B2A5A" },
    ],
    colorImages: {
      "Heather Grey": imgP5,
      Grey: imgP5,
      "Dark Charcoal": imgJoggerDarkCharcoal,
      Navy: imgJoggerNavy,
    },
    sizes: ["S", "M", "L", "XL", "2XL"],
    leadTime: "Sampling: 4–6 days | Bulk: 14–18 days",
    badge: "ACTIVE CHOICE",
    vendors: "Tirupur Hub",
    pricingTiers: [
      { tier: "100 – 499 pcs", price: 250 },
      { tier: "500 – 1,999 pcs", price: 200 },
      { tier: "2,000+ pcs", price: 165 },
    ],
  },
  {
    slug: "gym-workout-tees",
    name: "Gym / Workout T-Shirts",
    category: "gents",
    categoryLabel: "Gents & Activewear",
    subType: "dry-fit tee",
    isReadymade: true,
    shortDescription:
      "140–160 GSM Dry-Fit Polyester Spandex, Moisture-wicking treatment, Anti-microbial.",
    description:
      "Performance activewear gym tops crafted from 140–160 GSM lightweight micro-polyester spandex blend. Quick-dry moisture-wicking technology, anti-microbial finish, raglan sleeves, and flatlock anti-chafing seams.",
    image: imgP6,
    galleryImages: [imgP6, imgGymNavy, imgGymDarkCharcoal],
    fabricTextureImage: imgP6,
    wholesalePrice: 100,
    unit: "piece",
    moq: 200,
    composition: "92% Micro Polyester / 8% Spandex",
    gsm: "140–160 GSM",
    yarnCount: "75D Filament Micro Polyester",
    dyeingFinishing: "Wicking Finish, Anti-microbial Silver-ion Treatment",
    printingCompatibility: "Sublimation Printing, Reflective Logo Heat Transfer",
    qualityParameters: "Quick-dry under 15 mins, UPF 30+ UV protection",
    samplePolicy: "Rapid 3-day dry-fit sample kit with customized logo mockup.",
    customizationOptions: [
      "All-over Sublimation Print Customization",
      "Reflective Heat-seal Back Logo",
      "Custom Tagless Neck Heat Press Labels",
      "Eco-friendly Polybag Packaging",
    ],
    certifications: [
      "OEKO-TEX Standard 100",
      "ISO 14001 Environmental Audit",
      "AQL 2.5 QC Standard",
    ],
    colors: ["Stealth Black", "Navy", "Cool Grey", "Electric Blue"],
    colorSwatches: [
      { name: "Stealth Black", hex: "#121212" },
      { name: "Navy", hex: "#1B2A5A" },
      { name: "Cool Grey", hex: "#9BA2A9" },
    ],
    colorImages: {
      "Stealth Black": imgP6,
      Navy: imgGymNavy,
      "Cool Grey": imgGymDarkCharcoal,
    },
    sizes: ["S", "M", "L", "XL", "2XL"],
    leadTime: "Sampling: 3 days | Bulk: 10–14 days",
    badge: "HIGH DEMAND",
    vendors: "Tirupur Hub, Your Choice Garments",
    pricingTiers: [
      { tier: "200 – 499 pcs", price: 100 },
      { tier: "500 – 1,999 pcs", price: 75 },
      { tier: "2,000+ pcs", price: 55 },
    ],
  },
  {
    slug: "womens-leggings-treggings",
    name: "Women's Leggings & Treggings",
    category: "ladies",
    categoryLabel: "Ladies Wear",
    subType: "leggings",
    isReadymade: true,
    shortDescription: "200–220 GSM Cotton-Lycra, Ankle-length, Anti-chafing high waistband.",
    description:
      "Ultra-stretch 200–220 GSM Cotton-Lycra leggings for daily retail & activewear. Features 4-way stretch fabric, high-waist double elastic band, squat-proof opacity, and bio-polished anti-pilling finish.",
    image: imgP7,
    galleryImages: [imgP7, imgLeggingsNavyBlue, imgLeggingsMaroon],
    fabricTextureImage: imgP7,
    wholesalePrice: 140,
    unit: "piece",
    moq: 200,
    composition: "95% Combed Cotton / 5% Elastane (Lycra)",
    gsm: "200–220 GSM",
    yarnCount: "40s Combed Cotton + 40D Invista Lycra",
    dyeingFinishing: "High Opacity Bio-wash, Soft-touch Silicone Finish",
    printingCompatibility: "Waistband Print, Ankle Heat Transfer, Subtle Embroidery",
    qualityParameters: "Squat-proof non-see-through guarantee, 4-way elastic stretch",
    samplePolicy: "Sample pack available in 3 days. Refunded on first PO.",
    customizationOptions: [
      "Custom Waistband Width & Rise Height",
      "Custom Brand Woven Care Labels",
      "Custom Color Dyed Packs",
      "Individual Retail Hanger Packaging",
    ],
    certifications: ["OEKO-TEX Standard 100", "GOTS Organic Option", "AQL 2.5 QC Standard"],
    colors: ["Jet Black", "Navy Blue", "Maroon", "Skin/Nude", "White", "Bottle Green"],
    colorSwatches: [
      { name: "Jet Black", hex: "#0A0A0A" },
      { name: "Navy Blue", hex: "#1B2A5A" },
      { name: "Maroon", hex: "#5B1217" },
    ],
    colorImages: {
      "Jet Black": imgP7,
      "Navy Blue": imgLeggingsNavyBlue,
      Maroon: imgLeggingsMaroon,
    },
    sizes: ["Free Size", "L", "XL", "2XL", "3XL"],
    leadTime: "Sampling: 3 days | Bulk: 10–14 days",
    badge: "EVERYDAY ESSENTIAL",
    vendors: "Tirupur Hub, Sharva Textiles",
    pricingTiers: [
      { tier: "200 – 499 pcs", price: 140 },
      { tier: "500 – 1,999 pcs", price: 110 },
      { tier: "2,000+ pcs", price: 88 },
    ],
  },
  {
    slug: "baby-onesies-rompers",
    name: "Baby Onesies / Rompers",
    category: "kids",
    categoryLabel: "Kids & Baby Wear",
    subType: "onesie",
    isReadymade: true,
    shortDescription: "160–180 GSM GOTS Certified Organic Cotton, Nickel-free metal snaps.",
    description:
      "Ultra-gentle 160–180 GSM GOTS certified organic cotton baby onesies. Designed with envelope neck shoulders for quick dressing, nickel-free crotch snap fasteners, and non-toxic AZO-free dyes.",
    image: imgP8,
    galleryImages: [imgP8, imgBabySkyBlue, imgBabyPink],
    fabricTextureImage: imgP8,
    wholesalePrice: 90,
    unit: "piece",
    moq: 200,
    composition: "100% GOTS Certified Organic Cotton",
    gsm: "160–180 GSM",
    yarnCount: "40s Super Combed Organic Yarn",
    dyeingFinishing: "AZO-Free Eco Reactive Dyes, Enzyme Bio-polished",
    printingCompatibility: "Water-based Eco Print, Soft-touch Screen Print, Delicate Embroidery",
    qualityParameters: "Zero harsh chemicals, Hypoallergenic certified, Nickel-free hardware",
    samplePolicy: "Organic sample kit in 4 days with certification audit sheets.",
    customizationOptions: [
      "Custom Nickel-Free Metal Snap Fastener Colors",
      "Custom Organic Printed Labels",
      "Custom Baby Gift Box Packaging",
      "Custom Pantone Pastel Shade Matching",
    ],
    certifications: [
      "GOTS Organic Global Standard",
      "OEKO-TEX Class 1 Baby Certified",
      "AQL 2.5 QC Standard",
    ],
    colors: ["Orange", "Sky Blue", "Baby Pink"],
    colorSwatches: [
      { name: "Orange", hex: "#F26522" },
      { name: "Sky Blue", hex: "#BAE1FF" },
      { name: "Baby Pink", hex: "#FFB3BA" },
    ],
    colorImages: {
      Orange: imgP8,
      "Pastel Yellow": imgP8,
      "Sky Blue": imgBabySkyBlue,
      "Baby Pink": imgBabyPink,
    },
    sizes: ["0–3M", "3–6M", "6–12M", "12–18M"],
    leadTime: "Sampling: 4 days | Bulk: 12–16 days",
    badge: "ORGANIC COTTON",
    vendors: "Tirupur Hub, Mastermind International",
    pricingTiers: [
      { tier: "200 – 499 pcs", price: 90 },
      { tier: "500 – 1,999 pcs", price: 70 },
      { tier: "2,000+ pcs", price: 52 },
    ],
  },
  {
    slug: "mens-vests-undershirts",
    name: "Men's Vests / Undershirts",
    category: "innerwear",
    categoryLabel: "Innerwear & Vests",
    subType: "vest",
    isReadymade: true,
    shortDescription: "100% Fine Combed Rib Cotton, Breathable, Sweat-absorbent.",
    description:
      "Classic ribbed cotton men's vests manufactured from 100% fine combed 1x1 rib knit fabric. High moisture absorption, contoured athletic fit, tagless collar comfort, and reinforced armhole stitching.",
    image: imgVestWhite,
    galleryImages: [imgVestWhite, imgVestBlack, imgP9Spec],
    fabricTextureImage: imgP9Spec,
    wholesalePrice: 55,
    unit: "piece",
    moq: 300,
    composition: "100% Fine Combed Rib Cotton",
    gsm: "150–170 GSM",
    yarnCount: "40s 1x1 Fine Rib Combed Cotton",
    dyeingFinishing: "Bleached Optic White, Bio-washed, Absorbency Treated",
    printingCompatibility: "Heat Transfer Inner Branding, Chest Transfer Logo",
    qualityParameters: "Shape retention ribbing, High sweat absorption rate",
    samplePolicy: "Sample pack available in 2–3 days.",
    customizationOptions: [
      "Custom 2-Pack / 3-Pack Retail Boxes",
      "Custom Printed Elastic & Tagless Branding",
      "Custom Export Master Cartons",
    ],
    certifications: ["OEKO-TEX Standard 100", "ISO 9001 Certified Factory", "AQL 2.5 QC Standard"],
    colors: ["White", "Black"],
    colorSwatches: [
      { name: "White", hex: "#FFFFFF" },
      { name: "Black", hex: "#111111" },
    ],
    colorImages: {
      White: imgVestWhite,
      "Pure White": imgVestWhite,
      Black: imgVestBlack,
    },
    sizes: ["75 cm (XS)", "80 cm (S)", "85 cm (M)", "90 cm (L)", "95 cm (XL)", "100 cm (2XL)"],
    leadTime: "Sampling: 2–3 days | Bulk: 8–12 days",
    badge: "HIGH VOLUME",
    vendors: "K M Knitwear, Big Boss Men's Wear",
    pricingTiers: [
      { tier: "300 – 999 pcs", price: 55 },
      { tier: "1,000 – 4,999 pcs", price: 42 },
      { tier: "5,000+ pcs", price: 33 },
    ],
  },
  {
    slug: "single-jersey-fabric",
    name: "Single Jersey Fabric",
    category: "fabric",
    categoryLabel: "Raw Knitted Fabrics",
    subType: "knit fabric roll",
    isReadymade: false,
    shortDescription: "160–200 GSM 100% Combed Cotton, Open width or Tubular rolls.",
    description:
      "Premium 100% combed cotton single jersey knitted fabric rolls produced on German circular knitting machines. Pre-shrunk, bio-polished finish with zero spirality and excellent dimensional stability for garment stitching.",
    image: imgP10,
    galleryImages: [imgP10, imgSingleJerseyWhite, imgSingleJerseyNavy],
    fabricTextureImage: imgP10,
    wholesalePrice: 320,
    unit: "kg",
    moq: 100,
    composition: "100% Combed Cotton Single Jersey",
    gsm: "160–200 GSM",
    yarnCount: "30s Combed Compact Yarn",
    dyeingFinishing: "High Temperature Soft Dyeing, Bio-polished, Pre-shrunk",
    printingCompatibility:
      "Suitable for Screen Printing, Reactive Digital Printing, Sublimation Blends",
    qualityParameters: "Zero spirality (Under 2%), ISO Grade 4.5 Color Fastness",
    samplePolicy: "Fabric swatch hanger book & 1-meter sample roll in 3 days.",
    customizationOptions: [
      "Custom GSM (140 GSM to 240 GSM on order)",
      "Custom Tubular or Open Width Roll Dimensions",
      "Custom PMS Pantone Dye Matching",
      "Heavy Duty Plastic Roll Wrapping with Mill Barcode Tags",
    ],
    certifications: ["GOTS Organic Option", "OEKO-TEX Standard 100", "ISO 9001 Quality Control"],
    colors: ["Lavender", "White", "Navy Blue"],
    colorSwatches: [
      { name: "Lavender", hex: "#E6E6FA" },
      { name: "White", hex: "#FFFFFF" },
      { name: "Navy Blue", hex: "#162244" },
    ],
    colorImages: {
      Lavender: imgP10,
      "Raw Ecru": imgP10,
      White: imgSingleJerseyWhite,
      "Navy Blue": imgSingleJerseyNavy,
    },
    leadTime: "Sampling: 3 days | Bulk: 10–14 days",
    badge: "MILL ROLL",
    vendors: "Valliammai Fabrics, AKR Industries",
    pricingTiers: [
      { tier: "100 – 499 Kg", price: 320 },
      { tier: "500 – 1,999 Kg", price: 270 },
      { tier: "2,000+ Kg", price: 235 },
    ],
  },
];

// ── PUBLIC HELPERS ────────────────────────────────────────────────────────

export function getAllProducts(): Product[] {
  const map = new Map<string, Product>();
  staticProducts.forEach((p) => map.set(p.slug, p));
  getAdminProducts().forEach((p) => map.set(p.slug, p));
  return Array.from(map.values());
}

export function getProduct(slug: string): Product | undefined {
  return getAllProducts().find((p) => p.slug === slug);
}

export function getProductsByCategory(cat: string): Product[] {
  return getAllProducts().filter((p) => p.category === cat);
}

// Legacy compatibility exports
export const products = staticProducts;
export const categories = mainCategories.map((c) => ({
  slug: c.slug,
  label: c.label,
  blurb: c.blurb,
  image: c.image,
}));
