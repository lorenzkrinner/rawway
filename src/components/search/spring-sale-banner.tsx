import { CheckCircleIcon } from "@heroicons/react/24/solid";
import Image from "next/image";

const benefits = [
  "30 day money-back guarantee",
  "Lifetime warranty & free shipping",
  "Free shipping above €55",
];

export default function SpringSaleBanner() {
  return (
    <section className="relative overflow-hidden rounded-xl bg-foreground text-background py-20 lg:py-28">
      <Image src="/images/promotions/spring.png" className="absolute inset-0 object-cover w-full h-full object-top" alt="Spring Sale" width={1000} height={1000} />
      <div className="relative z-10 px-6 py-8 sm:px-10 sm:py-10 lg:px-14 lg:py-12">
        <p className="text-sm font-semibold text-green-400 sm:text-base">
          15% OFF all orders
        </p>
        <h2 className="mt-2 font-loud text-3xl font-black uppercase tracking-wide sm:text-4xl lg:text-5xl">
          Spring Sale
        </h2>
        <ul className="mt-4 space-y-2">
          {benefits.map((benefit) => (
            <li key={benefit} className="flex items-center gap-2 text-sm sm:text-base">
              <CheckCircleIcon className="size-5 shrink-0 text-green-400" />
              {benefit}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
