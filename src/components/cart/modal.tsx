"use client";

import {
  ShoppingBagIcon,
  TruckIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";
import { useAction } from "next-safe-action/hooks";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import LoadingDots from "src/components/loading-dots";
import Price from "src/components/price";
import { DEFAULT_OPTION } from "src/lib/constants";
import type { Product } from "src/lib/shopify/types";
import { Button } from "~/components/ui/button";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Separator } from "~/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "~/components/ui/sheet";
import { cn, createUrl } from "~/lib/utils";
import { addItem, createCartAndSetCookie, redirectToCheckout } from "../../actions/cart";
import { Badge } from "../ui/badge";
import { useCart } from "./cart-context";
import { DeleteItemButton } from "./delete-item-button";
import { EditItemQuantityButton } from "./edit-item-quantity-button";

type MerchandiseSearchParams = {
  [key: string]: string;
};

const FREE_SHIPPING_THRESHOLD_EUR = 55;

type CartModalProps = {
  navTextClass: string;
  crossSellProducts: Product[];
  recommendedProducts: Product[];
};

function toPercent(value: number): number {
  return Math.max(0, Math.min(100, value));
}

function formatCurrency(value: number, currencyCode: string): string {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: currencyCode,
  }).format(value);
}

function toCartAddonProduct(product: Product) {
  const firstVariant = product.variants[0];
  return {
    id: product.id,
    handle: product.handle,
    title: product.title,
    featuredImage: product.featuredImage,
    priceRange: product.priceRange,
    firstVariant,
    product,
  };
}

function ShippingBanner({
  remaining,
  progress,
  currencyCode,
}: {
  remaining: number;
  progress: number;
  currencyCode: string;
}) {
  return (
    <div className="border-y border-muted-foreground/20 p-6 rounded-xl bg-muted space-y-4">
      <p className="text-center text-sm font-semibold text-foreground">
        {remaining > 0
          ? `You are ${formatCurrency(remaining, currencyCode)} away from FREE SHIPPING!`
          : "You unlocked FREE SHIPPING!"}
      </p>
      <div className="flex items-center">
        <div className="t-3 h-1.5 w-full rounded-full bg-muted-foreground/20">
          <div
            className="h-1.5 rounded-full bg-green-500 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div
          className={cn(
            "flex center size-7 rounded-full bg-muted-foreground/20 text-foreground",
            remaining === 0 && "bg-green-500 text-background",
          )}
        >
          <TruckIcon className="size-4" />
        </div>
      </div>
    </div>
  );
}

function CartCrossSell({
  products,
  onClose,
}: {
  products: Product[];
  onClose: () => void;
}) {
  const { addCartItem } = useCart();
  const { execute, isPending } = useAction(addItem);
  const visibleProducts = products.slice(0, 2).map(toCartAddonProduct);

  if (visibleProducts.length === 0) return null;

  return (
    <div className="space-y-2 py-4">
      <h3 className="text-sm font-semibold">Other people also bought</h3>
      {visibleProducts.map((item) => (
        <div
          key={item.id}
          className="flex items-center gap-3 rounded-lg border border-border bg-muted p-3"
        >
          <div className="relative size-14 overflow-hidden rounded-md bg-background">
            <Image
              src={item.featuredImage.url}
              alt={item.featuredImage.altText || item.title}
              fill
              className="object-contain"
              sizes="56px"
            />
          </div>
          <div className="min-w-0 flex-1">
            <Link
              href={`/product/${item.handle}`}
              onClick={onClose}
              className="truncate text-sm font-medium hover:underline"
            >
              {item.title}
            </Link>
            <Price
              amount={item.priceRange.maxVariantPrice.amount}
              currencyCode={item.priceRange.maxVariantPrice.currencyCode}
              className="text-xs text-muted-foreground"
            />
          </div>
          <Button
            size="sm"
            disabled={isPending || !item.firstVariant}
            onClick={() => {
              if (!item.firstVariant) return;
              addCartItem(item.firstVariant, item.product);
              execute({ selectedVariantId: item.firstVariant.id });
            }}
          >
            Add
          </Button>
        </div>
      ))}
    </div>
  );
}

