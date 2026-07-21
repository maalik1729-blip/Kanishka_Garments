import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
  useLocation,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { ChatWidget } from "@/components/ui/chat-widget";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-4">
      <div className="max-w-md text-center font-favorit">
        <h1 className="text-6xl font-light tracking-tight text-black">404</h1>
        <h2 className="mt-4 text-lg font-medium text-black uppercase tracking-wider">
          Page Not Found
        </h2>
        <p className="mt-2 text-xs text-neutral-600">
          The editorial spread you are searching for does not exist or has been relocated.
        </p>
        <div className="mt-6">
          <Link to="/" className="btn-ghost-cta inline-block">
            RETURN TO CATALOG
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-4 font-favorit">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-normal tracking-tight text-black">
          System Temporarily Unavailable
        </h1>
        <p className="mt-2 text-xs text-neutral-600">
          We encountered a temporary layout glitch. You may refresh the view or return to home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="btn-ghost-cta"
          >
            REFRESH VIEW
          </button>
          <Link to="/" className="btn-filled-add py-2 px-6">
            RETURN HOME
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "KANISHKA GARMENTS — Editorial Apparel & Textile Manufacturing" },
      {
        name: "description",
        content:
          "Gallery-like activewear & fabric lookbook. Tirupur textile manufacturing, premium knitwear, and private label wholesale solutions.",
      },
      { name: "author", content: "KANISHKA GARMENTS" },
      {
        property: "og:title",
        content: "KANISHKA GARMENTS — Editorial Apparel & Textile Manufacturing",
      },
      {
        property: "og:description",
        content: "Clean monochrome apparel, knitwear, and custom wholesale manufacturing.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Nunito+Sans:wght@400;700&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");

  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex min-h-screen flex-col bg-white text-black font-favorit selection:bg-black selection:text-white">
        {!isAdmin && <SiteHeader />}
        <main className="flex-1">
          <Outlet />
        </main>
        {!isAdmin && <SiteFooter />}
        {!isAdmin && <ChatWidget />}
      </div>
    </QueryClientProvider>
  );
}
