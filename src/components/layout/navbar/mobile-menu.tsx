"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { Menu } from "src/lib/shopify/types";
import { Sheet, SheetContent } from "~/components/ui/sheet";

export default function MobileMenu({
  menu,
  navTextClass,
}: {
  menu: Menu[];
  navTextClass: string;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const openMobileMenu = () => setIsOpen(true);
  const closeMobileMenu = () => setIsOpen(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isOpen]);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname, searchParams]);

  return (
    <>
      <button
        onClick={openMobileMenu}
        aria-label="Open mobile menu"
        className={`flex h-11 w-11 items-center justify-center rounded-md border border-border transition-colors md:hidden ${navTextClass}`}
      >
        <Bars3Icon className="h-4" />
      </button>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent
          side="left"
          showCloseButton={false}
          className="flex h-full w-full flex-col bg-background pb-6"
        >
          <div className="p-4">
            <button
              className={`mb-4 flex h-11 w-11 items-center justify-center rounded-md border border-border transition-colors ${navTextClass}`}
              onClick={closeMobileMenu}
              aria-label="Close mobile menu"
            >
              <XMarkIcon className="h-6" />
            </button>

            {menu.length ? (
              <ul className="flex w-full flex-col">
                {menu.map((item: Menu) => (
                  <li
                    className={`py-2 text-xl transition-colors hover:text-muted-foreground ${navTextClass}`}
                    key={item.title}
                  >
                    <Link
                      href={item.path}
                      prefetch={true}
                      onClick={closeMobileMenu}
                    >
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
