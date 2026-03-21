"use client";

import { ChevronRightIcon } from "@heroicons/react/24/outline";
import { useActionState, useEffect } from "react";
import { subscribeToNewsletter } from "~/actions/newsletter";
import { Spinner } from "../ui/spinner";

export default function NewsletterForm() {
  const [state, formAction, isPending] = useActionState(
    subscribeToNewsletter,
    null,
  );

  useEffect(() => {
    if (state?.success) {
      const expires = new Date(Date.now() + 365 * 86400000).toUTCString();
      document.cookie = `newsletter_subscribed=1;expires=${expires};path=/;SameSite=Lax`;
    }
  }, [state?.success]);

  return (
    <div>
      <h3 className="font-loud text-2xl font-black text-foreground">
        Get 10% off your first order
      </h3>
      <p className="mt-4 text-sm leading-relaxed">
        Sign up now to,{" "}
        <span className="font-semibold text-foreground">get a 10% discount on your first order</span>{", "}
        exclusive{" "}
        <span className="font-semibold text-foreground">updates</span>, and
        behind-the-scenes{" "}
        <span className="font-semibold text-foreground">insights</span>!
      </p>
      {state?.success ? (
        <p className="mt-6 text-sm font-medium text-foreground">
          {state.message}
        </p>
      ) : (
        <>
          <form
            action={formAction}
            className="mt-6 flex items-center border-2 border-border bg-background transition-[border] duration-300 ease-in-out focus-within:border-foreground"
          >
            <input
              type="email"
              name="email"
              placeholder="E-mail"
              required
              disabled={isPending}
              className="w-full border-none bg-transparent py-3 pl-5 pr-2 text-sm text-foreground outline-none placeholder:text-muted-foreground/50 focus:ring-0"
            />
            <button
              type="submit"
              disabled={isPending}
              className="mr-1 flex size-8 flex-shrink-0 items-center justify-center text-muted-foreground transition-colors hover:text-foreground disabled:opacity-50"
              aria-label="Subscribe"
            >
              {isPending ? (
                <Spinner className="size-4" />
              ) : (
                <ChevronRightIcon className="size-4" />
              )}
            </button>
          </form>
          {state?.message && (
            <p className="mt-2 text-sm text-red-500">{state.message}</p>
          )}
        </>
      )}
    </div>
  );
}
