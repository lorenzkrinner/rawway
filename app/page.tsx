import { Carousel } from "components/carousel";
import { ThreeItemGrid } from "components/grid/three-items";
import Footer from "components/layout/footer";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  description:
    "Rawway is a direct-to-consumer protein bar brand with a custom headless e-commerce storefront. The store sells protein bars in three flavors with a brand identity centered on minimal ingredients (5 or fewer), natural/earthy aesthetics, and sustainable paper packaging.",
  openGraph: {
    type: "website",
  },
};

export default function HomePage() {
  return (
    <>
      <ThreeItemGrid />
      <Carousel />
      <Suspense>
        <Footer />
      </Suspense>
    </>
  );
}
