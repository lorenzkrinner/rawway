import { Suspense } from "react";
import Footer from "src/components/layout/footer";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="w-full">
        <div className="mx-8 max-w-2xl py-20 sm:mx-auto">{children}</div>
      </div>
      <Suspense>
        <Footer />
      </Suspense>
    </>
  );
}
