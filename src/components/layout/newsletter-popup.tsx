"use client";

import { XIcon } from "lucide-react";
import Image from "next/image";
import { useActionState, useEffect, useState } from "react";
import { subscribeToNewsletter } from "~/actions/newsletter";
import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";

const COOKIE_NAME = "newsletter_popup_dismissed";
const SUBSCRIBED_COOKIE = "newsletter_subscribed";
const COOKIE_DAYS = 30;
const POPUP_DELAY_MS = 5000;

function getCookie(name: string): string | undefined {
  const match = document.cookie.match(
    new RegExp("(^| )" + name + "=([^;]+)"),
  );
  return match?.[2];
}

function setCookie(name: string, value: string, days: number) {
  const expires = new Date(Date.now() + days * 86400000).toUTCString();
  document.cookie = `${name}=${value};expires=${expires};path=/;SameSite=Lax`;
}

export default function NewsletterPopup() {
  const [open, setOpen] = useState(false);
  const [state, formAction, isPending] = useActionState(
    subscribeToNewsletter,
    null,
  );

  useEffect(() => {
    if (getCookie(SUBSCRIBED_COOKIE) || getCookie(COOKIE_NAME)) return;

    const timer = setTimeout(() => setOpen(true), POPUP_DELAY_MS);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (state?.success) {
      setCookie(SUBSCRIBED_COOKIE, "1", 365);
      const timer = setTimeout(() => setOpen(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [state?.success]);

  function handleDismiss() {
    setCookie(COOKIE_NAME, "1", COOKIE_DAYS);
    setOpen(false);
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-xs animate-in fade-in-0 duration-200"
        onClick={handleDismiss}
      />

      <div className="relative z-10 flex w-full h-full max-w-[70dvw] max-h-[70dvh] overflow-hidden rounded-xl bg-background ring-1 ring-foreground/10 animate-in fade-in-0 zoom-in-95 duration-200">
        <div className="relative hidden w-1/2 sm:block">
          <Image
            src="/images/promotions/newsletter.png"
            alt="Mechanical keyboard"
            fill
            className="object-cover"
            sizes="(min-width: 640px) 40vw, 0vw"
          />
        </div>

        <div className="relative flex flex-1 flex-col items-center justify-center px-8 py-10 text-center">
          <button
            onClick={handleDismiss}
            className="absolute top-3 right-3 rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            aria-label="Close"
          >
            <XIcon className="size-4" />
          </button>

          {state?.success ? (
            <div className="flex flex-col items-start w-full justify-center">
              <h2 className="font-loud text-2xl font-black tracking-wide text-foreground">
                YOU&apos;RE IN!
              </h2>
              <p className="mt-3 text-sm text-muted-foreground">
                {state.message}
              </p>
            </div>
          ) : (
            <>
              <div className="flex flex-col items-start w-full justify-center"> 
                <h2 className="font-loud text-3xl font-black text-start tracking-wide text-foreground">
                  GET 10% OFF
                </h2>
                <p className="mt-3 text-sm text-start leading-relaxed text-muted-foreground">
                  Sign up for our newsletter and receive{" "}
                  <span className="font-semibold text-foreground">10% off</span>{" "}
                  your first order.
                </p>
              </div>

              <form action={formAction} className="mt-6 w-full space-y-4">
                <input
                  type="email"
                  name="email"
                  placeholder="email@website.com"
                  required
                  disabled={isPending}
                  className="w-full border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/50 focus:border-foreground"
                />

                <div className="flex flex-col gap-2">
                  <Button
                    type="submit"
                    disabled={isPending}
                    className="py-7"
                  >
                    {isPending ? <Spinner className="size-4" /> : "Claim Offer"}
                  </Button>
                  <Button
                    type="submit"
                    variant="outline"
                    disabled={isPending}
                    className="py-7"
                  >
                    Decline
                  </Button>
                </div>

                {state?.message && !state.success && (
                  <p className="text-sm text-red-500">{state.message}</p>
                )}
              </form>

              <p className="mt-4 text-xs text-muted-foreground/70">
                Don&apos;t worry, we hate spam as much as you do
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
