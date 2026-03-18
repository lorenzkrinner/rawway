import { GeistSans } from "geist/font/sans";
import { Metadata } from "next";
import { ReactNode, Suspense } from "react";
import { Toaster } from "sonner";
import { CartProvider } from "src/components/cart/cart-context";
import { Navbar } from "src/components/layout/navbar";
import { WelcomeToast } from "src/components/welcome-toast";
import { getCart } from "src/lib/shopify";
import { baseUrl, cn } from "src/lib/utils";
import "./globals.css";
import { Geist } from "next/font/google";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

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
    <html lang="en" className={cn("font-sans", geist.variable)}>
      <body className="bg-neutral-50 text-black selection:bg-teal-300 dark:bg-neutral-900 dark:text-white dark:selection:bg-pink-500 dark:selection:text-white">
        <Suspense>
          <CartProviderWithData>
            <Navbar />
            <main>
              {children}
              <Toaster closeButton />
              <WelcomeToast />
            </main>
          </CartProviderWithData>
        </Suspense>
      </body>
    </html>
  );
}
