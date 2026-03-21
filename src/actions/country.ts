"use server";

import { updateTag } from "next/cache";
import { cookies } from "next/headers";
import { COUNTRY_COOKIE } from "~/lib/country";
import { TAGS } from "src/lib/constants";
import { updateCartBuyerIdentity } from "src/lib/shopify";

export async function setCountry(countryCode: string) {
  const cookieStore = await cookies();
  const cartId = cookieStore.get("cartId")?.value;

  cookieStore.set(COUNTRY_COOKIE, countryCode, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });

  if (cartId) {
    await updateCartBuyerIdentity(countryCode);
  }

  updateTag(TAGS.cart);
  updateTag(TAGS.products);
  updateTag(TAGS.collections);
}
