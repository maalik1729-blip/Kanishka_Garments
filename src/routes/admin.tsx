import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect, useCallback } from "react";
import {
  LogOut, Plus, Trash2, Package, Eye, EyeOff, LayoutDashboard,
  ShoppingBag, Users, TrendingUp, Save, X, Edit2, ChevronDown, ChevronUp
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  staticProducts, getAdminProducts, saveAdminProducts, retailCategories
} from "@/lib/products";
import type { Product } from "@/lib/products";
import { formatINR } from "@/lib/cart";

const ADMIN_AUTH_KEY = "KANISHKA_admin_auth";
const ADMIN_USER = "admin";
const ADMIN_PASS = "admin";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin — KANISHKA GARMENTS" },
      { robots: "noindex, nofollow" },
    ],
  }),
  component: AdminPage,
});

// ── TYPES ──────────────────────────────────────────────────────────────────
type NewProductForm = {
  name: string;
  category: Product["category"];
  categoryLabel: string;
  gender: string;
  occasion: string;
  shortDescription: string;
  description: string;
  imageUrl: string;
  wholesalePrice: string;
  unit: string;
  moq: string;
  composition: string;
  gsm: string;
  colors: string;
  sizes: string;
  leadTime: string;
  badge: string;
};

const EMPTY_FORM: NewProductForm = {
  name: "",
  category: "knitwear",
  categoryLabel: "Knitwear",
  gender: "",
  occasion: "",
  shortDescription: "",
  description: "",
  imageUrl: "",
  wholesalePrice: "",
  unit: "piece",
  moq: "",
  composition: "",
  gsm: "",
  colors: "",
  sizes: "",
  leadTime: "7–14 days",
  badge: "",
};

const categoryOptions: { value: Product["category"]; label: string }[] = [
  { value: "knitwear",      label: "Knitwear" },
  { value: "fabric",        label: "Fabric" },
  { value: "yarn",          label: "Yarn" },
  { value: "home-textiles", label: "Home Textiles" },
  { value: "ladies",        label: "Ladies" },
  { value: "gents",         label: "Gents" },
  { value: "boys",          label: "Boys" },
  { value: "girls",         label: "Girls" },
  { value: "kids",          label: "Kids (0–5 yr)" },
  { value: "elders",        label: "Elders" },
];

const occasionOptions = ["casual", "formal", "festival", "sportswear", "ethnic"];

// ── MAIN COMPONENT ─────────────────────────────────────────────────────────
function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const auth = sessionStorage.getItem(ADMIN_AUTH_KEY);
    if (auth === "true") setIsLoggedIn(true);
  }, []);

  const handleLogin = () => {
    sessionStorage.setItem(ADMIN_AUTH_KEY, "true");
    setIsLoggedIn(true);
  };
  const handleLogout = () => {
    sessionStorage.removeItem(ADMIN_AUTH_KEY);
    setIsLoggedIn(false);
    navigate({ to: "/" });
  };

  if (!isLoggedIn) return <LoginScreen onLogin={handleLogin} />;
  return <AdminDashboard onLogout={handleLogout} />;
}

// ── LOGIN SCREEN ───────────────────────────────────────────────────────────
function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setTimeout(() => {
      if (username === ADMIN_USER && password === ADMIN_PASS) {
        onLogin();
      } else {
        setError("Invalid username or password.");
        setLoading(false);
      }
    }, 600);
  };

  return (
    <div
      className="flex min-h-screen items-center justify-center"
      style={{ background: "linear-gradient(135deg, #0f1b3d 0%, #1e3a5f 60%, #3b6fa0 100%)" }}
    >
      {/* Blobs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full opacity-20 blur-3xl"
          style={{ background: "radial-gradient(circle, #3b6fa0, transparent)" }} />
        <div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full opacity-20 blur-3xl"
          style={{ background: "radial-gradient(circle, #1e3a5f, transparent)" }} />
      </div>

      <div className="relative z-10 w-full max-w-md px-4">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl">
          {/* Logo */}
          <div className="mb-8 flex flex-col items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-white text-ink font-display font-bold text-sm shadow-lg">
              KG
            </div>
            <div className="text-center">
              <div className="font-display text-xl font-bold text-white">KANISHKA GARMENTS</div>
              <div className="text-xs uppercase tracking-widest text-white/50 mt-0.5">Admin Portal</div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-white/60">
                Username
              </label>
              <input
                id="admin-username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                autoComplete="username"
                className="w-full rounded-lg border border-white/20 bg-white/10 px-4 py-3 text-white placeholder-white/30 outline-none transition focus:border-white/60 focus:bg-white/15"
                required
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-white/60">
                Password
              </label>
              <div className="relative">
                <input
                  id="admin-password"
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  autoComplete="current-password"
                  className="w-full rounded-lg border border-white/20 bg-white/10 px-4 py-3 pr-12 text-white placeholder-white/30 outline-none transition focus:border-white/60 focus:bg-white/15"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70"
                >
                  {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="rounded-lg bg-red-500/20 border border-red-500/30 px-4 py-2.5 text-sm text-red-300">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full rounded-lg bg-white py-3 text-sm font-bold text-ink transition hover:bg-white/90 disabled:opacity-60"
            >
              {loading ? "Signing in…" : "Sign In"}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-white/30">
            KANISHKA GARMENTS Admin · Tirupur, India
          </p>
        </div>
      </div>
    </div>
  );
}