function EmptyCartRecommendations({
  products,
  onClose,
}: {
  products: Product[];
  onClose: () => void;
}) {
  const visibleProducts = products.slice(0, 2);

  return (
    <div className="mt-10 w-full">
      <Link href="/search" onClick={onClose}>
        <Button className="w-full py-8 ">Browse shop</Button>
      </Link>
      {visibleProducts.length > 0 ? (
        <div className="space-y-2 mt-16">
          <h3 className="text-sm font-semibold">Recommended for you</h3>
          {visibleProducts.map((product) => (
            <div
              key={product.id}
              className="flex items-center gap-3 rounded-xl border border-border bg-muted p-3"
            >
              <div className="relative size-14 overflow-hidden rounded-md bg-background">
                <Image
                  src={product.featuredImage.url}
                  alt={product.featuredImage.altText || product.title}
                  fill
                  className="object-contain"
                  sizes="56px"
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{product.title}</p>
                <Price
                  amount={product.priceRange.maxVariantPrice.amount}
                  currencyCode={product.priceRange.maxVariantPrice.currencyCode}
                  className="text-xs text-muted-foreground"
                />
              </div>
              <Link href={`/product/${product.handle}`} onClick={onClose}>
                <Button
                  size="sm"
                  variant={"secondary"}
                  className="h-20 px-8 rounded-lg border border-border"
                >
                  Explore
                </Button>
              </Link>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export default function CartModal({
  navTextClass,
  crossSellProducts,
  recommendedProducts,
}: CartModalProps) {
  const { cart, updateCartItem } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const quantityRef = useRef(cart?.totalQuantity);
  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);

  useEffect(() => {
    if (!cart) {
      createCartAndSetCookie();
    }
  }, [cart]);

  useEffect(() => {
    if (
      cart?.totalQuantity &&
      cart?.totalQuantity !== quantityRef.current &&
      cart?.totalQuantity > 0
    ) {
      if (!isOpen) {
        setIsOpen(true);
      }
      quantityRef.current = cart?.totalQuantity;
    }
  }, [isOpen, cart?.totalQuantity, quantityRef]);

  const remaining = Math.max(
    FREE_SHIPPING_THRESHOLD_EUR -
      parseFloat(cart?.cost.subtotalAmount.amount ?? "0"),
    0,
  );
  const progress = toPercent(
    (parseFloat(cart?.cost.subtotalAmount.amount ?? "0") /
      FREE_SHIPPING_THRESHOLD_EUR) *
      100,
  );

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className={cn(`relative hover:bg-muted/20 rounded-lg`, navTextClass)}
        onClick={openCart}
      >
        <ShoppingBagIcon className="size-6" />

        {cart?.totalQuantity ? (
          <Badge className="absolute right-0 top-0 -mr-1 -mt-1 size-4 rounded-full px-0 text-[11px] font-medium">
            {cart?.totalQuantity}
          </Badge>
        ) : null}
      </Button>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent
          side="right"
          showCloseButton={false}
          className="flex h-full w-full flex-col border-l border-border bg-background/80 p-6 text-foreground backdrop-blur-xl md:w-[390px]"
        >
          <SheetHeader className="p-0">
            <div className="flex items-center justify-between">
              <SheetTitle className="text-lg font-semibold">My Cart</SheetTitle>
              <Button variant="ghost" size="icon" onClick={closeCart}>
                <XMarkIcon className="size-6" />
              </Button>
            </div>
          </SheetHeader>
          <div className="pt-4">
            <ShippingBanner
              remaining={remaining}
              progress={progress}
              currencyCode={cart?.cost.subtotalAmount.currencyCode ?? "EUR"}
            />
          </div>

          {!cart || cart.lines.length === 0 ? (
            <div className="mt-10 flex w-full flex-col items-center justify-center overflow-hidden">
              <ShoppingBagIcon className="h-16" />
              <p className="mt-6 text-center text-2xl font-bold">
                Your cart is empty.
              </p>
              <EmptyCartRecommendations
                products={recommendedProducts}
                onClose={closeCart}
              />
            </div>
          ) : (
            <div className="flex h-full flex-col justify-between overflow-hidden p-1">
              <ScrollArea className="grow py-4">
                <ul>
                  {cart.lines
                    .sort((a, b) =>
                      a.merchandise.product.title.localeCompare(
                        b.merchandise.product.title,
                      ),
                    )
                    .map((item, i) => {
                      const merchandiseSearchParams =
                        {} as MerchandiseSearchParams;

                      item.merchandise.selectedOptions.forEach(
                        ({ name, value }) => {
                          if (value !== DEFAULT_OPTION) {
                            merchandiseSearchParams[name.toLowerCase()] = value;
                          }
                        },
                      );

                      const merchandiseUrl = createUrl(
                        `/product/${item.merchandise.product.handle}`,
                        new URLSearchParams(merchandiseSearchParams),
                      );

                      return (
                        <li
                          key={i}
                          className="flex w-full flex-col border-b border-border"
                        >
                          <div className="relative flex w-full flex-row justify-between px-1 py-4">
                            <div className="absolute z-40 -ml-1 -mt-2">
                              <DeleteItemButton
                                item={item}
                                optimisticUpdate={updateCartItem}
                              />
                            </div>
                            <div className="flex flex-row">
                              <div className="relative h-16 w-16 overflow-hidden rounded-md border border-border bg-muted">
                                <Image
                                  className="h-full w-full object-cover"
                                  width={64}
                                  height={64}
                                  alt={
                                    item.merchandise.product.featuredImage
                                      .altText || item.merchandise.product.title
                                  }
                                  src={
                                    item.merchandise.product.featuredImage.url
                                  }
                                />
                              </div>
                              <Link
                                href={merchandiseUrl}
                                onClick={closeCart}
                                className="z-30 ml-2 flex flex-row space-x-4"
                              >
                                <div className="flex flex-1 flex-col text-base">
                                  <span className="leading-tight">
                                    {item.merchandise.product.title}
                                  </span>
                                  {item.merchandise.title !== DEFAULT_OPTION ? (
                                    <p className="text-sm text-muted-foreground">
                                      {item.merchandise.title}
                                    </p>
                                  ) : null}
                                </div>
                              </Link>
                            </div>
                            <div className="flex h-16 flex-col justify-between">
                              <Price
                                className="flex justify-end space-y-2 text-right text-sm"
                                amount={item.cost.totalAmount.amount}
                                currencyCode={
                                  item.cost.totalAmount.currencyCode
                                }
                              />
                              <div className="ml-auto flex h-9 flex-row items-center rounded-full border border-border">
                                <EditItemQuantityButton
                                  item={item}
                                  type="minus"
                                  optimisticUpdate={updateCartItem}
                                />
                                <p className="w-6 text-center">
                                  <span className="w-full text-sm">
                                    {item.quantity}
                                  </span>
                                </p>
                                <EditItemQuantityButton
                                  item={item}
                                  type="plus"
                                  optimisticUpdate={updateCartItem}
                                />
                              </div>
                            </div>
                          </div>
                        </li>
                      );
                    })}
                </ul>
                <CartCrossSell
                  products={crossSellProducts}
                  onClose={closeCart}
                />
              </ScrollArea>
              <div className="py-4 text-sm text-muted-foreground">
                <div className="mb-3 flex items-center justify-between pb-1">
                  <p>Taxes</p>
                  <Price
                    className="text-right text-base text-foreground"
                    amount={cart.cost.totalTaxAmount.amount}
                    currencyCode={cart.cost.totalTaxAmount.currencyCode}
                  />
                </div>
                <Separator className="mb-3" />
                <div className="mb-3 flex items-center justify-between pb-1 pt-1">
                  <p>Shipping</p>
                  <p className="text-right">
                    {remaining > 0 ? `Calculated at checkout` : `FREE`}
                  </p>
                </div>
                <Separator className="mb-3" />
                <div className="mb-3 flex items-center justify-between pb-1 pt-1">
                  <p>Total</p>
                  <Price
                    className="text-right text-base text-foreground"
                    amount={cart.cost.totalAmount.amount}
                    currencyCode={cart.cost.totalAmount.currencyCode}
                  />
                </div>
                <Separator className="mb-3" />
              </div>
              <form action={redirectToCheckout}>
                <CheckoutButton />
              </form>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}

function CheckoutButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      className="w-full py-8 text-center text-sm font-medium opacity-90 hover:opacity-100"
      type="submit"
      disabled={pending}
    >
      {pending ? (
        <LoadingDots className="bg-primary-foreground" />
      ) : (
        "Proceed to Checkout"
      )}
    </Button>
  );
}
