import Link from "next/link";

import Logo from "../icons/logo";
import NewsletterForm from "./newsletter-form";

const helpLinks = [
  { title: "Shop", href: "/search" },
  { title: "Contact", href: "/contact" },
  { title: "Policies", href: "/policies" },
];

export default function Footer() {
  return (
    <footer className="bg-accent text-muted-foreground overflow-hidden">
      <div className="w-full min-[1320px]:px-0 flex flex-col center">
        <div className="mx-auto px-6 py-16 lg:py-24 md:px-4  grid grid-cols-1 gap-12 md:grid-cols-3 md:gap-16 max-w-7xl">
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

          <NewsletterForm />
        </div>
        <div className="relative w-full h-50">
          <div className="bg-linear-to-t from-muted to-transparent absolute inset-0 z-5 flex-1" />
          <span className="absolute -top-50 left-1/2 -translate-x-1/2 text-center text-[390px] w-fit font-loud uppercase">KEON</span>
        </div>
      </div>
    </footer>
  );
}