// ── ADMIN DASHBOARD ────────────────────────────────────────────────────────
function AdminDashboard({ onLogout }: { onLogout: () => void }) {
  const [adminProducts, setAdminProducts] = useState<Product[]>([]);
  const [activeTab, setActiveTab] = useState<"dashboard" | "add" | "manage">("dashboard");
  const [form, setForm] = useState<NewProductForm>(EMPTY_FORM);
  const [formError, setFormError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [expandedSlug, setExpandedSlug] = useState<string | null>(null);

  useEffect(() => {
    setAdminProducts(getAdminProducts());
  }, []);

  const allProducts = [...staticProducts, ...adminProducts];
  const totalProducts = allProducts.length;
  const totalCategories = new Set(allProducts.map((p) => p.category)).size;

  // ── FORM HANDLERS ────────────────────────────────────────────────────────
  const updateForm = (field: keyof NewProductForm, value: string) => {
    setForm((prev) => {
      const updated = { ...prev, [field]: value };
      // Auto-set categoryLabel when category changes
      if (field === "category") {
        const found = categoryOptions.find((c) => c.value === value);
        updated.categoryLabel = found?.label ?? value;
      }
      return updated;
    });
  };

  const resetForm = () => {
    setForm(EMPTY_FORM);
    setEditingSlug(null);
    setFormError("");
    setSuccessMsg("");
  };

  const handleSaveProduct = () => {
    setFormError("");
    setSuccessMsg("");

    if (!form.name.trim()) return setFormError("Product name is required.");
    if (!form.wholesalePrice || isNaN(Number(form.wholesalePrice))) return setFormError("Valid wholesale price is required.");
    if (!form.moq || isNaN(Number(form.moq))) return setFormError("Valid MOQ is required.");
    if (!form.shortDescription.trim()) return setFormError("Short description is required.");
    if (!form.composition.trim()) return setFormError("Composition is required.");

    const slug = editingSlug ?? form.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") + "-" + Date.now();
    const colorsArr = form.colors.split(",").map((c) => c.trim()).filter(Boolean);
    const sizesArr = form.sizes ? form.sizes.split(",").map((s) => s.trim()).filter(Boolean) : undefined;

    const newProduct: Product = {
      slug,
      name: form.name.trim(),
      category: form.category,
      categoryLabel: form.categoryLabel,
      gender: form.gender as Product["gender"] || undefined,
      occasion: form.occasion as Product["occasion"] || undefined,
      shortDescription: form.shortDescription.trim(),
      description: form.description.trim() || form.shortDescription.trim(),
      image: form.imageUrl.trim() || "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800&q=80",
      wholesalePrice: Number(form.wholesalePrice),
      unit: form.unit,
      moq: Number(form.moq),
      composition: form.composition.trim(),
      gsm: form.gsm.trim() || undefined,
      colors: colorsArr.length ? colorsArr : ["Custom shades"],
      sizes: sizesArr,
      leadTime: form.leadTime.trim() || "7–14 days",
      badge: form.badge.trim() || undefined,
      isAdminAdded: true,
    };

    let updated: Product[];
    if (editingSlug) {
      updated = adminProducts.map((p) => (p.slug === editingSlug ? newProduct : p));
      setSuccessMsg(`✅ Product "${newProduct.name}" updated successfully!`);
    } else {
      updated = [...adminProducts, newProduct];
      setSuccessMsg(`✅ Product "${newProduct.name}" added! It is now visible in the catalog.`);
    }

    saveAdminProducts(updated);
    setAdminProducts(updated);
    resetForm();
    setActiveTab("manage");
  };

  const handleEditProduct = (product: Product) => {
    setForm({
      name: product.name,
      category: product.category,
      categoryLabel: product.categoryLabel,
      gender: product.gender ?? "",
      occasion: product.occasion ?? "",
      shortDescription: product.shortDescription,
      description: product.description,
      imageUrl: product.image.startsWith("http") ? product.image : "",
      wholesalePrice: String(product.wholesalePrice),
      unit: product.unit,
      moq: String(product.moq),
      composition: product.composition,
      gsm: product.gsm ?? "",
      colors: product.colors.join(", "),
      sizes: product.sizes?.join(", ") ?? "",
      leadTime: product.leadTime,
      badge: product.badge ?? "",
    });
    setEditingSlug(product.slug);
    setActiveTab("add");
  };

  const handleDeleteProduct = (slug: string) => {
    const updated = adminProducts.filter((p) => p.slug !== slug);
    saveAdminProducts(updated);
    setAdminProducts(updated);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* ── SIDEBAR ──────────────────────────────────────────────────────── */}
      <aside className="fixed left-0 top-0 z-30 flex h-screen w-64 flex-col border-r border-border bg-ink text-brand-foreground shadow-xl">
        {/* Logo */}
        <div className="flex items-center gap-3 border-b border-white/10 px-5 py-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-ink font-display font-bold text-[11px]">KG</div>
          <div>
            <div className="font-display text-sm font-bold">KANISHKA GARMENTS</div>
            <div className="text-[10px] uppercase tracking-widest text-white/40">Admin Panel</div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-1 p-3 pt-4">
          {[
            { id: "dashboard" as const, label: "Dashboard", icon: LayoutDashboard },
            { id: "add" as const, label: editingSlug ? "Edit Product" : "Add Product", icon: Plus },
            { id: "manage" as const, label: "Manage Products", icon: Package },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => { setActiveTab(item.id); if (item.id !== "add") resetForm(); }}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                activeTab === item.id
                  ? "bg-white/15 text-white"
                  : "text-white/60 hover:bg-white/10 hover:text-white"
              }`}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
              {item.id === "manage" && adminProducts.length > 0 && (
                <span className="ml-auto rounded-full bg-brand px-2 py-0.5 text-[10px] font-bold text-white">
                  {adminProducts.length}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* View site link */}
        <div className="border-t border-white/10 p-3 space-y-2">
          <a
            href="/products"
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-white/50 hover:bg-white/10 hover:text-white transition-colors"
          >
            <Eye className="h-3.5 w-3.5" /> View Live Site
          </a>
          <button
            onClick={onLogout}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-white/50 hover:bg-red-500/20 hover:text-red-400 transition-colors"
          >
            <LogOut className="h-3.5 w-3.5" /> Sign Out
          </button>
        </div>
      </aside>

      {/* ── MAIN CONTENT ─────────────────────────────────────────────────── */}
      <main className="ml-64 flex-1 overflow-auto">
        {/* Topbar */}
        <div className="sticky top-0 z-20 border-b border-border bg-white/90 backdrop-blur">
          <div className="flex h-14 items-center justify-between px-6">
            <h1 className="font-display text-lg font-bold text-ink capitalize">
              {activeTab === "add" ? (editingSlug ? "Edit Product" : "Add New Product") : activeTab}
            </h1>
            <div className="flex items-center gap-4">
              <div className="text-xs text-muted-foreground hidden sm:block">
                Signed in as <span className="font-semibold text-ink">admin</span>
              </div>
              <button
                onClick={onLogout}
                className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-100 hover:text-red-700"
              >
                <LogOut className="h-3.5 w-3.5" /> Sign Out
              </button>
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* ── DASHBOARD TAB ────────────────────────────────────────────── */}
          {activeTab === "dashboard" && (
            <div className="space-y-6">
              {/* Stat cards */}
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  { label: "Total Products", value: totalProducts, icon: ShoppingBag, color: "#3b6fa0" },
                  { label: "Admin Added", value: adminProducts.length, icon: Plus, color: "#10b981" },
                  { label: "Static Products", value: staticProducts.length, icon: Package, color: "#f59e0b" },
                  { label: "Categories", value: totalCategories, icon: Users, color: "#8b5cf6" },
                ].map((stat) => (
                  <div key={stat.label} className="rounded-xl border border-border bg-white p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-medium text-muted-foreground">{stat.label}</div>
                      <div className="rounded-lg p-2" style={{ backgroundColor: stat.color + "18" }}>
                        <stat.icon className="h-4 w-4" style={{ color: stat.color }} />
                      </div>
                    </div>
                    <div className="mt-2 font-display text-3xl font-bold text-ink">{stat.value}</div>
                  </div>
                ))}
              </div>

              {/* Quick actions */}
              <div className="rounded-xl border border-border bg-white p-6 shadow-sm">
                <h2 className="font-display text-base font-bold text-ink mb-4">Quick Actions</h2>
                <div className="flex flex-wrap gap-3">
                  <Button onClick={() => setActiveTab("add")} className="gap-2">
                    <Plus className="h-4 w-4" /> Add New Product
                  </Button>
                  <Button onClick={() => setActiveTab("manage")} variant="outline" className="gap-2">
                    <Package className="h-4 w-4" /> Manage Products ({adminProducts.length})
                  </Button>
                  <Button asChild variant="outline" className="gap-2">
                    <a href="/products" target="_blank" rel="noopener noreferrer">
                      <Eye className="h-4 w-4" /> View Catalog
                    </a>
                  </Button>
                </div>
              </div>

              {/* Recent admin products */}
              {adminProducts.length > 0 && (
                <div className="rounded-xl border border-border bg-white shadow-sm">
                  <div className="border-b border-border px-6 py-4">
                    <h2 className="font-display text-base font-bold text-ink">Recently Added by Admin</h2>
                  </div>
                  <div className="divide-y divide-border">
                    {adminProducts.slice(-5).reverse().map((p) => (
                      <div key={p.slug} className="flex items-center justify-between px-6 py-3">
                        <div>
                          <div className="text-sm font-semibold text-ink">{p.name}</div>
                          <div className="text-xs text-muted-foreground">{p.categoryLabel} · MOQ {p.moq} {p.unit}s</div>
                        </div>
                        <div className="font-display text-sm font-bold text-ink">{formatINR(p.wholesalePrice)}/{p.unit}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {adminProducts.length === 0 && (
                <div className="rounded-xl border border-dashed border-border bg-white p-12 text-center">
                  <TrendingUp className="mx-auto h-10 w-10 text-muted-foreground/40 mb-3" />
                  <p className="font-semibold text-ink">No products added yet</p>
                  <p className="text-sm text-muted-foreground mt-1">Use "Add Product" to add your first product — it'll appear live on the site immediately.</p>
                  <Button className="mt-4" onClick={() => setActiveTab("add")}>
                    <Plus className="mr-2 h-4 w-4" /> Add First Product
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* ── ADD / EDIT PRODUCT TAB ────────────────────────────────────── */}
          {activeTab === "add" && (
            <div className="max-w-2xl space-y-6">
              {successMsg && (
                <div className="rounded-xl border border-green-200 bg-green-50 px-5 py-3 text-sm font-medium text-green-800 flex items-center justify-between">
                  {successMsg}
                  <button onClick={() => setSuccessMsg("")}><X className="h-4 w-4" /></button>
                </div>
              )}
              {formError && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-5 py-3 text-sm font-medium text-red-800 flex items-center justify-between">
                  {formError}
                  <button onClick={() => setFormError("")}><X className="h-4 w-4" /></button>
                </div>
              )}

              <div className="rounded-xl border border-border bg-white p-6 shadow-sm space-y-5">
                <h2 className="font-display font-bold text-ink text-base">Basic Information</h2>

                <FormField label="Product Name *">
                  <input id="prod-name" value={form.name} onChange={(e) => updateForm("name", e.target.value)} placeholder="e.g. Premium Cotton Kurti" className={inputCls} required />
                </FormField>

                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField label="Category *">
                    <select id="prod-category" value={form.category} onChange={(e) => updateForm("category", e.target.value)} className={inputCls}>
                      {categoryOptions.map((c) => (
                        <option key={c.value} value={c.value}>{c.label}</option>
                      ))}
                    </select>
                  </FormField>

                  <FormField label="Occasion">
                    <select id="prod-occasion" value={form.occasion} onChange={(e) => updateForm("occasion", e.target.value)} className={inputCls}>
                      <option value="">— None —</option>
                      {occasionOptions.map((o) => (
                        <option key={o} value={o}>{o.charAt(0).toUpperCase() + o.slice(1)}</option>
                      ))}
                    </select>
                  </FormField>
                </div>

                <FormField label="Short Description *">
                  <input id="prod-short-desc" value={form.shortDescription} onChange={(e) => updateForm("shortDescription", e.target.value)} placeholder="One-line summary for product cards" className={inputCls} />
                </FormField>

                <FormField label="Full Description">
                  <textarea id="prod-desc" value={form.description} onChange={(e) => updateForm("description", e.target.value)} placeholder="Detailed product description" rows={3} className={inputCls} />
                </FormField>

                <FormField label="Product Image URL">
                  <input id="prod-image" type="url" value={form.imageUrl} onChange={(e) => updateForm("imageUrl", e.target.value)} placeholder="https://example.com/image.jpg (leave blank for default)" className={inputCls} />
                  {form.imageUrl && (
                    <img src={form.imageUrl} alt="Preview" className="mt-2 h-24 w-24 rounded-lg object-cover border border-border" onError={(e) => (e.currentTarget.style.display = "none")} />
                  )}
                </FormField>
              </div>

              <div className="rounded-xl border border-border bg-white p-6 shadow-sm space-y-5">
                <h2 className="font-display font-bold text-ink text-base">Pricing & MOQ</h2>

                <div className="grid gap-4 sm:grid-cols-3">
                  <FormField label="Wholesale Price (₹) *">
                    <input id="prod-price" type="number" min="0" value={form.wholesalePrice} onChange={(e) => updateForm("wholesalePrice", e.target.value)} placeholder="e.g. 350" className={inputCls} />
                  </FormField>
                  <FormField label="Unit *">
                    <select id="prod-unit" value={form.unit} onChange={(e) => updateForm("unit", e.target.value)} className={inputCls}>
                      {["piece", "set", "kg", "meter", "dozen"].map((u) => (
                        <option key={u} value={u}>{u}</option>
                      ))}
                    </select>
                  </FormField>
                  <FormField label="MOQ *">
                    <input id="prod-moq" type="number" min="1" value={form.moq} onChange={(e) => updateForm("moq", e.target.value)} placeholder="e.g. 100" className={inputCls} />
                  </FormField>
                </div>
              </div>

              <div className="rounded-xl border border-border bg-white p-6 shadow-sm space-y-5">
                <h2 className="font-display font-bold text-ink text-base">Product Details</h2>

                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField label="Composition *">
                    <input id="prod-comp" value={form.composition} onChange={(e) => updateForm("composition", e.target.value)} placeholder="e.g. 100% Cotton" className={inputCls} />
                  </FormField>
                  <FormField label="GSM (optional)">
                    <input id="prod-gsm" value={form.gsm} onChange={(e) => updateForm("gsm", e.target.value)} placeholder="e.g. 180 GSM" className={inputCls} />
                  </FormField>
                </div>

                <FormField label="Colors (comma-separated)">
                  <input id="prod-colors" value={form.colors} onChange={(e) => updateForm("colors", e.target.value)} placeholder="e.g. Red, Blue, Green, White" className={inputCls} />
                </FormField>

                <FormField label="Sizes (comma-separated, optional)">
                  <input id="prod-sizes" value={form.sizes} onChange={(e) => updateForm("sizes", e.target.value)} placeholder="e.g. S, M, L, XL, XXL or 2Y, 4Y, 6Y" className={inputCls} />
                </FormField>

                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField label="Lead Time">
                    <input id="prod-lead" value={form.leadTime} onChange={(e) => updateForm("leadTime", e.target.value)} placeholder="e.g. 7–14 days" className={inputCls} />
                  </FormField>
                  <FormField label="Badge (optional)">
                    <input id="prod-badge" value={form.badge} onChange={(e) => updateForm("badge", e.target.value)} placeholder="e.g. New, Festival, Best seller" className={inputCls} />
                  </FormField>
                </div>
              </div>

              <div className="flex gap-3">
                <Button onClick={handleSaveProduct} className="flex-1 gap-2" size="lg">
                  <Save className="h-4 w-4" />
                  {editingSlug ? "Update Product" : "Add Product to Catalog"}
                </Button>
                <Button onClick={resetForm} variant="outline" size="lg">
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {/* ── MANAGE PRODUCTS TAB ──────────────────────────────────────── */}
          {activeTab === "manage" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  {adminProducts.length === 0
                    ? "No products added yet via admin."
                    : `${adminProducts.length} product${adminProducts.length > 1 ? "s" : ""} added by admin. All are live in the catalog.`}
                </p>
                <Button onClick={() => { resetForm(); setActiveTab("add"); }} size="sm" className="gap-1">
                  <Plus className="h-3.5 w-3.5" /> Add Product
                </Button>
              </div>

              {adminProducts.length === 0 ? (
                <div className="rounded-xl border border-dashed border-border bg-white p-16 text-center">
                  <Package className="mx-auto h-10 w-10 text-muted-foreground/40 mb-3" />
                  <p className="font-semibold text-ink">No admin products yet</p>
                  <p className="text-sm text-muted-foreground mt-1">Products you add will appear here and instantly on the live site.</p>
                </div>
              ) : (
                <div className="rounded-xl border border-border bg-white shadow-sm overflow-hidden">
                  <div className="grid grid-cols-[1fr_auto_auto_auto] gap-3 border-b border-border bg-gray-50 px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                    <div>Product</div>
                    <div>Price</div>
                    <div>MOQ</div>
                    <div>Actions</div>
                  </div>
                  <div className="divide-y divide-border">
                    {adminProducts.map((p) => (
                      <div key={p.slug}>
                        <div className="grid grid-cols-[1fr_auto_auto_auto] items-center gap-3 px-5 py-4">
                          <div className="flex items-center gap-3 min-w-0">
                            <img
                              src={p.image.startsWith("http") ? p.image : "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=80&q=60"}
                              alt=""
                              className="h-10 w-10 flex-shrink-0 rounded-lg object-cover border border-border"
                              onError={(e) => (e.currentTarget.src = "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=80&q=60")}
                            />
                            <div className="min-w-0">
                              <div className="truncate font-semibold text-ink text-sm">{p.name}</div>
                              <div className="text-[11px] text-muted-foreground">{p.categoryLabel}{p.badge ? ` · ${p.badge}` : ""}</div>
                            </div>
                          </div>
                          <div className="text-sm font-bold text-ink whitespace-nowrap">{formatINR(p.wholesalePrice)}/{p.unit}</div>
                          <div className="text-sm text-muted-foreground whitespace-nowrap">{p.moq} {p.unit}s</div>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => setExpandedSlug(expandedSlug === p.slug ? null : p.slug)}
                              className="rounded-md p-1.5 text-muted-foreground hover:bg-gray-100 hover:text-ink transition-colors"
                              title="Details"
                            >
                              {expandedSlug === p.slug ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                            </button>
                            <button
                              onClick={() => handleEditProduct(p)}
                              className="rounded-md p-1.5 text-blue-500 hover:bg-blue-50 transition-colors"
                              title="Edit"
                            >
                              <Edit2 className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(p.slug)}
                              className="rounded-md p-1.5 text-red-500 hover:bg-red-50 transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>

                        {/* Expanded row */}
                        {expandedSlug === p.slug && (
                          <div className="border-t border-border bg-gray-50 px-5 py-4 text-sm text-muted-foreground space-y-1">
                            <p><span className="font-medium text-ink">Description:</span> {p.shortDescription}</p>
                            <p><span className="font-medium text-ink">Colors:</span> {p.colors.join(", ")}</p>
                            {p.sizes && <p><span className="font-medium text-ink">Sizes:</span> {p.sizes.join(", ")}</p>}
                            <p><span className="font-medium text-ink">Composition:</span> {p.composition}</p>
                            <p><span className="font-medium text-ink">Lead Time:</span> {p.leadTime}</p>
                            <a
                              href={`/products/${p.slug}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 mt-2 text-brand hover:underline"
                            >
                              <Eye className="h-3.5 w-3.5" /> View on site
                            </a>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Also show static products (read-only) */}
              <div className="rounded-xl border border-border bg-white shadow-sm overflow-hidden mt-6">
                <div className="border-b border-border px-5 py-3 flex items-center justify-between">
                  <h3 className="font-display text-sm font-bold text-ink">Static (Built-in) Products</h3>
                  <span className="text-xs text-muted-foreground">{staticProducts.length} products · read-only</span>
                </div>
                <div className="divide-y divide-border max-h-64 overflow-y-auto">
                  {staticProducts.map((p) => (
                    <div key={p.slug} className="flex items-center justify-between px-5 py-3">
                      <div>
                        <div className="text-sm font-medium text-ink">{p.name}</div>
                        <div className="text-[11px] text-muted-foreground">{p.categoryLabel}</div>
                      </div>
                      <div className="text-sm text-muted-foreground">{formatINR(p.wholesalePrice)}/{p.unit}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

// ── HELPERS ────────────────────────────────────────────────────────────────
const inputCls = "w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-ink outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20";

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </label>
      {children}
    </div>
  );
}

