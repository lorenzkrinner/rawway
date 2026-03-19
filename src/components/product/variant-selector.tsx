"use client";

import clsx from "clsx";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { ProductOption, ProductVariant } from "src/lib/shopify/types";
import { COLOR_SWATCH_MAP } from "~/constants/colors";

type Combination = {
  id: string;
  availableForSale: boolean;
  [key: string]: string | boolean;
};

function isColorOption(name: string) {
  return name.toLowerCase() === "color" || name.toLowerCase() === "colour";
}

function getColorHex(value: string): string | undefined {
  return COLOR_SWATCH_MAP[value.toLowerCase()];
}

export function VariantSelector({
  options,
  variants,
}: {
  options: ProductOption[];
  variants: ProductVariant[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const hasNoOptionsOrJustOneOption =
    !options.length ||
    (options.length === 1 && options[0]?.values.length === 1);

  const combinations: Combination[] = variants.map((variant) => ({
    id: variant.id,
    availableForSale: variant.availableForSale,
    ...variant.selectedOptions.reduce(
      (accumulator, option) => ({
        ...accumulator,
        [option.name.toLowerCase()]: option.value,
      }),
      {},
    ),
  }));

  useEffect(() => {
    if (hasNoOptionsOrJustOneOption) return;

    const params = new URLSearchParams(searchParams.toString());
    let changed = false;

    for (const option of options) {
      const key = option.name.toLowerCase();
      if (!params.has(key) && option.values[0]) {
        const firstAvailable = option.values.find((value) => {
          const testParams: Record<string, string> = {};
          params.forEach((v, k) => (testParams[k] = v));
          testParams[key] = value;

          return combinations.some((combo) =>
            Object.entries(testParams).every(
              ([k, v]) =>
                !options.find(
                  (o) => o.name.toLowerCase() === k && o.values.includes(v),
                ) ||
                (combo[k] === v && combo.availableForSale),
            ),
          );
        });

        params.set(key, firstAvailable ?? option.values[0]);
        changed = true;
      }
    }

    if (changed) {
      router.replace(`?${params.toString()}`, { scroll: false });
    }
  }, []);

  if (hasNoOptionsOrJustOneOption) {
    return null;
  }

  const updateOption = (name: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(name, value);
    router.replace(`?${params.toString()}`, { scroll: false });
  };

  return options.map((option) => {
    const optionNameLower = option.name.toLowerCase();
    const selectedValue = searchParams.get(optionNameLower);
    const isColor = isColorOption(option.name);

    return (
      <div key={option.id} className="mb-6">
        <div className="mb-3 flex items-center gap-2 text-sm">
          <span className="font-semibold uppercase tracking-wide">
            {option.name}
          </span>
          {selectedValue && (
            <span className="text-muted-foreground">{selectedValue}</span>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          {option.values.map((value) => {
            const optionParams: Record<string, string> = {};
            searchParams.forEach((v, k) => (optionParams[k] = v));
            optionParams[optionNameLower] = value;

            const filtered = Object.entries(optionParams).filter(([key, val]) =>
              options.find(
                (o) => o.name.toLowerCase() === key && o.values.includes(val),
              ),
            );
            const isAvailableForSale = combinations.find((combination) =>
              filtered.every(
                ([key, val]) =>
                  combination[key] === val && combination.availableForSale,
              ),
            );

            const isActive = selectedValue === value;
            const colorHex = isColor ? getColorHex(value) : undefined;

            if (isColor) {
              return (
                <button
                  key={value}
                  onClick={() => updateOption(optionNameLower, value)}
                  aria-disabled={!isAvailableForSale}
                  disabled={!isAvailableForSale}
                  title={`${option.name} ${value}${!isAvailableForSale ? " (Out of Stock)" : ""}`}
                  className={clsx(
                    "relative size-9 rounded-full transition-all duration-200",
                    {
                      "ring-2 ring-foreground ring-offset-2": isActive,
                      "ring-1 ring-border hover:ring-foreground":
                        !isActive && isAvailableForSale,
                      "opacity-40 cursor-not-allowed": !isAvailableForSale,
                    },
                  )}
                  style={{
                    backgroundColor: colorHex ?? "#ccc",
                  }}
                >
                  {!isAvailableForSale && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="h-px w-full -rotate-45 bg-foreground/60" />
                    </div>
                  )}
                </button>
              );
            }

            return (
              <button
                key={value}
                onClick={() => updateOption(optionNameLower, value)}
                aria-disabled={!isAvailableForSale}
                disabled={!isAvailableForSale}
                title={`${option.name} ${value}${!isAvailableForSale ? " (Out of Stock)" : ""}`}
                className={clsx(
                  "relative flex min-w-14 items-center justify-center border px-4 py-2.5 text-sm font-medium transition-all duration-200",
                  {
                    "border-2 border-foreground font-semibold": isActive,
                    "border-border hover:border-foreground":
                      !isActive && isAvailableForSale,
                    "cursor-not-allowed border-border text-muted-foreground opacity-50":
                      !isAvailableForSale,
                  },
                )}
              >
                {value}
                {!isAvailableForSale && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="h-px w-full -rotate-45 bg-muted-foreground/40" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    );
  });
}
