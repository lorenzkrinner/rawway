"use client";

import { useActionState } from "react";
import { sendContactForm } from "~/actions/contact";
import { Button } from "~/components/ui/button";
import { Spinner } from "~/components/ui/spinner";

export default function ContactPage() {
  const [state, formAction, isPending] = useActionState(sendContactForm, null);

  return (
    <div className="bg-background min-h-[70dvh] flex center flex-col w-full">
      <div className="pb-10 pt-20 text-center md:pt-28">
        <p className="text-xs font-medium uppercase tracking-[0.3em] text-muted-foreground">
          Get in Touch
        </p>
        <h1 className="font-loud mt-4 text-5xl font-black md:text-6xl">
          Contact Us
        </h1>
        <div className="mx-auto mt-6 h-px w-12 bg-border" />
      </div>

      <div className="mx-auto max-w-lg px-6 pb-20 w-full">
        {state?.success ? (
          <div className="text-center">
            <p className="text-lg font-medium text-foreground">
              {state.message}
            </p>
          </div>
        ) : (
          <form action={formAction} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block text-sm font-medium text-foreground"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                name="email"
                required
                disabled={isPending}
                placeholder="your@email.com"
                className="w-full border-2 border-border bg-transparent px-4 py-3 text-sm text-foreground outline-none transition-[border] duration-300 ease-in-out placeholder:text-muted-foreground/50 focus:border-foreground disabled:opacity-50"
              />
            </div>

            <div>
              <label
                htmlFor="subject"
                className="mb-1.5 block text-sm font-medium text-foreground"
              >
                Subject
              </label>
              <input
                id="subject"
                type="text"
                name="subject"
                required
                disabled={isPending}
                placeholder="What's this about?"
                className="w-full border-2 border-border bg-transparent px-4 py-3 text-sm text-foreground outline-none transition-[border] duration-300 ease-in-out placeholder:text-muted-foreground/50 focus:border-foreground disabled:opacity-50"
              />
            </div>

            <div>
              <label
                htmlFor="body"
                className="mb-1.5 block text-sm font-medium text-foreground"
              >
                Message
              </label>
              <textarea
                id="body"
                name="body"
                required
                disabled={isPending}
                rows={6}
                placeholder="Tell us what's on your mind..."
                className="w-full resize-none border-2 border-border bg-transparent px-4 py-3 text-sm text-foreground outline-none transition-[border] duration-300 ease-in-out placeholder:text-muted-foreground/50 focus:border-foreground disabled:opacity-50"
              />
            </div>

            {state?.message && (
              <p className="text-sm text-red-500">{state.message}</p>
            )}

            <Button
              type="submit"
              disabled={isPending}
              className="w-full py-8 text-sm font-medium"
            >
              {isPending ? <Spinner className="size-4" /> : "Send Message"}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
