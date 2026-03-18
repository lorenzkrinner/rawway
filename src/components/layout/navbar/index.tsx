import { getCollections, getMenu } from "src/lib/shopify";
import { FRONT_HEADER_MENU_HANDLE } from "~/constants/shopify";
import NavbarClient from "./navbar-client";

export async function Navbar() {
  const [menu, collections] = await Promise.all([
    getMenu(FRONT_HEADER_MENU_HANDLE),
    getCollections(),
  ]);

  return <NavbarClient menu={menu} collections={collections} />;
}
