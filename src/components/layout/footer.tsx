import Link from "next/link";

import { ChevronRightIcon } from "@heroicons/react/24/outline";
import Logo from "../icons/logo";

const helpLinks = [
  { title: "Shop", href: "/search" },
  { title: "FAQ", href: "/faq" },
  { title: "Contact", href: "/contact" },
  { title: "Returns", href: "/returns" },
  { title: "Shipping", href: "/shipping" },
  { title: "Privacy", href: "/privacy" },
  { title: "Legal", href: "/legal" },
];

export default function Footer() {
  return (
    <footer className="bg-accent text-muted-foreground">
      <div className="mx-auto w-full max-w-7xl px-6 py-16 md:px-4 min-[1320px]:px-0">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-3 md:gap-16">
          <div>
            <Logo className="text-lg text-foreground" />
            <p className="mt-4 text-sm leading-relaxed">
              Nowadays people become successful by pressing the right keys at
              the right time with the right mindset. Will you be the next one?
            </p>
            <p className="mt-6 text-sm">
              E-Mail:{" "}
              <a
                href="mailto:support@usekeon.com"
                className="underline underline-offset-2 transition-colors hover:text-foreground"
              >
                support@usekeon.com
              </a>
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground">
              Help and Support
            </h3>
            <ul className="mt-4 space-y-3">
              {helpLinks.map((link) => (
                <li key={link.title}>
                  <Link
                    href={link.href}
                    className="text-sm transition-colors hover:text-foreground"
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-loud text-2xl font-black text-foreground">
              Join our community
            </h3>
            <p className="mt-4 text-sm leading-relaxed">
              Sign up now to get exclusive{" "}
              <span className="font-semibold text-foreground">
                early access
              </span>{" "}
              for future drops, important{" "}
              <span className="font-semibold text-foreground">updates</span>,
              and behind-the-scenes{" "}
              <span className="font-semibold text-foreground">insights</span>!
            </p>
            <form className="mt-6 flex items-center focus-within:border-foreground border-border border-2 transition-[border] ease-in-out duration-300">
              <input
                type="email"
                placeholder="E-mail"
                className="w-full bg-transparent py-3 pl-5 pr-2 text-sm text-foreground placeholder:text-muted-foreground/50 active:border-1 border-border outline-none border-none focus:ring-0"
              />
              <button
                type="submit"
                className="mr-1 flex h-8 w-8 flex-shrink-0 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
                aria-label="Subscribe"
              >
                <ChevronRightIcon className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </footer>
  );
}
