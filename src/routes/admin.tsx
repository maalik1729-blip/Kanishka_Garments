import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import React, { useState, useEffect, useMemo } from "react";
import {
  LogOut,
  Plus,
  Trash2,
  Package,
  Eye,
  EyeOff,
  LayoutDashboard,
  ShoppingBag,
  Save,
  Edit2,
  ChevronDown,
  ChevronUp,
  ArrowLeft,
  Menu,
  Shield,
  Lock,
  Key,
  Search,
  Sparkles,
  Layers,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Filter,
  RotateCcw,
  X,
  MessageSquare,
  Upload,
  Loader2,
  Image as ImageIcon,
  Building2,
  CreditCard,
  Copy,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  staticProducts,
  getAdminProducts,
  saveAdminProducts,
  fetchAdminProductsApi,
  saveAdminProductApi,
  deleteAdminProductApi,
} from "@/lib/products";
import type { Product } from "@/lib/products";
import { formatINR } from "@/lib/utils";
import {
  getQuoteRequests,
  updateQuoteStatus,
  deleteQuoteRequest,
  fetchQuoteRequestsApi,
  updateQuoteStatusApi,
  deleteQuoteRequestApi,
} from "@/lib/quotes";
import type { QuoteRequest } from "@/lib/quotes";

const ADMIN_AUTH_KEY = "KANISHKA_admin_auth";
const ADMIN_USER = "admin";

// ── SECURITY & RATE LIMITING UTILITIES ──────────────────────────────────
const ADMIN_PASS_HASH_KEY = "KANISHKA_admin_pass_hash";
const DEFAULT_PASS_HASH = "8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918"; // SHA-256 of "admin"

const RATE_LIMIT_SETTINGS_KEY = "KANISHKA_rate_limit_settings";
const RATE_LIMIT_LOCKOUT_KEY = "KANISHKA_rate_limit_lockout";
const RATE_LIMIT_ATTEMPTS_KEY = "KANISHKA_rate_limit_attempts";

export async function sha256(message: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

export type RateLimitSettings = {
  maxAttempts: number;
  lockoutDurationMinutes: number;
  idleTimeoutMinutes: number;
};

export function getRateLimitSettings(): RateLimitSettings {
  if (typeof window === "undefined")
    return { maxAttempts: 5, lockoutDurationMinutes: 15, idleTimeoutMinutes: 30 };
  try {
    const raw = localStorage.getItem(RATE_LIMIT_SETTINGS_KEY);
    return raw
      ? { idleTimeoutMinutes: 30, ...JSON.parse(raw) }
      : { maxAttempts: 5, lockoutDurationMinutes: 15, idleTimeoutMinutes: 30 };
  } catch {
    return { maxAttempts: 5, lockoutDurationMinutes: 15, idleTimeoutMinutes: 30 };
  }
}

export function saveRateLimitSettings(settings: RateLimitSettings) {
  try {
    localStorage.setItem(RATE_LIMIT_SETTINGS_KEY, JSON.stringify(settings));
  } catch (err) {
    console.warn("Failed to save rate limit settings to LocalStorage:", err);
  }
}

export function getStoredPasswordHash(): string {
  if (typeof window === "undefined") return DEFAULT_PASS_HASH;
  return localStorage.getItem(ADMIN_PASS_HASH_KEY) || DEFAULT_PASS_HASH;
}

export function saveStoredPasswordHash(hash: string) {
  try {
    localStorage.setItem(ADMIN_PASS_HASH_KEY, hash);
  } catch (err) {
    console.warn("Failed to save stored password hash to LocalStorage:", err);
  }
}

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [{ title: "Admin Portal — KANISHKA GARMENTS" }, { robots: "noindex, nofollow" }],
  }),
  component: AdminPage,
});

// ── FORM TYPES & INITIAL STATE ─────────────────────────────────────────────
type NewProductForm = {
  name: string;
  category: Product["category"];
  categoryLabel: string;
  subType: string;
  isReadymade: string;
  shortDescription: string;
  description: string;
  imageUrl: string;
  wholesalePrice: string;
  unit: string;
  moq: string;
  composition: string;
  gsm: string;
  yarnCount: string;
  dyeingFinishing: string;
  printingCompatibility: string;
  qualityParameters: string;
  colors: string;
  sizes: string;
  leadTime: string;
  badge: string;
  vendors: string;
};

const EMPTY_FORM: NewProductForm = {
  name: "",
  category: "gents",
  categoryLabel: "Gents & Unisex Wear",
  subType: "t-shirt",
  isReadymade: "readymade",
  shortDescription: "",
  description: "",
  imageUrl: "",
  wholesalePrice: "",
  unit: "piece",
  moq: "",
  composition: "",
  gsm: "",
  yarnCount: "",
  dyeingFinishing: "",
  printingCompatibility: "",
  qualityParameters: "",
  colors: "",
  sizes: "",
  leadTime: "7–14 days",
  badge: "",
  vendors: "",
};

const categoryOptions: { value: Product["category"]; label: string }[] = [
  { value: "gents", label: "Gents & Unisex Wear" },
  { value: "ladies", label: "Ladies Wear" },
  { value: "activewear", label: "Activewear" },
  { value: "sweats", label: "Sweats & Hoodies" },
  { value: "kids", label: "Kids & Baby Wear" },
  { value: "innerwear", label: "Innerwear & Vests" },
  { value: "fabric", label: "Raw Knitted Fabrics" },
  { value: "knitwear", label: "Knitwear" },
  { value: "home-textiles", label: "Home Textiles" },
  { value: "yarn", label: "Yarn" },
  { value: "boys", label: "Boys" },
  { value: "girls", label: "Girls" },
  { value: "elders", label: "Elders" },
];

