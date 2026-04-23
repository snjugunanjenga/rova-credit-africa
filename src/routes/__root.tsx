import {
  Outlet,
  createRootRouteWithContext,
  HeadContent,
  Scripts,
  Link,
} from "@tanstack/react-router";
import type { QueryClient } from "@tanstack/react-query";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";

import appCss from "../styles.css?url";

interface RouterContext {
  queryClient: QueryClient;
}

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<RouterContext>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "RovaCredit Africa — Phone financing for Uganda & East Africa" },
      {
        name: "description",
        content:
          "Pan-African asset financing platform. Own your smartphone today, pay flexibly via MTN MoMo & Airtel Money. Serving Uganda, Kenya, Tanzania & Rwanda.",
      },
      { name: "author", content: "RovaCredit Africa" },
      { property: "og:title", content: "RovaCredit Africa — Phone financing for Uganda & East Africa" },
      {
        property: "og:description",
        content: "Own your smartphone today, pay flexibly via mobile money.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: "RovaCredit Africa — Phone financing for Uganda & East Africa" },
      { name: "description", content: "Pan-African asset financing platform for smartphone and SME device credit." },
      { property: "og:description", content: "Pan-African asset financing platform for smartphone and SME device credit." },
      { name: "twitter:description", content: "Pan-African asset financing platform for smartphone and SME device credit." },
      { property: "og:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/QKIGp8fuYFcfdNHT3YKjiiQdmc23/social-images/social-1776951501241-rova_credit_logo.webp" },
      { name: "twitter:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/QKIGp8fuYFcfdNHT3YKjiiQdmc23/social-images/social-1776951501241-rova_credit_logo.webp" },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
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
  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
      <Toaster richColors position="top-right" />
    </QueryClientProvider>
  );
}
