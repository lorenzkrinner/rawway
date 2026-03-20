import Image from "next/image";
import { IncludedItem } from "~/lib/shopify/types";

export default function IncludedItems({ includedItems }: { includedItems: IncludedItem[] }) {
  return (
    <section className="mx-auto flex max-w-7xl px-6 pt-16 md:pt-24 w-full">
      <div className="flex flex-col center w-full rounded-4xl bg-muted px-10 py-12 gap-8">
        <h2 className="text-start text-3xl font-medium font-loud max-w-xl">Included items</h2>
        <div className="flex w-full justify-between">
          {includedItems.map(item => {
            return (
              <div key={item.name} className="flex flex-col items-center">
                <div className="w-35">
                  <Image src={item.image.url} alt={item.image.altText} width={item.image.width} height={item.image.height} className="object-cover" />
                </div>
                <p className="text-sm font-medium">{item.amount}x {item.name}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  );
}