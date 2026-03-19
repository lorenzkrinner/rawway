import { Metadata } from "next";
import { Climate_Crisis, Geist } from "next/font/google";
import { ReactNode, Suspense } from "react";
import { Toaster } from "sonner";
import { CartProvider } from "src/components/cart/cart-context";
import { Navbar } from "src/components/layout/navbar";
import { getCart } from "src/lib/shopify";
import Footer from "~/components/layout/footer";
import { NAV_HEIGHT } from "~/constants/layout";
import { cn } from "~/lib/cn";
import { baseUrl } from "~/lib/utils";
import "./globals.css";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });
const climateCrisis = Climate_Crisis({
  subsets: ["latin"],
  variable: "--font-loud",
  weight: ["400"],
});

const { SITE_NAME } = process.env;

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: SITE_NAME!,
    template: `%s | ${SITE_NAME}`,
  },
  robots: {
    follow: true,
    index: true,
  },
};

async function CartProviderWithData({ children }: { children: ReactNode }) {
  // Don't await the fetch, pass the Promise to the context provider
  const cart = getCart();
  return <CartProvider cartPromise={cart}>{children}</CartProvider>;
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={cn("font-sans", geist.variable, climateCrisis.variable)}
    >
      <body className="relative bg-background text-foreground selection:bg-primary/30 dark:selection:bg-primary/40">
        <Suspense>
          <CartProviderWithData>
            <Navbar />
            <main style={{ paddingTop: NAV_HEIGHT }}>
              {children}
              <Toaster closeButton />
            </main>
            <Suspense>
              <Footer />
            </Suspense>
          </CartProviderWithData>
        </Suspense>
      </body>
    </html>
  );
}
