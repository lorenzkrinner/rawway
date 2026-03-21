import {
  getCollectionProducts,
  getCollections,
  getLocalization,
  getMenu,
} from "src/lib/shopify";
import { getCountryCode } from "~/lib/country";
import {
  FRONT_HEADER_MENU_HANDLE,
  HIDDEN_CART_CROSS_SELL_COLLECTION_HANDLE,
  HIDDEN_CART_RECOMMENDED_COLLECTION_HANDLE,
  ORIGINAL_SERIES_COLLECTION_HANDLE,
} from "~/constants/shopify";
import NavbarClient from "./navbar-client";

export async function Navbar() {
  const [
    menu,
    collections,
    cartCrossSellProducts,
    cartRecommendedProducts,
    originalSeriesProducts,
    countries,
    countryCode,
  ] = await Promise.all([
    getMenu(FRONT_HEADER_MENU_HANDLE),
    getCollections(),
    getCollectionProducts({
      collection: HIDDEN_CART_CROSS_SELL_COLLECTION_HANDLE,
    }),
    getCollectionProducts({
      collection: HIDDEN_CART_RECOMMENDED_COLLECTION_HANDLE,
    }),
    getCollectionProducts({
      collection: ORIGINAL_SERIES_COLLECTION_HANDLE,
    }),
    getLocalization(),
    getCountryCode(),
  ]);

  return (
    <NavbarClient
      menu={menu}
      collections={collections}
      cartCrossSellProducts={cartCrossSellProducts}
      cartRecommendedProducts={cartRecommendedProducts}
      originalSeriesProducts={originalSeriesProducts}
      countries={countries}
      currentCountryCode={countryCode}
    />
  );
}
