"use client";

import { useState } from "react";
import { cn } from "~/lib/cn";

const policies = [
  { id: "shipping", label: "Shipping Policy" },
  { id: "refund", label: "Refund Policy" },
  { id: "privacy", label: "Privacy Policy" },
  { id: "terms", label: "Terms of Service" },
] as const;

type PolicyId = (typeof policies)[number]["id"];

export default function PoliciesPage() {
  const [activePolicy, setActivePolicy] = useState<PolicyId>("shipping");

  return (
    <div className="bg-background">
      {/* Header */}
      <div className="pb-10 pt-20 text-center md:pt-28">
        <p className="text-xs font-medium uppercase tracking-[0.3em] text-muted-foreground">
          Our Commitments
        </p>
        <h1 className="font-loud mt-4 text-5xl font-black md:text-6xl">
          Policies
        </h1>
        <div className="mx-auto mt-6 h-px w-12 bg-border" />
      </div>

      {/* Tabs */}
      <div className="mx-auto max-w-5xl px-6 md:px-4 min-[1320px]:px-0">
        <div className="flex border-b border-border">
          {policies.map((policy) => (
            <button
              key={policy.id}
              onClick={() => setActivePolicy(policy.id)}
              className={cn(
                "flex-1 pb-4 text-xs font-medium uppercase tracking-[0.2em] transition-colors md:text-sm",
                activePolicy === policy.id
                  ? "border-b-2 border-foreground text-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {policy.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-3xl px-6 py-12 md:px-4 md:py-16 min-[1320px]:px-0">
        <PolicyContent policyId={activePolicy} />
      </div>
    </div>
  );
}

function PolicyContent({ policyId }: { policyId: PolicyId }) {
  switch (policyId) {
    case "shipping":
      return <ShippingPolicy />;
    case "refund":
      return <RefundPolicy />;
    case "privacy":
      return <PrivacyPolicy />;
    case "terms":
      return <TermsOfService />;
  }
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-10">
      <h2 className="mb-4 text-lg font-semibold text-foreground">{title}</h2>
      <div className="space-y-3 text-sm leading-relaxed text-muted-foreground">
        {children}
      </div>
    </div>
  );
}

function ShippingPolicy() {
  return (
    <>
      <Section title="Processing Time">
        <p>
          All orders are processed within 1–3 business days after payment
          confirmation. Orders placed on weekends or holidays will be processed
          on the next business day.
        </p>
      </Section>

      <Section title="Shipping Methods & Delivery Times">
        <p>We offer the following shipping options:</p>
        <ul className="ml-4 list-disc space-y-1">
          <li>
            <strong className="text-foreground">Standard Shipping:</strong> 5–10
            business days
          </li>
          <li>
            <strong className="text-foreground">Express Shipping:</strong> 2–4
            business days
          </li>
        </ul>
        <p>
          Delivery times are estimates and may vary depending on your location
          and customs processing for international orders.
        </p>
      </Section>

      <Section title="Shipping Costs">
        <p>
          Shipping costs are calculated at checkout based on the weight of your
          order and destination. We offer free standard shipping on orders over
          a certain threshold — check the cart for details.
        </p>
      </Section>

      <Section title="International Shipping">
        <p>
          We ship to most countries worldwide. Please note that international
          orders may be subject to customs duties, taxes, or import fees imposed
          by the destination country. These charges are the responsibility of
          the recipient.
        </p>
      </Section>

      <Section title="Order Tracking">
        <p>
          Once your order has shipped, you will receive a confirmation email
          with a tracking number. You can use this number to track the status of
          your delivery.
        </p>
      </Section>

      <Section title="Lost or Damaged Packages">
        <p>
          If your package is lost or arrives damaged, please contact us at{" "}
          <a
            href="mailto:support@usekeon.com"
            className="underline underline-offset-2 transition-colors hover:text-foreground"
          >
            support@usekeon.com
          </a>{" "}
          within 14 days of the expected delivery date and we will work to
          resolve the issue.
        </p>
      </Section>
    </>
  );
}

function RefundPolicy() {
  return (
    <>
      <Section title="Return Eligibility">
        <p>
          We accept returns within 30 days of delivery. To be eligible for a
          return, your item must be unused, in its original packaging, and in
          the same condition that you received it.
        </p>
      </Section>

      <Section title="How to Initiate a Return">
        <p>
          To start a return, please contact us at{" "}
          <a
            href="mailto:support@usekeon.com"
            className="underline underline-offset-2 transition-colors hover:text-foreground"
          >
            support@usekeon.com
          </a>{" "}
          with your order number and reason for return. We will provide you with
          return instructions and a shipping label if applicable.
        </p>
      </Section>

      <Section title="Refund Process">
        <p>
          Once we receive and inspect your returned item, we will notify you of
          the approval or rejection of your refund. If approved, your refund
          will be processed to the original payment method within 5–10 business
          days.
        </p>
      </Section>

      <Section title="Exchanges">
        <p>
          We only replace items if they are defective or damaged. If you need to
          exchange an item, contact us at{" "}
          <a
            href="mailto:support@usekeon.com"
            className="underline underline-offset-2 transition-colors hover:text-foreground"
          >
            support@usekeon.com
          </a>
          .
        </p>
      </Section>

      <Section title="Non-Returnable Items">
        <p>
          Certain items are non-returnable, including custom or personalized
          products, items on final sale, and gift cards.
        </p>
      </Section>

      <Section title="Return Shipping Costs">
        <p>
          Return shipping costs are the responsibility of the customer unless
          the return is due to a defective or incorrect item. In such cases, we
          will cover the return shipping cost.
        </p>
      </Section>
    </>
  );
}

function PrivacyPolicy() {
  return (
    <>
      <Section title="Information We Collect">
        <p>
          When you visit our site or make a purchase, we collect certain
          information including your name, email address, shipping address,
          payment information, and browsing behavior on our website.
        </p>
      </Section>

      <Section title="How We Use Your Information">
        <p>We use the information we collect to:</p>
        <ul className="ml-4 list-disc space-y-1">
          <li>Process and fulfill your orders</li>
          <li>Communicate with you about your order or account</li>
          <li>Send promotional emails (with your consent)</li>
          <li>Improve our website and product offerings</li>
          <li>Comply with legal obligations</li>
        </ul>
      </Section>

      <Section title="Data Sharing">
        <p>
          We do not sell your personal information to third parties. We may
          share your data with trusted service providers who assist us in
          operating our website, processing payments, and fulfilling orders.
          These providers are bound by confidentiality agreements.
        </p>
      </Section>

      <Section title="Cookies">
        <p>
          We use cookies and similar tracking technologies to enhance your
          browsing experience, analyze site traffic, and personalize content.
          You can control cookie preferences through your browser settings.
        </p>
      </Section>

      <Section title="Data Security">
        <p>
          We implement industry-standard security measures to protect your
          personal information. However, no method of transmission over the
          Internet is 100% secure, and we cannot guarantee absolute security.
        </p>
      </Section>

      <Section title="Your Rights">
        <p>
          You have the right to access, correct, or delete your personal
          information at any time. To exercise these rights, please contact us
          at{" "}
          <a
            href="mailto:support@usekeon.com"
            className="underline underline-offset-2 transition-colors hover:text-foreground"
          >
            support@usekeon.com
          </a>
          .
        </p>
      </Section>
    </>
  );
}

function TermsOfService() {
  return (
    <>
      <Section title="Acceptance of Terms">
        <p>
          By accessing and using this website, you accept and agree to be bound
          by these Terms of Service. If you do not agree to these terms, please
          do not use our website.
        </p>
      </Section>

      <Section title="Use of the Website">
        <p>
          You agree to use this website only for lawful purposes and in a manner
          that does not infringe the rights of, restrict, or inhibit anyone
          else&apos;s use and enjoyment of the website.
        </p>
      </Section>

      <Section title="Product Information">
        <p>
          We strive to provide accurate product descriptions, images, and
          pricing. However, we do not warrant that product descriptions or other
          content on this site are error-free. If a product offered by us is not
          as described, your sole remedy is to return it in unused condition.
        </p>
      </Section>

      <Section title="Pricing & Availability">
        <p>
          All prices are subject to change without notice. We reserve the right
          to modify or discontinue any product at any time. We shall not be
          liable to you or any third party for any modification, price change,
          or discontinuation of a product.
        </p>
      </Section>

      <Section title="Intellectual Property">
        <p>
          All content on this website, including text, graphics, logos, images,
          and software, is the property of Keon and is protected by applicable
          intellectual property laws. You may not reproduce, distribute, or
          create derivative works from any content without our prior written
          consent.
        </p>
      </Section>

      <Section title="Limitation of Liability">
        <p>
          To the fullest extent permitted by law, Keon shall not be liable for
          any indirect, incidental, special, consequential, or punitive damages
          arising out of your use of the website or purchase of any products.
        </p>
      </Section>

      <Section title="Changes to These Terms">
        <p>
          We reserve the right to update these Terms of Service at any time.
          Changes will be effective immediately upon posting to the website.
          Your continued use of the website after any changes indicates your
          acceptance of the updated terms.
        </p>
      </Section>

      <Section title="Contact Us">
        <p>
          If you have questions about these Terms of Service, please contact us
          at{" "}
          <a
            href="mailto:support@usekeon.com"
            className="underline underline-offset-2 transition-colors hover:text-foreground"
          >
            support@usekeon.com
          </a>
          .
        </p>
      </Section>
    </>
  );
}
