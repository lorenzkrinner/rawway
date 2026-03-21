import type { Metadata } from "next";

import ContactPage from "~/components/pages/contact/contact-page";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with the Keon team. We'd love to hear from you.",
};

export default function Page() {
  return <ContactPage />;
}
