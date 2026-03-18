"use server";

import { TAGS } from "lib/constants";
import { actionClient } from "lib/safe-action";
import {
  addToCart,
  createCart,
  getCart,
  removeFromCart,
  updateCart,
} from "lib/shopify";
import { updateTag } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";

export const addItem = actionClient
  .inputSchema(z.object({ selectedVariantId: z.string().min(1) }))
  .action(async ({ parsedInput: { selectedVariantId } }) => {
    await addToCart([{ merchandiseId: selectedVariantId, quantity: 1 }]);
    updateTag(TAGS.cart);
    return { success: true };
  });

export const removeItem = actionClient
  .inputSchema(z.object({ merchandiseId: z.string().min(1) }))
  .action(async ({ parsedInput: { merchandiseId } }) => {
    const cart = await getCart();
    if (!cart) throw new Error("Cart not found");
    const lineItem = cart.lines.find(
      (line) => line.merchandise.id === merchandiseId,
    );
    if (!lineItem?.id) throw new Error("Item not found in cart");
    await removeFromCart([lineItem.id]);
    updateTag(TAGS.cart);
    return { success: true };
  });

export const updateItemQuantity = actionClient
  .inputSchema(
    z.object({
      merchandiseId: z.string().min(1),
      quantity: z.number().int().min(0),
    }),
  )
  .action(async ({ parsedInput: { merchandiseId, quantity } }) => {
    const cart = await getCart();
    if (!cart) throw new Error("Cart not found");
    const lineItem = cart.lines.find(
      (line) => line.merchandise.id === merchandiseId,
    );
    if (lineItem?.id) {
      if (quantity === 0) {
        await removeFromCart([lineItem.id]);
      } else {
        await updateCart([{ id: lineItem.id, merchandiseId, quantity }]);
      }
    } else if (quantity > 0) {
      await addToCart([{ merchandiseId, quantity }]);
    }
    updateTag(TAGS.cart);
    return { success: true };
  });

export async function redirectToCheckout() {
  let cart = await getCart();
  redirect(cart!.checkoutUrl);
}

export async function createCartAndSetCookie() {
  let cart = await createCart();
  (await cookies()).set("cartId", cart.id!);
}
