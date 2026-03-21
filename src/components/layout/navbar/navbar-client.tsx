"use client";

import { HeartIcon as HeartIconOutline } from "@heroicons/react/24/outline";
import { ChevronDownIcon, UserIcon } from "@heroicons/react/24/solid";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import CartModal from "src/components/cart/modal";
import type {
  Collection,
  Menu,
  Product,
  ShopifyCountry,
} from "src/lib/shopify/types";
import Logo from "~/components/icons/logo";
import { Button } from "~/components/ui/button";
import { NAV_HEIGHT } from "~/constants/layout";
import { cn } from "~/lib/cn";
import { CountryPicker } from "./country-picker";
import MobileMenu from "./mobile-menu";
import Search from "./search";
import { ShopMegaMenu } from "./shop-mega-menu";

const SHOP_NAV_INDEX = 0;

const NAV_LINKS = [
  {
    title: "Shop",
    path: "/search",
    expandable: true,
  },
  {
    title: "Contact",
    path: "/contact",
    expandable: false,
  },
] as const;

export default function NavbarClient({
  menu,
  collections,
  cartCrossSellProducts,
  cartRecommendedProducts,
  originalSeriesProducts,
  countries,
  currentCountryCode,
}: {
  menu: Menu[];
  collections: Collection[];
  cartCrossSellProducts: Product[];
  cartRecommendedProducts: Product[];
  originalSeriesProducts: Product[];
  countries: ShopifyCountry[];
  currentCountryCode: string;
}) {
  const pathname = usePathname();
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [hasMounted, setHasMounted] = useState(false);
  const [windowHeight, setWindowHeight] = useState(0);
  const [scrollPosition, setScrollPosition] = useState(0);
  const TRANSITION = "transition-colors duration-300 ease-in-out";

  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const openExpandablePanel =
    hoverIndex === SHOP_NAV_INDEX && NAV_LINKS[SHOP_NAV_INDEX]?.expandable;

  function cancelCloseTimer() {
    if (closeTimerRef.current !== null) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  }

  function scheduleCloseMenu() {
    cancelCloseTimer();
    closeTimerRef.current = setTimeout(() => {
      setHoverIndex(null);
      closeTimerRef.current = null;
    }, 200);
  }

  function onNavItemEnter(index: number) {
    cancelCloseTimer();
    setHoverIndex(index);
  }

  useEffect(() => {
    return () => cancelCloseTimer();
  }, []);

  useEffect(() => {
    setWindowHeight(window.innerHeight);
    setScrollPosition(window.scrollY);
    setHasMounted(true);

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
  const isAboveTheFold = hasMounted && scrollPosition < windowHeight;
  const isHoveringOverExpandable =
    hoverIndex !== null && NAV_LINKS[hoverIndex]?.expandable;

  const heroLightNav = isHome && isAboveTheFold && !isHoveringOverExpandable;

  const navBgClass = heroLightNav
    ? `bg-transparent ${TRANSITION}`
    : `bg-background ${TRANSITION}`;
  const navTextClass = heroLightNav
    ? `text-background hover:text-background dark:text-foreground ${TRANSITION}`
    : `text-foreground ${TRANSITION}`;
  const navTextMutedClass = heroLightNav
    ? `text-background/60 dark:text-foreground/60 ${TRANSITION}`
    : `text-foreground/60 ${TRANSITION}`;
  const searchBgClass = heroLightNav
    ? `bg-background/30 ${TRANSITION}`
    : `bg-foreground/5 ${TRANSITION}`;

  const maxBlurPx = 12;
  const blurProgress = Math.min(
    scrollPosition / (Math.max(windowHeight, 1) * 0.3),
    1,
  );
  const backdropBlurPx = isHome ? blurProgress * maxBlurPx : 0;

  return (
    <>
      <nav
        className={cn(
          "fixed top-0 left-0 right-0 z-50 w-full flex items-center justify-between px-6 transition-[background-color,backdrop-filter] duration-300 ease-in-out",
          navBgClass,
        )}
        style={{
          height: NAV_HEIGHT,
          backdropFilter: isHoveringOverExpandable
            ? "none"
            : `blur(${backdropBlurPx}px)`,
          WebkitBackdropFilter: isHoveringOverExpandable
            ? "none"
            : `blur(${backdropBlurPx}px)`,
        }}
      >
        <div className="block flex-none md:hidden">
          <MobileMenu menu={menu} navTextClass={navTextClass} />
        </div>
        <div className="flex h-full w-full items-center justify-between">
          <div className="flex w-1/3 flex-none items-center justify-start">
            <Link
              href="/"
              prefetch={true}
              className="mr-2 flex w-full items-center justify-center md:w-auto lg:mr-6"
            >
              <Logo className={navTextClass} />
            </Link>
          </div>
          <ul className="hidden h-full items-center gap-2 text-sm md:flex">
            {NAV_LINKS.map((item, index) => (
              <li
                key={item.title}
                className="flex h-full items-center"
                onMouseLeave={scheduleCloseMenu}
              >
                <Link
                  href={item.path}
                  prefetch={true}
                  className={cn(
                    "group inline-flex items-center gap-2 rounded-lg p-2 underline-offset-4 hover:bg-muted/20",
                    navTextClass,
                  )}
                  onMouseEnter={() => onNavItemEnter(index)}
                >
                  {item.title}
                  {item.expandable ? (
                    <ChevronDownIcon
                      className="size-4 shrink-0 transition-transform duration-300 ease-in-out group-hover:rotate-180"
                      aria-hidden
                    />
                  ) : null}
                </Link>
              </li>
            ))}
          </ul>
          <div className="flex w-1/3 flex-none justify-end gap-3">
            <div className="flex items-center gap-2">
              <Search
                collections={collections}
                navTextMutedClass={navTextMutedClass}
                searchBgClass={searchBgClass}
              />
              <CountryPicker
                countries={countries}
                currentCountryCode={currentCountryCode}
                navTextClass={navTextClass}
              />
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className={cn(`rounded-lg hover:bg-muted/20`, navTextClass)}
              >
                <UserIcon className="size-6" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className={cn(`rounded-lg hover:bg-muted/20`, navTextClass)}
              >
                <HeartIconOutline className="size-6" />
              </Button>
              <CartModal
                navTextClass={navTextClass}
                crossSellProducts={cartCrossSellProducts}
                recommendedProducts={cartRecommendedProducts}
              />
            </div>
          </div>
        </div>
      </nav>
      {openExpandablePanel ? (
        <div
          className="animate-in fade-in slide-in-from-top-2 fixed inset-x-0 z-50 w-full border-b border-foreground/10 bg-background fill-mode-both -mt-px pt-px duration-100 ease-out"
          style={{ top: NAV_HEIGHT }}
          onMouseEnter={() => onNavItemEnter(SHOP_NAV_INDEX)}
          onMouseLeave={scheduleCloseMenu}
        >
          <ShopMegaMenu
            collections={collections}
            originalSeriesProducts={originalSeriesProducts}
          />
        </div>
      ) : null}
    </>
  );
}
