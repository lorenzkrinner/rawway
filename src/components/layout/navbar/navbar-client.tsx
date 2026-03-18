"use client";

import { UserIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import { usePathname } from "next/navigation";
import CartModal from "src/components/cart/modal";
import type { Collection, Menu } from "src/lib/shopify/types";
import Logo from "~/components/icons/logo";
import { Button } from "~/components/ui/button";
import { NAV_HEIGHT } from "~/constants/layout";
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
  const isHome = pathname === "/";

  const navTextClass = isHome
    ? "text-background dark:text-foreground"
    : "text-foreground";
  const navTextMutedClass = isHome
    ? "text-background/60 dark:text-foreground/60"
    : "text-foreground/60";

  const searchBgClass = isHome ? "bg-background/30" : "bg-foreground/5";

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-1 w-full flex items-center justify-between px-4 lg:px-6"
      style={{ height: NAV_HEIGHT }}
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
