import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "~/components/ui/accordion";
import { ProductFaqs } from "~/lib/shopify/types";

export default function Faq({ faqs }: { faqs: ProductFaqs[] }) {
  return (
    <section className="mx-auto flex max-w-7xl px-6 py-16 md:py-24 center w-full">
      <div className="flex flex-col w-full rounded-4xl gap-10 px-10 py-12">
        <h2 className="text-start text-4xl font-medium font-loud">Frequently Asked Questions</h2>
        <Accordion type="single" collapsible>
          {faqs.map((faq) => (
            <AccordionItem className="py-6" key={faq.title} value={faq.title}>
              <AccordionTrigger>{faq.title}</AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground!">{faq.description}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}