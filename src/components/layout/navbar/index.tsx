import Link from "next/link";
import { Suspense } from "react";
import CartModal from "src/components/cart/modal";
import { getMenu } from "src/lib/shopify";
import { Menu } from "src/lib/shopify/types";
import Logo from "~/components/icons/logo";
import { FRONT_HEADER_MENU_HANDLE } from "~/constants/shopify";
import MobileMenu from "./mobile-menu";
import Search, { SearchSkeleton } from "./search";

export async function Navbar() {
  const menu = await getMenu(FRONT_HEADER_MENU_HANDLE);

  return (
    <nav className="fixed top-0 left-0 right-0 z-1 w-full flex items-center justify-between p-4 lg:px-6">
      <div className="block flex-none md:hidden">
        <Suspense fallback={null}>
          <MobileMenu menu={menu} />
        </Suspense>
      </div>
      <div className="flex w-full items-center">
        <div className="flex w-full md:w-1/3">
          <Link
            href="/"
            prefetch={true}
            className="mr-2 flex w-full items-center justify-center md:w-auto lg:mr-6"
          >
            <Logo className="text-background" />
          </Link>
          {menu.length ? (
            <ul className="hidden gap-6 text-sm md:flex md:items-center">
              {menu.map((item: Menu) => (
                <li key={item.title}>
                  <Link
                    href={item.path}
                    prefetch={true}
                    className="text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
        <div className="flex justify-end md:w-1/3 gap-2">
          <div className="hidden md:block">
            <Suspense fallback={<SearchSkeleton />}>
              <Search />
            </Suspense>
          </div>
          <Suspense fallback={null}>
            <CartModal />
          </Suspense>
        </div>
      </div>
    </nav>
  );
}
