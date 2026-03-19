"use client";

import { UserIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import CartModal from "src/components/cart/modal";
import type { Collection, Menu } from "src/lib/shopify/types";
import Logo from "~/components/icons/logo";
import { Button } from "~/components/ui/button";
import { NAV_HEIGHT } from "~/constants/layout";
import { cn } from "~/lib/cn";
import MobileMenu from "./mobile-menu";
import Search from "./search";

export default function NavbarClient({
  menu,
  collections,
}: {
  menu: Menu[];
  collections: Collection[];
}) {
  const pathname = usePathname();
  const [windowHeight, setWindowHeight] = useState(
    typeof window !== "undefined" ? window.innerHeight : 0
  );
  const [scrollPosition, setScrollPosition] = useState(0);
  const [navTextClass, setNavTextClass] = useState("text-foreground");
  const [navTextMutedClass, setNavTextMutedClass] = useState("text-foreground/60");
  const [searchBgClass, setSearchBgClass] = useState("bg-foreground/5");

  useEffect(() => {
    function handleResize() {
      setWindowHeight(window.innerHeight);
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    function handleScroll() {
      setScrollPosition(window.scrollY);
    }
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isHome = pathname === "/";
  const isAboveTheFold = scrollPosition < windowHeight;

  useEffect(() => {
    setNavTextClass((isHome && isAboveTheFold)
    ? "text-background dark:text-foreground transition-colors duration-300 ease-in-out"
    : "text-foreground transition-colors duration-300 ease-in-out")
    setNavTextMutedClass((isHome && isAboveTheFold)
    ? "text-background/60 dark:te)xt-foreground/60 transition-colors duration-300 ease-in-out"
    : "text-foreground/60 transition-colors duration-300 ease-in-out");
    setSearchBgClass(isHome && isAboveTheFold
      ? "bg-background/30 transition-colors duration-300 ease-in-out"
      : "bg-foreground/5 transition-colors duration-300 ease-in-out");
  }, [isHome, isAboveTheFold]);

  const maxBlurPx = 12;
  const blurProgress = Math.min(scrollPosition / (Math.max(windowHeight, 1) * 0.3), 1);
  const backdropBlurPx = isHome ? blurProgress * maxBlurPx : 0;
  const backgroundAlphaPercent = isHome ? blurProgress * 30 : 0;

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-10 w-full flex items-center justify-between px-6 transition-[background-color,backdrop-filter] duration-300 ease-in-out",
        "bg-transparent"
      )}
      style={{
        height: NAV_HEIGHT,
        backgroundColor: isHome
          ? `color-mix(in srgb, var(--color-background) ${backgroundAlphaPercent}%, transparent)`
          : "transparent",
        backdropFilter: `blur(${backdropBlurPx}px)`,
        WebkitBackdropFilter: `blur(${backdropBlurPx}px)`,
      }}
    >
      <div className="block flex-none md:hidden">
        <MobileMenu menu={menu} navTextClass={navTextClass} />
      </div>

      <div className="flex w-full items-center justify-between">
        <div className="flex items-center justify-start w-1/3">
          <Link
            href="/"
            prefetch={true}
            className="mr-2 flex w-full items-center justify-center md:w-auto lg:mr-6"
          >
            <Logo className={navTextClass} />
          </Link>
        </div>

        {menu.length ? (
          <ul className="hidden gap-6 text-sm md:flex md:items-center">
            {menu.map((item: Menu) => (
              <li key={item.title}>
                <Link
                  href={item.path}
                  prefetch={true}
                  className={`${navTextClass} underline-offset-4 hover:underline`}
                >
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
        ) : null}

        <div className="flex justify-end w-1/3 gap-3">
          <Search
            collections={collections}
            navTextMutedClass={navTextMutedClass}
            searchBgClass={searchBgClass}
          />

          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              className={`${navTextClass} hover:bg-muted/20 rounded-lg`}
            >
              <UserIcon className="size-6" />
            </Button>

            <CartModal navTextClass={navTextClass} />
          </div>
        </div>
      </div>
    </nav>
  );
}
