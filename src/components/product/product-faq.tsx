"use client";

import {
  CreditCardIcon,
  CubeIcon,
  InformationCircleIcon,
  TruckIcon,
} from "@heroicons/react/24/outline";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";

const FAQ_ICON_MAP: Record<
  string,
  React.ComponentType<React.SVGProps<SVGSVGElement>>
> = {
  details: InformationCircleIcon,
  shipping: TruckIcon,
  payment: CreditCardIcon,
  info: InformationCircleIcon,
  box: CubeIcon,
};

function getFaqIcon(iconKey: string) {
  return FAQ_ICON_MAP[iconKey.toLowerCase()] ?? InformationCircleIcon;
}

const HARDCODED_FAQ: {
  id: string;
  title: string;
  icon: string;
  content: React.ReactNode;
}[] = [
  {
    id: "shipping-returns",
    title: "Shipping & Returns",
    icon: "shipping",
    content: (
      <div className="space-y-3 text-sm text-muted-foreground">
        <p>
          <strong className="text-foreground">
            Free Express Shipping on orders over €50.
          </strong>
        </p>
        <p>Once shipped your order should arrive within 2 - 3 business days.</p>
        <p>*No additional import duties or tariffs will be imposed.</p>
        <p>
          <strong className="text-foreground">Returns</strong>
        </p>
        <p>
          We offer a 30-day return policy on all orders, even if the product has
          been used. To initiate a return, please contact our customer service
          team at{" "}
          <a href="mailto:support@usekeon.com" className="underline">
            support@usekeon.com
          </a>
          .
        </p>
      </div>
    ),
  },
  {
    id: "payment-methods",
    title: "Payment methods",
    icon: "payment",
    content: (
      <div className="space-y-2 text-sm text-muted-foreground">
        <p>We accept the following payment methods:</p>
        <ul className="list-disc pl-4 space-y-1">
          <li>Credit & Debit Cards (Visa, Mastercard, Amex)</li>
          <li>PayPal</li>
          <li>Apple Pay</li>
          <li>Google Pay</li>
          <li>Shop Pay</li>
          <li>Klarna (Buy now, pay later)</li>
        </ul>
      </div>
    ),
  },
];

export function ProductFaq({ faqItems }: { faqItems: Record<string, string>[] }) {
  return (
    <Accordion type="single" collapsible className="w-full">
      {faqItems.map((item, index) => {
        const Icon = getFaqIcon(item.icon ?? "info");
        return (
          <AccordionItem key={`custom-${index}`} value={`custom-${index}`}>
            <AccordionTrigger className="py-4 hover:no-underline">
              <div className="flex items-center gap-3">
                <Icon className="size-5 shrink-0" />
                <span className="font-medium">{item.title}</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div
                className="text-sm text-muted-foreground pl-8"
                dangerouslySetInnerHTML={{ __html: item.content ?? "" }}
              />
            </AccordionContent>
          </AccordionItem>
        );
      })}

      {HARDCODED_FAQ.map((item) => {
        const Icon = getFaqIcon(item.icon);
        return (
          <AccordionItem key={item.id} value={item.id}>
            <AccordionTrigger className="py-4 hover:no-underline">
              <div className="flex items-center gap-3">
                <Icon className="size-5 shrink-0" />
                <span className="font-medium">{item.title}</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="pl-8">{item.content}</div>
            </AccordionContent>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
}