// ── MAIN WRAPPER COMPONENT ─────────────────────────────────────────────────
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

  // Rate limit & lockout state
  const [lockoutUntil, setLockoutUntil] = useState<number>(() => {
    if (typeof window === "undefined") return 0;
    const raw = localStorage.getItem(RATE_LIMIT_LOCKOUT_KEY);
    return raw ? Number(raw) : 0;
  });
  const [remainingLockoutSec, setRemainingLockoutSec] = useState<number>(0);
  const [failedAttempts, setFailedAttempts] = useState<number>(() => {
    if (typeof window === "undefined") return 0;
    const raw = localStorage.getItem(RATE_LIMIT_ATTEMPTS_KEY);
    return raw ? Number(raw) : 0;
  });

  // Countdown timer for active lockout
  useEffect(() => {
    if (lockoutUntil > Date.now()) {
      const updateTimer = () => {
        const remaining = Math.max(0, Math.ceil((lockoutUntil - Date.now()) / 1000));
        setRemainingLockoutSec(remaining);
        if (remaining <= 0) {
          setLockoutUntil(0);
          localStorage.removeItem(RATE_LIMIT_LOCKOUT_KEY);
          setFailedAttempts(0);
          localStorage.setItem(RATE_LIMIT_ATTEMPTS_KEY, "0");
        }
      };
      updateTimer();
      const interval = setInterval(updateTimer, 1000);
      return () => clearInterval(interval);
    } else {
      setRemainingLockoutSec(0);
    }
  }, [lockoutUntil]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (lockoutUntil > Date.now()) return;

    setLoading(true);
    const settings = getRateLimitSettings();
    const storedHash = getStoredPasswordHash();
    const enteredHash = await sha256(password);

    setTimeout(() => {
      if (username === ADMIN_USER && enteredHash === storedHash) {
        localStorage.setItem(RATE_LIMIT_ATTEMPTS_KEY, "0");
        localStorage.removeItem(RATE_LIMIT_LOCKOUT_KEY);
        onLogin();
      } else {
        const newAttempts = failedAttempts + 1;
        setFailedAttempts(newAttempts);
        localStorage.setItem(RATE_LIMIT_ATTEMPTS_KEY, String(newAttempts));

        if (newAttempts >= settings.maxAttempts) {
          const lockTime = Date.now() + settings.lockoutDurationMinutes * 60 * 1000;
          setLockoutUntil(lockTime);
          localStorage.setItem(RATE_LIMIT_LOCKOUT_KEY, String(lockTime));
          setError(
            `Too many failed login attempts (${newAttempts}/${settings.maxAttempts}). Account locked for ${settings.lockoutDurationMinutes}m.`,
          );
        } else {
          const remainingAttempts = settings.maxAttempts - newAttempts;
          setError(
            `Invalid username or password. (${remainingAttempts} attempt${remainingAttempts > 1 ? "s" : ""} remaining)`,
          );
        }
        setLoading(false);
      }
    }, 600);
  };

  const isLockedOut = lockoutUntil > Date.now();

  return (
    <div className="relative flex min-h-screen items-center justify-center p-4 bg-slate-950 overflow-hidden font-sans text-slate-100">
      {/* Background Soft Glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-1/3 left-1/3 h-96 w-96 rounded-full bg-slate-800/40 blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-8 shadow-2xl backdrop-blur-xl">
          {/* Logo & Header */}
          <div className="mb-8 text-center space-y-3">
            <img
              src="/logo.svg"
              alt="KANISHKA GARMENTS Logo"
              className="mx-auto h-20 w-auto object-contain rounded-2xl shadow-lg border border-slate-700 bg-white p-1"
            />
            <div>
              <h1 className="font-display text-xl font-bold tracking-wider text-white uppercase">
                KANISHKA GARMENTS
              </h1>
              <p className="text-xs uppercase tracking-widest text-slate-400 mt-1">
                Management Portal
              </p>
            </div>
          </div>

          {/* Active Lockout Alert */}
          {isLockedOut && (
            <div className="mb-6 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-xs text-amber-300 space-y-1">
              <div className="font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
                <Shield className="h-4 w-4" /> Account Temporarily Locked
              </div>
              <p className="text-amber-200/90 leading-relaxed">
                Too many failed attempts. Try again in{" "}
                <span className="font-mono font-bold text-white text-sm">
                  {Math.floor(remainingLockoutSec / 60)}m {remainingLockoutSec % 60}s
                </span>
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400">
                Username
              </label>
              <input
                id="admin-username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter admin username"
                autoComplete="username"
                disabled={isLockedOut}
                className="w-full rounded-xl border border-slate-700 bg-slate-800/80 px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-400/20 disabled:opacity-50"
                required
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400">
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
                  disabled={isLockedOut}
                  className="w-full rounded-xl border border-slate-700 bg-slate-800/80 px-4 py-3 pr-12 text-sm text-white placeholder-slate-500 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-400/20 disabled:opacity-50"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  disabled={isLockedOut}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 disabled:opacity-50"
                >
                  {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {error && !isLockedOut && (
              <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3.5 text-xs text-rose-300 flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || isLockedOut}
              className="mt-2 w-full rounded-xl bg-white py-3 text-sm font-bold text-slate-950 shadow-md transition hover:bg-slate-100 active:scale-[0.99] disabled:opacity-50 cursor-pointer"
            >
              {loading
                ? "Verifying Credentials…"
                : isLockedOut
                  ? "Account Locked"
                  : "Sign In to Dashboard"}
            </button>
          </form>

          <div className="mt-8 flex items-center justify-between border-t border-slate-800 pt-4 text-[11px] text-slate-500">
            <span>Secure Authentication</span>
            <span className="flex items-center gap-1 text-slate-300 font-medium">
              <Shield className="h-3.5 w-3.5 text-slate-400" /> Rate Limited
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── ADMIN DASHBOARD ────────────────────────────────────────────────────────
function AdminDashboard({ onLogout }: { onLogout: () => void }) {
  const [adminProducts, setAdminProducts] = useState<Product[]>([]);
  const [quotes, setQuotes] = useState<QuoteRequest[]>([]);
  const [activeTab, setActiveTab] = useState<
    "dashboard" | "add" | "manage" | "quotes" | "settings"
  >("dashboard");
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [form, setForm] = useState<NewProductForm>(EMPTY_FORM);
  const [formError, setFormError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [expandedSlug, setExpandedSlug] = useState<string | null>(null);

  // Cloudinary image file upload state
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadProgress, setUploadProgress] = useState("");

  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    setUploadProgress("Uploading photo to Cloudinary...");
    setFormError("");

    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Data = reader.result as string;
        const res = await fetch("/api/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image: base64Data }),
        });
        const data = await res.json();
        if (res.ok && data.url) {
          updateForm("imageUrl", data.url);
          setUploadProgress("✅ Photo uploaded to Cloudinary!");
        } else {
          setFormError(data.error || "Image upload to Cloudinary failed");
          setUploadProgress("");
        }
        setUploadingImage(false);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error("Cloudinary upload failed", err);
      setFormError("Failed to upload image file to Cloudinary");
      setUploadingImage(false);
      setUploadProgress("");
    }
  };

  // Search & Filter state for Manage Products & Quotes
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [quoteSearchTerm, setQuoteSearchTerm] = useState("");
  const [quoteFilterStatus, setQuoteFilterStatus] = useState<string>("all");

  // Exit & Logout protection state
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [exitTarget, setExitTarget] = useState<"logout" | "store" | null>(null);

  const navigate = useNavigate();

  const isFormDirty = Boolean(
    form.name.trim() || form.wholesalePrice || form.shortDescription.trim(),
  );

  // Protect tab closing/refreshing when form is dirty
  useEffect(() => {
    if (!isFormDirty) return;
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isFormDirty]);

  // Session idle timeout protection
  useEffect(() => {
    const settings = getRateLimitSettings();
    if (!settings.idleTimeoutMinutes || settings.idleTimeoutMinutes <= 0) return;

    let timeoutId: ReturnType<typeof setTimeout> | undefined;
    const resetTimer = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(
        () => {
          onLogout();
        },
        settings.idleTimeoutMinutes * 60 * 1000,
      );
    };

    const events = ["mousedown", "mousemove", "keydown", "scroll", "touchstart"];
    events.forEach((ev) => window.addEventListener(ev, resetTimer));
    resetTimer();

    return () => {
      clearTimeout(timeoutId);
      events.forEach((ev) => window.removeEventListener(ev, resetTimer));
    };
  }, [onLogout]);

  useEffect(() => {
    setAdminProducts(getAdminProducts());
    fetchQuoteRequestsApi().then((data) => setQuotes(data));
  }, []);

  const triggerExit = (target: "logout" | "store") => {
    setExitTarget(target);
    setConfirmModalOpen(true);
  };

  const handleConfirmLogout = () => {
    setConfirmModalOpen(false);
    onLogout();
  };

  const handleConfirmNavigateStore = () => {
    setConfirmModalOpen(false);
    navigate({ to: "/" });
  };

  const allProducts = useMemo(() => [...staticProducts, ...adminProducts], [adminProducts]);
  const totalProducts = allProducts.length;
  const totalCategories = useMemo(
    () => new Set(allProducts.map((p) => p.category)).size,
    [allProducts],
  );
  const readymadeCount = useMemo(
    () => allProducts.filter((p) => p.isReadymade !== false).length,
    [allProducts],
  );
  const fabricCount = useMemo(
    () => allProducts.filter((p) => p.isReadymade === false).length,
    [allProducts],
  );
  const pendingQuotesCount = useMemo(
    () => quotes.filter((q) => q.status === "Pending").length,
    [quotes],
  );

  // Filtered Products for Manage tab
  const filteredProducts = useMemo(() => {
    return adminProducts.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.categoryLabel.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.composition.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCat = filterCategory === "all" || p.category === filterCategory;
      return matchesSearch && matchesCat;
    });
  }, [adminProducts, searchTerm, filterCategory]);

  // Filtered Quotes for Quotes tab
  const filteredQuotes = useMemo(() => {
    return quotes.filter((q) => {
      const matchesSearch =
        q.productName.toLowerCase().includes(quoteSearchTerm.toLowerCase()) ||
        q.email.toLowerCase().includes(quoteSearchTerm.toLowerCase()) ||
        q.refCode.toLowerCase().includes(quoteSearchTerm.toLowerCase());
      const matchesStatus = quoteFilterStatus === "all" || q.status === quoteFilterStatus;
      return matchesSearch && matchesStatus;
    });
  }, [quotes, quoteSearchTerm, quoteFilterStatus]);

  const handleStatusChange = async (id: string, status: QuoteRequest["status"]) => {
    const updated = await updateQuoteStatusApi(id, status);
    setQuotes(updated);
  };

  const handleDeleteQuote = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this bulk quote request?")) {
      const updated = await deleteQuoteRequestApi(id);
      setQuotes(updated);
    }
  };

  // ── FORM HANDLERS ────────────────────────────────────────────────────────
  const updateForm = (field: keyof NewProductForm, value: string) => {
    setForm((prev) => {
      const updated = { ...prev, [field]: value };
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

  const handleSaveProduct = async () => {
    setFormError("");
    setSuccessMsg("");

    if (!form.name.trim()) return setFormError("Product name is required.");
    if (!form.wholesalePrice || isNaN(Number(form.wholesalePrice)))
      return setFormError("Valid wholesale price is required.");
    if (!form.moq || isNaN(Number(form.moq))) return setFormError("Valid MOQ is required.");
    if (!form.shortDescription.trim()) return setFormError("Short description is required.");
    if (!form.composition.trim()) return setFormError("Composition is required.");

    const slug =
      editingSlug ??
      form.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "") +
        "-" +
        Date.now();
    const colorsArr = form.colors
      .split(",")
      .map((c) => c.trim())
      .filter(Boolean);
    const sizesArr = form.sizes
      ? form.sizes
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
      : undefined;
    const isReadymade = form.isReadymade === "readymade";

    const newProduct: Product = {
      slug,
      name: form.name.trim(),
      category: form.category,
      categoryLabel: form.categoryLabel,
      subType: form.subType.trim().toLowerCase() || undefined,
      isReadymade,
      shortDescription: form.shortDescription.trim(),
      description: form.description.trim() || form.shortDescription.trim(),
      image:
        form.imageUrl.trim() ||
        "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800&q=80",
      wholesalePrice: Number(form.wholesalePrice),
      unit: form.unit,
      moq: Number(form.moq),
      composition: form.composition.trim(),
      gsm: form.gsm.trim() || undefined,
      yarnCount: form.yarnCount.trim() || undefined,
      dyeingFinishing: form.dyeingFinishing.trim() || undefined,
      printingCompatibility: form.printingCompatibility.trim() || undefined,
      qualityParameters: form.qualityParameters.trim() || undefined,
      colors: colorsArr.length ? colorsArr : ["Custom shades"],
      sizes: sizesArr,
      leadTime: form.leadTime.trim() || "7–14 days",
      badge: form.badge.trim() || undefined,
      vendors: form.vendors.trim() || undefined,
      isAdminAdded: true,
    };

    const updated = await saveAdminProductApi(newProduct);
    if (editingSlug) {
      setSuccessMsg(`✅ Product "${newProduct.name}" updated successfully in MongoDB Atlas!`);
    } else {
      setSuccessMsg(
        `✅ Product "${newProduct.name}" saved to MongoDB & published to live catalog!`,
      );
    }

    setAdminProducts(updated);

    setTimeout(() => {
      resetForm();
      setUploadProgress("");
      setActiveTab("manage");
    }, 1200);
  };

  const handleEditProduct = (product: Product) => {
    setForm({
      name: product.name,
      category: product.category,
      categoryLabel: product.categoryLabel,
      subType: product.subType ?? "",
      isReadymade: product.isReadymade !== false ? "readymade" : "fabric",
      shortDescription: product.shortDescription,
      description: product.description,
      imageUrl: product.image.startsWith("http") ? product.image : "",
      wholesalePrice: String(product.wholesalePrice),
      unit: product.unit,
      moq: String(product.moq),
      composition: product.composition,
      gsm: product.gsm ?? "",
      yarnCount: product.yarnCount ?? "",
      dyeingFinishing: product.dyeingFinishing ?? "",
      printingCompatibility: product.printingCompatibility ?? "",
      qualityParameters: product.qualityParameters ?? "",
      colors: product.colors.join(", "),
      sizes: product.sizes?.join(", ") ?? "",
      leadTime: product.leadTime,
      badge: product.badge ?? "",
      vendors: product.vendors ?? "",
    });
    setEditingSlug(product.slug);
    setActiveTab("add");
  };

  const handleDeleteProduct = async (slug: string) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      const updated = await deleteAdminProductApi(slug);
      setAdminProducts(updated);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-100 font-sans text-slate-900">
      {/* Mobile Overlay */}
      {mobileSidebarOpen && (
        <div
          onClick={() => setMobileSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-sm lg:hidden transition-opacity"
        />
      )}

      {/* ── SIDEBAR ──────────────────────────────────────────────────────── */}
      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen w-64 flex-col border-r border-slate-800 bg-slate-950 text-slate-100 shadow-xl transition-transform duration-300 ${
          mobileSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Logo Header */}
        <button
          onClick={() => {
            triggerExit("store");
            setMobileSidebarOpen(false);
          }}
          className="flex items-center gap-3 border-b border-slate-800/80 px-5 py-4 hover:bg-slate-900/60 transition-colors group text-left cursor-pointer"
          title="Return to User / Store Page"
        >
          <img
            src="/logo.svg"
            alt="KANISHKA Logo"
            className="h-14 w-auto object-contain rounded-xl shadow-md shrink-0 border border-slate-700 bg-white p-0.5"
          />
          <div>
            <div className="font-display text-sm font-bold tracking-wide text-white uppercase group-hover:text-slate-200 transition-colors">
              KANISHKA GARMENTS
            </div>
            <div className="text-[10px] uppercase tracking-widest text-slate-400 group-hover:text-slate-200 flex items-center gap-1 mt-0.5">
              <ArrowLeft className="h-3 w-3" /> Back to Store
            </div>
          </div>
        </button>

        {/* Nav Items */}
        <nav className="flex-1 space-y-1.5 p-3 pt-4">
          {[
            { id: "dashboard" as const, label: "Dashboard", icon: LayoutDashboard },
            { id: "add" as const, label: editingSlug ? "Edit Product" : "Add Product", icon: Plus },
            {
              id: "manage" as const,
              label: "Manage Products",
              icon: Package,
              badgeCount: adminProducts.length,
            },
            {
              id: "quotes" as const,
              label: "Quote Requests (RFQ)",
              icon: MessageSquare,
              badgeCount: pendingQuotesCount,
              highlightBadge: true,
            },
            { id: "settings" as const, label: "Security & Access", icon: Shield },
          ].map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  if (item.id !== "add") resetForm();
                  setMobileSidebarOpen(false);
                }}
                className={`relative flex w-full items-center gap-3 rounded-xl px-3.5 py-3 text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? "bg-slate-800 text-white shadow-sm border-l-4 border-slate-400"
                    : "text-slate-400 hover:bg-slate-900/60 hover:text-slate-200"
                }`}
              >
                <item.icon className={`h-4 w-4 ${isActive ? "text-white" : "text-slate-400"}`} />
                <span>{item.label}</span>
                {Boolean(item.badgeCount && item.badgeCount > 0) && (
                  <span
                    className={`ml-auto rounded-full px-2 py-0.5 text-[10px] font-bold ${
                      item.highlightBadge
                        ? "bg-amber-400 text-slate-950"
                        : "bg-slate-800 border border-slate-700 text-slate-300"
                    }`}
                  >
                    {item.badgeCount}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* View Site & Logout Footer */}
        <div className="border-t border-slate-800/80 p-3 space-y-1.5">
          <a
            href="/products"
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-xs font-medium text-slate-400 hover:bg-slate-900 hover:text-slate-100 transition-colors"
          >
            <Eye className="h-3.5 w-3.5" /> View Live Catalog
          </a>
          <button
            onClick={() => triggerExit("logout")}
            className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-xs font-medium text-slate-400 hover:bg-rose-500/10 hover:text-rose-400 transition-colors cursor-pointer"
          >
            <LogOut className="h-3.5 w-3.5" /> Sign Out
          </button>
        </div>
      </aside>

      {/* ── MAIN CONTENT AREA ────────────────────────────────────────────── */}
      <main className="flex-1 lg:ml-64 overflow-auto min-w-0 flex flex-col">
        {/* Sticky Topbar */}
        <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur-md">
          <div className="flex h-16 items-center justify-between px-4 sm:px-6">
            <div className="flex items-center gap-3 min-w-0">
              <button
                onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
                className="inline-flex items-center justify-center rounded-xl border border-slate-200 p-2 text-slate-700 hover:bg-slate-100 lg:hidden cursor-pointer"
                aria-label="Toggle navigation"
              >
                <Menu className="h-4 w-4" />
              </button>

              <button
                onClick={() => triggerExit("store")}
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 shrink-0 cursor-pointer"
                title="Return to Storefront"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Back to Store</span>
              </button>

              <div className="h-4 w-px bg-slate-200 hidden sm:block" />

              <h1 className="font-display text-sm sm:text-base font-bold text-slate-900 capitalize truncate">
                {activeTab === "add"
                  ? editingSlug
                    ? "Edit Product"
                    : "Add New Product"
                  : activeTab === "settings"
                    ? "Security & Rate Limit Controls"
                    : activeTab === "manage"
                      ? "Manage Added Products"
                      : activeTab === "quotes"
                        ? "Bulk Quote Requests (RFQ)"
                        : "Overview & Analytics"}
              </h1>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <span className="hidden md:inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700">
                <Sparkles className="h-3.5 w-3.5 text-slate-500" /> Catalog: {totalProducts} items
              </span>

              <div className="text-xs text-slate-500 hidden sm:block">
                Signed in as <span className="font-bold text-slate-800">admin</span>
              </div>

              <button
                onClick={() => triggerExit("logout")}
                className="inline-flex items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-600 transition hover:bg-rose-100 cursor-pointer"
              >
                <LogOut className="h-3.5 w-3.5" />{" "}
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </div>
          </div>
        </header>

        {/* Modal Alert */}
        <ConfirmExitModal
          isOpen={confirmModalOpen}
          isFormDirty={isFormDirty}
          target={exitTarget}
          onCancel={() => setConfirmModalOpen(false)}
          onConfirmLogout={handleConfirmLogout}
          onConfirmNavigateStore={handleConfirmNavigateStore}
        />

        {/* Page Content */}
        <div className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6">
          {/* ── DASHBOARD TAB ────────────────────────────────────────────── */}
          {activeTab === "dashboard" && (
            <div className="space-y-6">
              {/* Header Banner */}
              <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 sm:p-8 text-white shadow-md space-y-2">
                <div className="inline-flex items-center gap-2 rounded-full bg-slate-800 border border-slate-700 px-3 py-1 text-xs font-semibold text-slate-300">
                  <Sparkles className="h-3.5 w-3.5 text-slate-400" /> KANISHKA GARMENTS Admin Portal
                </div>
                <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-white">
                  Welcome to Catalog Operations
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
                  Manage products, monitor bulk quote inquiries, configure security rate limiting,
                  and update inventory details in real time.
                </p>
              </div>

              {/* KPI Cards */}
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard
                  title="Total Products"
                  value={totalProducts}
                  badge={`${adminProducts.length} added by admin`}
                  icon={Package}
                />
                <StatCard
                  title="Active Categories"
                  value={totalCategories}
                  badge="Gents, Ladies, Fabric..."
                  icon={Layers}
                />
                <StatCard
                  title="Readymade Apparel"
                  value={readymadeCount}
                  badge="Garments & Wear"
                  icon={ShoppingBag}
                />
                <StatCard
                  title="Bulk Quote Requests"
                  value={quotes.length}
                  badge={`${pendingQuotesCount} pending responses`}
                  icon={MessageSquare}
                  highlight={pendingQuotesCount > 0}
                />
              </div>

              {/* Quick Actions Grid */}
              <div className="grid gap-4 sm:grid-cols-3">
                <button
                  onClick={() => {
                    resetForm();
                    setActiveTab("add");
                  }}
                  className="rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm hover:shadow-md hover:border-slate-400 transition-all group cursor-pointer"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-800 group-hover:bg-slate-900 group-hover:text-white transition-colors mb-3">
                    <Plus className="h-5 w-5" />
                  </div>
                  <div className="font-display text-sm font-bold text-slate-900">
                    Add New Product
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Publish new readymade garments or raw knitted fabrics to the catalog.
                  </p>
                </button>

                <button
                  onClick={() => setActiveTab("quotes")}
                  className="rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm hover:shadow-md hover:border-slate-400 transition-all group cursor-pointer"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-800 group-hover:bg-slate-900 group-hover:text-white transition-colors mb-3">
                    <MessageSquare className="h-5 w-5" />
                  </div>
                  <div className="font-display text-sm font-bold text-slate-900">
                    Bulk Quote Inquiries ({quotes.length})
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    View and respond to RFQs submitted by buyers on product pages.
                  </p>
                </button>

                <button
                  onClick={() => setActiveTab("settings")}
                  className="rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm hover:shadow-md hover:border-slate-400 transition-all group cursor-pointer"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-800 group-hover:bg-slate-900 group-hover:text-white transition-colors mb-3">
                    <Shield className="h-5 w-5" />
                  </div>
                  <div className="font-display text-sm font-bold text-slate-900">
                    Security Controls
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Set rate limit thresholds, lockout timers, and update SHA-256 password.
                  </p>
                </button>
              </div>

              {/* Recent Added Products Preview */}
              <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                <div className="border-b border-slate-100 px-6 py-4 flex items-center justify-between">
                  <div>
                    <h3 className="font-display text-sm font-bold text-slate-900">
                      Admin Added Products
                    </h3>
                    <p className="text-xs text-slate-500">
                      Products created by admin and live in catalog
                    </p>
                  </div>
                  <Button
                    onClick={() => setActiveTab("manage")}
                    variant="outline"
                    size="sm"
                    className="text-xs"
                  >
                    View All
                  </Button>
                </div>

                {adminProducts.length === 0 ? (
                  <div className="p-12 text-center text-slate-400">
                    <Package className="mx-auto h-10 w-10 text-slate-300 mb-2" />
                    <p className="text-xs font-medium text-slate-600">
                      No admin-added products yet
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      Click "Add New Product" to publish your first item.
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100">
                    {adminProducts.slice(0, 5).map((p) => (
                      <div
                        key={p.slug}
                        className="flex items-center justify-between px-6 py-3.5 hover:bg-slate-50/80 transition-colors"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <img
                            src={
                              p.image.startsWith("http")
                                ? p.image
                                : "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=80&q=60"
                            }
                            alt=""
                            className="h-10 w-10 rounded-lg object-cover border border-slate-200 shrink-0"
                            onError={(e) =>
                              (e.currentTarget.src =
                                "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=80&q=60")
                            }
                          />
                          <div className="min-w-0">
                            <div className="truncate font-semibold text-slate-900 text-xs sm:text-sm">
                              {p.name}
                            </div>
                            <div className="text-[11px] text-slate-500">{p.categoryLabel}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs font-bold text-slate-900">
                            {formatINR(p.wholesalePrice)}/{p.unit}
                          </div>
                          <div className="text-[11px] text-slate-400">MOQ: {p.moq}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── ADD / EDIT PRODUCT TAB ────────────────────────────────────── */}
          {activeTab === "add" && (
            <div className="space-y-6 pb-20">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-display text-xl font-bold text-slate-900">
                    {editingSlug ? `Editing Product: ${form.name}` : "Publish New Product"}
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Fill in details matching the storefront catalog layout.
                  </p>
                </div>
                {editingSlug && (
                  <Button onClick={resetForm} variant="outline" size="sm" className="gap-1 text-xs">
                    <RotateCcw className="h-3.5 w-3.5" /> Cancel Edit Mode
                  </Button>
                )}
              </div>

              {formError && (
                <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-xs font-medium text-rose-700 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              {successMsg && (
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-xs font-semibold text-emerald-800 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                  <span>{successMsg}</span>
                </div>
              )}

              {/* Form Section 1 */}
              <FormSection step="1" title="Basic Product Identity">
                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField label="Product Name *">
                    <input
                      id="prod-name"
                      value={form.name}
                      onChange={(e) => updateForm("name", e.target.value)}
                      placeholder="e.g. Premium Bio-Washed Heavyweight Oversized Tee"
                      className={inputCls}
                      required
                    />
                  </FormField>

                  <FormField label="Category *">
                    <select
                      id="prod-category"
                      value={form.category}
                      onChange={(e) =>
                        updateForm("category", e.target.value as Product["category"])
                      }
                      className={inputCls}
                    >
                      {categoryOptions.map((c) => (
                        <option key={c.value} value={c.value}>
                          {c.label}
                        </option>
                      ))}
                    </select>
                  </FormField>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField label="Sub-type / Garment Style (optional)">
                    <input
                      id="prod-subtype"
                      value={form.subType}
                      onChange={(e) => updateForm("subType", e.target.value)}
                      placeholder="e.g. t-shirt, hoodie, trackpants, single-jersey"
                      className={inputCls}
                    />
                  </FormField>

                  <FormField label="Product Type *">
                    <select
                      id="prod-readymade"
                      value={form.isReadymade}
                      onChange={(e) => updateForm("isReadymade", e.target.value)}
                      className={inputCls}
                    >
                      <option value="readymade">Readymade Apparel / Garment</option>
                      <option value="fabric">Raw Knitted Fabric Roll</option>
                    </select>
                  </FormField>
                </div>

                <FormField label="Short Description *">
                  <input
                    id="prod-shortdesc"
                    value={form.shortDescription}
                    onChange={(e) => updateForm("shortDescription", e.target.value)}
                    placeholder="e.g. Heavyweight 240 GSM combed cotton oversized fit with drop shoulders."
                    className={inputCls}
                    required
                  />
                </FormField>

                <FormField label="Full Editorial Description (optional)">
                  <textarea
                    id="prod-description"
                    rows={3}
                    value={form.description}
                    onChange={(e) => updateForm("description", e.target.value)}
                    placeholder="Detailed specifications, styling notes, packaging details..."
                    className={inputCls}
                  />
                </FormField>

                <FormField label="Product Image (Upload Local Photo to Cloudinary CDN or Enter URL)">
                  <div className="space-y-3">
                    {/* Cloudinary Direct File Upload Button */}
                    <div className="flex flex-wrap items-center gap-3">
                      <label className="flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-bold text-white hover:bg-slate-800 transition cursor-pointer border border-slate-700 shadow-sm">
                        {uploadingImage ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin text-amber-400" />
                            <span>Uploading to Cloudinary...</span>
                          </>
                        ) : (
                          <>
                            <Upload className="h-4 w-4 text-emerald-400" />
                            <span>Choose Photo from Device</span>
                          </>
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageFileChange}
                          disabled={uploadingImage}
                          className="hidden"
                        />
                      </label>
                      <span className="text-[11px] text-slate-500 font-medium">
                        Uploaded photos stored directly on Cloudinary CDN
                      </span>
                    </div>

                    {uploadProgress && (
                      <div className="text-xs font-semibold text-emerald-600 flex items-center gap-1.5">
                        <span>{uploadProgress}</span>
                      </div>
                    )}

                    {/* Live Upload Image Preview Thumbnail */}
                    {form.imageUrl && (
                      <div className="flex items-center gap-3 p-2 bg-slate-50 border border-slate-200 rounded-xl w-fit">
                        <img
                          src={form.imageUrl}
                          alt="Uploaded Preview"
                          className="h-16 w-16 rounded-lg object-cover border border-slate-300 shadow-sm"
                        />
                        <div className="text-xs">
                          <span className="font-bold text-slate-900 block">Image Preview</span>
                          <span className="text-[10px] text-slate-500 font-mono truncate max-w-60 block">
                            {form.imageUrl}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Image URL text input */}
                    <input
                      id="prod-image"
                      value={form.imageUrl}
                      onChange={(e) => updateForm("imageUrl", e.target.value)}
                      placeholder="Or enter image URL (https://res.cloudinary.com/...)"
                      className={inputCls}
                    />
                  </div>
                </FormField>
              </FormSection>

              {/* Form Section 2 */}
              <FormSection step="2" title="Commercial Wholesale Pricing & MOQ">
                <div className="grid gap-4 sm:grid-cols-3">
                  <FormField label="Wholesale Price (₹) *">
                    <input
                      id="prod-price"
                      type="number"
                      value={form.wholesalePrice}
                      onChange={(e) => updateForm("wholesalePrice", e.target.value)}
                      placeholder="e.g. 280"
                      className={inputCls}
                      required
                    />
                  </FormField>

                  <FormField label="Price Unit *">
                    <select
                      id="prod-unit"
                      value={form.unit}
                      onChange={(e) => updateForm("unit", e.target.value)}
                      className={inputCls}
                    >
                      <option value="piece">piece</option>
                      <option value="kg">kg</option>
                      <option value="meter">meter</option>
                      <option value="set">set</option>
                      <option value="pair">pair</option>
                    </select>
                  </FormField>

                  <FormField label="Minimum Order Quantity (MOQ) *">
                    <input
                      id="prod-moq"
                      type="number"
                      value={form.moq}
                      onChange={(e) => updateForm("moq", e.target.value)}
                      placeholder="e.g. 100"
                      className={inputCls}
                      required
                    />
                  </FormField>
                </div>
              </FormSection>

              {/* Form Section 3 */}
              <FormSection step="3" title="Textile & Quality Specifications">
                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField label="Composition *">
                    <input
                      id="prod-composition"
                      value={form.composition}
                      onChange={(e) => updateForm("composition", e.target.value)}
                      placeholder="e.g. 100% Super Combed Cotton"
                      className={inputCls}
                      required
                    />
                  </FormField>

                  <FormField label="GSM / Fabric Weight (optional)">
                    <input
                      id="prod-gsm"
                      value={form.gsm}
                      onChange={(e) => updateForm("gsm", e.target.value)}
                      placeholder="e.g. 240 GSM"
                      className={inputCls}
                    />
                  </FormField>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField label="Yarn Count (optional)">
                    <input
                      id="prod-yarn"
                      value={form.yarnCount}
                      onChange={(e) => updateForm("yarnCount", e.target.value)}
                      placeholder="e.g. 24s Combed Compact"
                      className={inputCls}
                    />
                  </FormField>

                  <FormField label="Dyeing & Finishing (optional)">
                    <input
                      id="prod-dyeing"
                      value={form.dyeingFinishing}
                      onChange={(e) => updateForm("dyeingFinishing", e.target.value)}
                      placeholder="e.g. Bio-washed, Silicon-softened"
                      className={inputCls}
                    />
                  </FormField>
                </div>
              </FormSection>

              {/* Form Section 4 */}
              <FormSection step="4" title="Variants, Mill Vendors & Badges">
                <FormField label="Colors (comma-separated)">
                  <input
                    id="prod-colors"
                    value={form.colors}
                    onChange={(e) => updateForm("colors", e.target.value)}
                    placeholder="e.g. Black, White, Charcoal, Sage Green"
                    className={inputCls}
                  />
                </FormField>

                <FormField label="Sizes (comma-separated, optional)">
                  <input
                    id="prod-sizes"
                    value={form.sizes}
                    onChange={(e) => updateForm("sizes", e.target.value)}
                    placeholder="e.g. S, M, L, XL, 2XL"
                    className={inputCls}
                  />
                </FormField>

                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField label="Production Lead Time">
                    <input
                      id="prod-lead"
                      value={form.leadTime}
                      onChange={(e) => updateForm("leadTime", e.target.value)}
                      placeholder="e.g. 7–14 days"
                      className={inputCls}
                    />
                  </FormField>

                  <FormField label="Badge Label (optional)">
                    <input
                      id="prod-badge"
                      value={form.badge}
                      onChange={(e) => updateForm("badge", e.target.value)}
                      placeholder="e.g. Best Seller, Private Label Ready"
                      className={inputCls}
                    />
                  </FormField>
                </div>
              </FormSection>

              {/* Sticky Bottom Action Bar */}
              <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-slate-200 bg-white/90 backdrop-blur-md p-4 lg:pl-72 shadow-lg">
                <div className="max-w-4xl mx-auto flex items-center justify-end gap-3">
                  <Button onClick={resetForm} variant="outline" size="lg" className="text-xs">
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSaveProduct}
                    size="lg"
                    className="gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs"
                  >
                    <Save className="h-4 w-4" />
                    {editingSlug ? "Save Product Changes" : "Publish Product to Catalog"}
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* ── MANAGE PRODUCTS TAB ──────────────────────────────────────── */}
          {activeTab === "manage" && (
            <div className="space-y-4">
              {/* Search & Category Filter Header */}
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm space-y-3 sm:space-y-0 sm:flex sm:items-center sm:justify-between gap-4">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search added products by name or composition..."
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 py-2.5 text-xs text-slate-900 outline-none transition focus:border-slate-500 focus:bg-white"
                  />
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <Filter className="h-3.5 w-3.5" />
                    <span>Category:</span>
                  </div>
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 outline-none focus:border-slate-500"
                  >
                    <option value="all">All Categories</option>
                    {categoryOptions.map((c) => (
                      <option key={c.value} value={c.value}>
                        {c.label}
                      </option>
                    ))}
                  </select>

                  <Button
                    onClick={() => {
                      resetForm();
                      setActiveTab("add");
                    }}
                    size="sm"
                    className="gap-1 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shrink-0"
                  >
                    <Plus className="h-3.5 w-3.5" /> Add Product
                  </Button>
                </div>
              </div>

              {/* Product Table */}
              {filteredProducts.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-16 text-center">
                  <Package className="mx-auto h-10 w-10 text-slate-300 mb-3" />
                  <p className="font-semibold text-slate-800 text-sm">No products found</p>
                  <p className="text-xs text-slate-500 mt-1">
                    {adminProducts.length === 0
                      ? "No products added yet via admin."
                      : "Try adjusting your search query or category filter."}
                  </p>
                </div>
              ) : (
                <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                  <div className="hidden sm:grid sm:grid-cols-[1fr_auto_auto_auto] gap-4 border-b border-slate-100 bg-slate-50/80 px-6 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    <div>Product Name & Details</div>
                    <div>Wholesale Price</div>
                    <div>MOQ</div>
                    <div>Actions</div>
                  </div>

                  <div className="divide-y divide-slate-100">
                    {filteredProducts.map((p) => (
                      <div key={p.slug}>
                        <div className="flex flex-col sm:grid sm:grid-cols-[1fr_auto_auto_auto] sm:items-center gap-4 px-4 sm:px-6 py-4 hover:bg-slate-50/60 transition-colors">
                          <div className="flex items-center gap-3 min-w-0">
                            <img
                              src={
                                p.image.startsWith("http")
                                  ? p.image
                                  : "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=80&q=60"
                              }
                              alt=""
                              className="h-11 w-11 shrink-0 rounded-xl object-cover border border-slate-200"
                              onError={(e) =>
                                (e.currentTarget.src =
                                  "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=80&q=60")
                              }
                            />
                            <div className="min-w-0">
                              <div className="truncate font-semibold text-slate-900 text-xs sm:text-sm">
                                {p.name}
                              </div>
                              <div className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                                <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-700">
                                  {p.categoryLabel}
                                </span>
                                {p.badge && (
                                  <span className="text-slate-700 font-semibold">· {p.badge}</span>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center justify-between sm:justify-end gap-4 text-xs sm:text-sm">
                            <div className="font-bold text-slate-900 sm:whitespace-nowrap">
                              {formatINR(p.wholesalePrice)}/{p.unit}
                            </div>
                            <div className="text-slate-500 sm:whitespace-nowrap">
                              MOQ {p.moq} {p.unit}s
                            </div>
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() =>
                                  setExpandedSlug(expandedSlug === p.slug ? null : p.slug)
                                }
                                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors cursor-pointer"
                                title="Details"
                              >
                                {expandedSlug === p.slug ? (
                                  <ChevronUp className="h-4 w-4" />
                                ) : (
                                  <ChevronDown className="h-4 w-4" />
                                )}
                              </button>
                              <button
                                onClick={() => handleEditProduct(p)}
                                className="rounded-lg p-1.5 text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
                                title="Edit"
                              >
                                <Edit2 className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(p.slug)}
                                className="rounded-lg p-1.5 text-rose-500 hover:bg-rose-50 transition-colors cursor-pointer"
                                title="Delete"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </div>

                        {expandedSlug === p.slug && (
                          <div className="border-t border-slate-100 bg-slate-50/80 px-4 sm:px-6 py-4 text-xs text-slate-600 space-y-1.5">
                            <p>
                              <span className="font-semibold text-slate-900">
                                Short Description:
                              </span>{" "}
                              {p.shortDescription}
                            </p>
                            <p>
                              <span className="font-semibold text-slate-900">Composition:</span>{" "}
                              {p.composition}
                            </p>
                            <p>
                              <span className="font-semibold text-slate-900">Colors:</span>{" "}
                              {p.colors.join(", ")}
                            </p>
                            {p.sizes && (
                              <p>
                                <span className="font-semibold text-slate-900">Sizes:</span>{" "}
                                {p.sizes.join(", ")}
                              </p>
                            )}
                            <p>
                              <span className="font-semibold text-slate-900">Lead Time:</span>{" "}
                              {p.leadTime}
                            </p>
                            <a
                              href={`/products/${p.slug}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 mt-2 text-slate-800 font-semibold hover:underline"
                            >
                              <Eye className="h-3.5 w-3.5" /> View live detail page
                            </a>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── BULK QUOTES (RFQ) TAB ────────────────────────────────────────── */}
          {activeTab === "quotes" && (
            <div className="space-y-4">
              {/* Filter Header */}
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm space-y-3 sm:space-y-0 sm:flex sm:items-center sm:justify-between gap-4">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    value={quoteSearchTerm}
                    onChange={(e) => setQuoteSearchTerm(e.target.value)}
                    placeholder="Search by customer email, product name, or ref code..."
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 py-2.5 text-xs text-slate-900 outline-none transition focus:border-slate-500 focus:bg-white"
                  />
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <Filter className="h-3.5 w-3.5" />
                    <span>Status:</span>
                  </div>
                  <select
                    value={quoteFilterStatus}
                    onChange={(e) => setQuoteFilterStatus(e.target.value)}
                    className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 outline-none focus:border-slate-500"
                  >
                    <option value="all">All Statuses</option>
                    <option value="Pending">
                      Pending ({quotes.filter((q) => q.status === "Pending").length})
                    </option>
                    <option value="Contacted">
                      Contacted ({quotes.filter((q) => q.status === "Contacted").length})
                    </option>
                    <option value="Fulfilled">
                      Fulfilled ({quotes.filter((q) => q.status === "Fulfilled").length})
                    </option>
                  </select>
                </div>
              </div>

              {/* Quotes Table */}
              {filteredQuotes.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-16 text-center">
                  <MessageSquare className="mx-auto h-10 w-10 text-slate-300 mb-3" />
                  <p className="font-semibold text-slate-800 text-sm">No quote requests found</p>
                  <p className="text-xs text-slate-500 mt-1">
                    {quotes.length === 0
                      ? "When buyers submit RFQ forms on product pages, their requests will be stored and listed here."
                      : "No quotes match your current filter or search criteria."}
                  </p>
                </div>
              ) : (
                <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden divide-y divide-slate-100">
                  {filteredQuotes.map((q) => (
                    <div
                      key={q.id}
                      className="p-4 sm:p-6 hover:bg-slate-50/60 transition-colors space-y-3"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-mono text-xs font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                              #{q.refCode}
                            </span>
                            <span
                              className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                                q.status === "Pending"
                                  ? "bg-amber-100 text-amber-800 border border-amber-200"
                                  : q.status === "Contacted"
                                    ? "bg-blue-100 text-blue-800 border border-blue-200"
                                    : "bg-emerald-100 text-emerald-800 border border-emerald-200"
                              }`}
                            >
                              {q.status}
                            </span>
                            <span className="text-xs text-slate-400">
                              {new Date(q.createdAt).toLocaleDateString()} at{" "}
                              {new Date(q.createdAt).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          </div>

                          <h4 className="font-bold text-slate-900 text-sm">{q.productName}</h4>
                          <p className="text-xs text-slate-600">
                            Buyer Email:{" "}
                            <a
                              href={`mailto:${q.email}`}
                              className="font-semibold text-slate-900 hover:underline"
                            >
                              {q.email}
                            </a>
                            {q.phone && (
                              <span>
                                {" "}
                                · Phone: <strong className="text-slate-900">{q.phone}</strong>
                              </span>
                            )}
                          </p>
                        </div>

                        <div className="flex items-center gap-3 shrink-0">
                          <div className="text-right text-xs">
                            <div className="font-bold text-slate-900">Qty: {q.quantity}</div>
                            <div className="text-slate-500">Destination: {q.destination}</div>
                          </div>

                          <select
                            value={q.status}
                            onChange={(e) =>
                              handleStatusChange(q.id, e.target.value as QuoteRequest["status"])
                            }
                            className="rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-semibold text-slate-900 outline-none focus:border-slate-500 cursor-pointer"
                          >
                            <option value="Pending">Pending</option>
                            <option value="Contacted">Contacted</option>
                            <option value="Fulfilled">Fulfilled</option>
                          </select>

                          <button
                            onClick={() => handleDeleteQuote(q.id)}
                            className="rounded-lg p-1.5 text-rose-500 hover:bg-rose-50 transition-colors cursor-pointer"
                            title="Delete Quote"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

                      {(q.notes || q.deliveryDate || q.fileName) && (
                        <div className="mt-3 pt-3 border-t border-slate-100 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl space-y-1">
                          {q.deliveryDate && (
                            <p>
                              <strong className="text-slate-800">Target Delivery Date:</strong>{" "}
                              {q.deliveryDate}
                            </p>
                          )}
                          {q.notes && (
                            <p>
                              <strong className="text-slate-800">Tech Pack / Custom Notes:</strong>{" "}
                              {q.notes}
                            </p>
                          )}
                          {q.fileName && (
                            <p>
                              <strong className="text-slate-800">Attached File:</strong>{" "}
                              {q.fileName}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── SECURITY SETTINGS TAB ─────────────────────────────────────── */}
          {activeTab === "settings" && <SecuritySettingsSection />}
        </div>
      </main>
    </div>
  );
}

// ── KPI STAT CARD COMPONENT ────────────────────────────────────────────────
function StatCard({
  title,
  value,
  badge,
  icon: Icon,
  highlight = false,
}: {
  title: string;
  value: number;
  badge: string;
  icon: React.ComponentType<{ className?: string }>;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border p-5 shadow-sm hover:shadow-md transition-all ${
        highlight ? "border-amber-300 bg-amber-50/50" : "border-slate-200 bg-white"
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          {title}
        </span>
        <div
          className={`flex h-9 w-9 items-center justify-center rounded-xl border ${
            highlight
              ? "border-amber-200 bg-amber-100 text-amber-900"
              : "border-slate-200 bg-slate-50 text-slate-700"
          }`}
        >
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <div className="mt-3 flex items-baseline gap-2">
        <span className="font-display text-2xl font-bold text-slate-900">{value}</span>
      </div>
      <span className="mt-1 block text-[11px] text-slate-400">{badge}</span>
    </div>
  );
}

// ── FORM SECTION CARD COMPONENT ──────────────────────────────────────────
function FormSection({
  step,
  title,
  children,
}: {
  step: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
      <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-slate-900 font-bold text-xs border border-slate-200">
          {step}
        </div>
        <h3 className="font-display font-bold text-slate-900 text-sm sm:text-base">{title}</h3>
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

// ── SECURITY & RATE LIMIT SETTINGS SECTION ─────────────────────────────────
function SecuritySettingsSection() {
  const [rateSettings, setRateSettings] = useState<RateLimitSettings>(getRateLimitSettings);
  const [rateSuccess, setRateSuccess] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passError, setPassError] = useState("");
  const [passSuccess, setPassSuccess] = useState("");
  const [passLoading, setPassLoading] = useState(false);

  const [copiedField, setCopiedField] = useState<string | null>(null);

  const copyToClipboard = (text: string, fieldId: string) => {
    try {
      navigator.clipboard.writeText(text);
      setCopiedField(fieldId);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (e) {
      console.error("Failed to copy:", e);
    }
  };

  const handleSaveRateSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setRateSuccess("");
    saveRateLimitSettings(rateSettings);
    setRateSuccess("✅ Security rate limit rules updated successfully!");
    setTimeout(() => setRateSuccess(""), 4000);
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPassError("");
    setPassSuccess("");

    if (!currentPassword) return setPassError("Current password is required.");
    if (!newPassword || newPassword.length < 4)
      return setPassError("New password must be at least 4 characters.");
    if (newPassword !== confirmPassword) return setPassError("New passwords do not match.");

    setPassLoading(true);
    const currentHash = await sha256(currentPassword);
    const storedHash = getStoredPasswordHash();

    if (currentHash !== storedHash) {
      setPassError("Current password is incorrect.");
      setPassLoading(false);
      return;
    }

    const newHash = await sha256(newPassword);
    saveStoredPasswordHash(newHash);

    setPassLoading(false);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setPassSuccess("✅ Admin password updated successfully!");
    setTimeout(() => setPassSuccess(""), 4000);
  };

  return (
    <div className="max-w-3xl space-y-6">
      {/* Owner Sensitive Bank Details Card (Restricted Admin Access Only) */}
      <div className="rounded-2xl border border-amber-200 bg-white p-6 shadow-sm space-y-5">
        <div className="flex items-center justify-between border-b border-amber-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100 text-amber-900 border border-amber-200">
              <Building2 className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-display font-bold text-slate-900 text-base">
                Owner Sensitive Banking & Financial Details
              </h3>
              <p className="text-[11px] text-slate-500">
                Restricted to Admin Dashboard. Removed from public storefront for security.
              </p>
            </div>
          </div>
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 border border-amber-300 px-2.5 py-0.5 text-[10px] font-bold text-amber-900">
            <Shield className="h-3 w-3" /> Confidential
          </span>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 text-xs">
          <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Account Beneficiary Entity
            </span>
            <div className="font-semibold text-slate-900 text-sm">TM KANISHKA GARMENTS</div>
            <div className="text-slate-500 text-[11px]">Type: Official Current Account</div>
          </div>

          <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Bank & Branch Name
            </span>
            <div className="font-semibold text-slate-900 text-sm">State Bank of India (SBI)</div>
            <div className="text-slate-500 text-[11px]">Branch: Tirupur Main Branch</div>
          </div>

          <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Bank Account Number
            </span>
            <div className="flex items-center justify-between">
              <span className="font-mono text-sm font-bold text-slate-900 tracking-wider">
                43605722884
              </span>
              <button
                type="button"
                onClick={() => copyToClipboard("43605722884", "acc")}
                className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-600 hover:text-slate-900 cursor-pointer bg-white border border-slate-200 rounded-lg px-2 py-1 shadow-2xs"
              >
                {copiedField === "acc" ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-600" />
                    <span className="text-emerald-700 font-semibold">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              IFSC Code
            </span>
            <div className="flex items-center justify-between">
              <span className="font-mono text-sm font-bold text-slate-900 tracking-wider">
                SBIN0000935
              </span>
              <button
                type="button"
                onClick={() => copyToClipboard("SBIN0000935", "ifsc")}
                className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-600 hover:text-slate-900 cursor-pointer bg-white border border-slate-200 rounded-lg px-2 py-1 shadow-2xs"
              >
                {copiedField === "ifsc" ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-600" />
                    <span className="text-emerald-700 font-semibold">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 space-y-1 sm:col-span-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              GSTIN & Tax Registration
            </span>
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-slate-900">
                33CNRPT6310G1ZS
              </span>
              <button
                type="button"
                onClick={() => copyToClipboard("33CNRPT6310G1ZS", "gst")}
                className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-600 hover:text-slate-900 cursor-pointer bg-white border border-slate-200 rounded-lg px-2 py-1 shadow-2xs"
              >
                {copiedField === "gst" ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-600" />
                    <span className="text-emerald-700 font-semibold">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Rate Limit Rules Card */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-5">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <Shield className="h-5 w-5 text-slate-800" />
          <h3 className="font-display font-bold text-slate-900 text-base">
            Login Rate Limiting Controls
          </h3>
        </div>

        {rateSuccess && (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs font-semibold text-emerald-800 flex items-center justify-between">
            <span>{rateSuccess}</span>
            <button onClick={() => setRateSuccess("")}>
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        <form onSubmit={handleSaveRateSettings} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">
                Max Failed Attempts *
              </label>
              <input
                type="number"
                min="1"
                max="20"
                value={rateSettings.maxAttempts}
                onChange={(e) =>
                  setRateSettings({ ...rateSettings, maxAttempts: Number(e.target.value) })
                }
                className={inputCls}
                required
              />
              <span className="text-[11px] text-slate-400 mt-1 block">
                Failed logins before lockout.
              </span>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">
                Lockout Duration (Min) *
              </label>
              <input
                type="number"
                min="1"
                max="1440"
                value={rateSettings.lockoutDurationMinutes}
                onChange={(e) =>
                  setRateSettings({
                    ...rateSettings,
                    lockoutDurationMinutes: Number(e.target.value),
                  })
                }
                className={inputCls}
                required
              />
              <span className="text-[11px] text-slate-400 mt-1 block">
                Lockout period in minutes.
              </span>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">
                Idle Timeout (Min) *
              </label>
              <input
                type="number"
                min="0"
                max="1440"
                value={rateSettings.idleTimeoutMinutes ?? 30}
                onChange={(e) =>
                  setRateSettings({ ...rateSettings, idleTimeoutMinutes: Number(e.target.value) })
                }
                className={inputCls}
                required
              />
              <span className="text-[11px] text-slate-400 mt-1 block">
                Auto-logout inactivity (0=off).
              </span>
            </div>
          </div>

          <Button
            type="submit"
            className="gap-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold"
          >
            <Save className="h-4 w-4" /> Save Security Rules
          </Button>
        </form>
      </div>

      {/* Change Password Card */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-5">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <Lock className="h-5 w-5 text-slate-800" />
          <h3 className="font-display font-bold text-slate-900 text-base">Change Admin Password</h3>
        </div>

        {passSuccess && (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs font-semibold text-emerald-800 flex items-center justify-between">
            <span>{passSuccess}</span>
            <button onClick={() => setPassSuccess("")}>
              <X className="h-4 w-4" />
            </button>
          </div>
        )}
        {passError && (
          <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs font-semibold text-rose-800 flex items-center justify-between">
            <span>{passError}</span>
            <button onClick={() => setPassError("")}>
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        <form onSubmit={handleChangePassword} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">
              Current Password *
            </label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Enter current password"
              className={inputCls}
              required
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">
                New Password *
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                className={inputCls}
                required
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">
                Confirm New Password *
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                className={inputCls}
                required
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={passLoading}
            className="gap-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold"
          >
            <Key className="h-4 w-4" /> {passLoading ? "Saving…" : "Update Admin Password"}
          </Button>
        </form>
      </div>
    </div>
  );
}

// ── CONFIRM EXIT & LOGOUT MODAL ───────────────────────────────────────────
function ConfirmExitModal({
  isOpen,
  isFormDirty,
  target,
  onCancel,
  onConfirmLogout,
  onConfirmNavigateStore,
}: {
  isOpen: boolean;
  isFormDirty: boolean;
  target: "logout" | "store" | null;
  onCancel: () => void;
  onConfirmLogout: () => void;
  onConfirmNavigateStore: () => void;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 font-bold shrink-0 border border-amber-100">
            <Shield className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-display font-bold text-slate-900 text-base">
              {target === "logout" ? "Confirm Admin Sign Out" : "Leaving Admin Dashboard"}
            </h3>
            <p className="text-xs text-slate-500">Logout & Navigation Protection</p>
          </div>
        </div>

        <div className="text-xs text-slate-600 leading-relaxed space-y-2">
          {isFormDirty && (
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-amber-900 font-medium flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 shrink-0 text-amber-600 mt-0.5" />
              <span>
                Unsaved changes detected in Product Form. Exiting will discard your input.
              </span>
            </div>
          )}
          <p>
            {target === "logout"
              ? "Are you sure you want to sign out? You will need to re-enter your admin credentials."
              : "Would you like to return to the live storefront? You can choose to stay logged in or sign out."}
          </p>
        </div>

        <div className="flex flex-col gap-2.5 pt-2">
          {target === "store" && (
            <Button
              onClick={onConfirmNavigateStore}
              variant="secondary"
              className="w-full text-xs cursor-pointer py-2.5"
            >
              Go to Store (Stay Logged In)
            </Button>
          )}

          <Button
            onClick={onConfirmLogout}
            variant="destructive"
            className="w-full gap-1.5 text-xs cursor-pointer py-2.5"
          >
            <LogOut className="h-3.5 w-3.5" />{" "}
            {target === "logout" ? "Yes, Sign Out" : "Sign Out & Leave"}
          </Button>

          <Button
            onClick={onCancel}
            variant="outline"
            className="w-full text-xs cursor-pointer py-2.5"
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}

// ── UI HELPERS ─────────────────────────────────────────────────────────────
const inputCls =
  "w-full rounded-xl border border-slate-200 bg-slate-50/80 px-3.5 py-2.5 text-xs text-slate-900 outline-none transition focus:border-slate-600 focus:bg-white focus:ring-2 focus:ring-slate-600/10";

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">
        {label}
      </label>
      {children}
    </div>
  );
}
