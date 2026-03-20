import Image from "next/image";
import { getMediaImageById, getMetaobjectById } from "src/lib/shopify";
import { Dimensions, Product } from "~/lib/shopify/types";
import { KeyboardSpecs } from "~/types/keyboard";

const weightUnitMap: Record<string, string> = {
  "GRAMS": "g",
  "KILOGRAMS": "kg",
  "POUNDS": "lb",
  "OUNCES": "oz",
};

function groupSpecs(
  product: Product,
  specs: KeyboardSpecs,
  dimensions: Dimensions | undefined,
) {
  const variants = product.variants;

  return {
    Specification: {
      "Number of keys": specs.number_of_keys,
      "Layout percentage": specs.layout_percentage,
      "Number of multifunction keys": specs.number_of_multifunction_keys,
      "Switch model": specs.switch_model,
      "Switch profile": specs.switch_profile,
      "Mounting style": specs.mounting_style,
      "Hot swappable": specs.hot_swappable,
      "N key rollover": specs.n_key_rollover,
      "Backlight type": specs.backlight_type,
      "Backlight modes": specs.backlight_modes,
      "LED orientation": specs.led_orientation,
    },
    "Size & weight": {
      Width: dimensions?.width,
      Height: dimensions?.height,
      Depth: dimensions?.depth,
      Weight: variants[0]?.weight + " " + weightUnitMap[variants[0]?.weightUnit ?? ""],
    },
    Material: {
      "Top case material": specs.top_case_material,
      "Bottom case material": specs.bottom_case_material,
      "Plate material": specs.plate_material,
      "Keycap material": specs.keycap_material,
    },
    Connectivity: {
      "Connection modes": specs.connection_modes,
      "Polling rate": specs.polling_rate,
      "Polling rate wired": specs.polling_rate_wired,
      "Max connected devices": specs.max_connected_devices,
      "Wireless range": specs.wireless_range,
    },
    Power: {
      "Working time lights on": specs.working_time_lights_on,
      "Working time lights off": specs.working_time_lights_off,
      "Working time": product.custom.battery_working_time,
    },
    Other: {
      "Type angle": specs.type_angle,
      "Operating temperature": specs.operating_temperature,
    },
  };
}

async function resolveKeyboardSpecs(
  metaobjectId: string,
): Promise<KeyboardSpecs> {
  const metaobject = await getMetaobjectById(metaobjectId);
  if (!metaobject) return {};

  const obj: Record<string, unknown> = {};
  for (const field of metaobject.fields) {
    if (field.key === "display_image") {
      if (field.reference?.image) {
        obj.display_image = field.reference.image;
      } else if (field.value.startsWith("gid://shopify/MediaImage/")) {
        const img = await getMediaImageById(field.value);
        if (img) obj.display_image = img;
      }
      continue;
    }
    obj[field.key] = field.value;
  }

  return obj as KeyboardSpecs;
}

async function resolveDimensions(metaobjectId: string): Promise<Dimensions> {
  const metaobject = await getMetaobjectById(metaobjectId);
  if (!metaobject) return {};

  const obj: Record<string, unknown> = {};
  for (const field of metaobject.fields) {
    obj[field.key] = field.value;
  }

  return obj as Dimensions;
}

export default async function Specs({ product }: { product: Product }) {
  const keyboardSpecsIdOrObj = product.custom?.keyboard_specs;
  const dimensionsIdOrObj = product.custom?.dimensions;

  if (!keyboardSpecsIdOrObj) return null;

  const specs =
    typeof keyboardSpecsIdOrObj === "string"
      ? await resolveKeyboardSpecs(keyboardSpecsIdOrObj)
      : (keyboardSpecsIdOrObj as KeyboardSpecs);

  const dimensions =
    typeof dimensionsIdOrObj === "string"
      ? await resolveDimensions(dimensionsIdOrObj)
      : (dimensionsIdOrObj as Dimensions);

  const groupedSpecs = groupSpecs(product, specs, dimensions);

  return (
    <section className="flex max-w-(--breakpoint-xl) mx-auto px-6 py-16 md:py-24 center">
      <div className="flex flex-col w-full max-w-4xl rounded-4xl bg-muted px-10 py-12">
        {specs.display_image && (
          <div className="w-full overflow-hidden rounded-4xl max-w-1/3 self-center">
            <Image
              src={specs.display_image?.url || ""}
              alt={specs.display_image?.altText || ""}
              width={specs.display_image?.width || 0}
              height={specs.display_image?.height}
              className="w-full h-auto object-cover"
            />
          </div>
        )}

        <div className="flex flex-col items-center pt-2">
          <p className="text-sm text-muted-foreground">{product.title}</p>
          <h2 className="mt-2 text-center text-4xl font-medium font-loud">
            Tech specs
          </h2>
        </div>

        <div className="mt-10 divide-y divide-border">
          {Object.entries(groupedSpecs).map(([title, group]) => {
            const groupObj = group as Record<string, unknown>;

            const entries = Object.entries(groupObj).filter(
              ([, v]) =>
                v !== undefined &&
                v !== null &&
                !(typeof v === "string" && v.trim().length === 0),
            );

            if (entries.length === 0) return null;

            const labelMap: Record<string, string> = {
              "Number of keys": "Number of Keys",
              "Type angle": "Type Angle",
              "Backlight type": "Backlight",
              "Hot swappable": "Hot-swappable Support",
              "Connection modes": "Connection Mode",
              "Polling rate wired": "Polling Rate (wired/ 2.4Ghz):",
              "Polling rate": "Polling Rate (wireless/ 2.4Ghz):",
              "Wireless range": "Wireless Range",
              "Working time lights off": "Working time (All lights off)",
              "Working time lights on": "Working time (All lights on)",
              Weight: "Weight",
            };

            let formattedEntries: Array<[string, unknown]> = entries;

            if (title === "Specification") {
              const numberOfKeys = groupObj["Number of keys"];
              const layoutPercentage = groupObj["Layout percentage"];
              const typeAngle = groupObj["Type angle"];
              const backlightType = groupObj["Backlight type"];
              const hotSwappable = groupObj["Hot swappable"];

              const switchModel = groupObj["Switch model"];
              const switchProfile = groupObj["Switch profile"];

              const handledKeys = new Set([
                "Number of keys",
                "Layout percentage",
                "Type angle",
                "Backlight type",
                "Hot swappable",
                "Switch model",
                "Switch profile",
              ]);

              const hotSwappableDisplay =
                typeof hotSwappable === "boolean"
                  ? hotSwappable
                    ? "Yes"
                    : "No"
                  : typeof hotSwappable === "string"
                    ? hotSwappable.trim().toLowerCase() === "true"
                      ? "Yes"
                      : hotSwappable.trim().toLowerCase() === "false"
                        ? "No"
                        : hotSwappable
                    : hotSwappable !== undefined
                      ? String(hotSwappable)
                      : undefined;

              const switchDisplay =
                switchModel && switchProfile
                  ? `${switchModel} ${switchProfile}`
                  : switchModel
                    ? String(switchModel)
                    : undefined;

              const numberOfKeysDisplay =
                numberOfKeys !== undefined
                  ? layoutPercentage
                    ? `${numberOfKeys} (${layoutPercentage})`
                    : String(numberOfKeys)
                  : undefined;

              formattedEntries = [
                ["Number of Keys", numberOfKeysDisplay] as [string, unknown],
                ["Type Angle", typeAngle] as [string, unknown],
                ["Backlight", backlightType] as [string, unknown],
                ["Hot-swappable Support", hotSwappableDisplay] as [
                  string,
                  unknown,
                ],
                ["Switch", switchDisplay] as [string, unknown],
                ...entries
                  .filter(([k]) => !handledKeys.has(k))
                  .map(([k, v]) => [labelMap[k] ?? k, v] as [string, unknown]),
              ].filter(([, v]) => v !== undefined && v !== null);
            } else if (title === "Size & weight") {
              const width = groupObj["Width"];
              const height = groupObj["Height"];
              const depth = groupObj["Depth"];
              const weight = groupObj["Weight"];

              const hasDims =
                width !== undefined &&
                height !== undefined &&
                depth !== undefined;
              const dimsAreNumericLike =
                typeof width === "string" &&
                typeof height === "string" &&
                typeof depth === "string" &&
                !/[a-zA-Z]/.test(width) &&
                !/[a-zA-Z]/.test(height) &&
                !/[a-zA-Z]/.test(depth);

              const dimensionsDisplay = hasDims
                ? `${width} x ${height} x ${depth}${dimsAreNumericLike ? "mm" : ""}`
                : undefined;

              const handledKeys = new Set(["Width", "Height", "Depth"]);

              formattedEntries = [
                ["Dimensions", dimensionsDisplay] as [string, unknown],
                ...(weight !== undefined
                  ? ([["Weight", weight]] as Array<[string, unknown]>)
                  : []),
                ...entries
                  .filter(([k]) => !handledKeys.has(k) && k !== "Weight")
                  .map(([k, v]) => [labelMap[k] ?? k, v] as [string, unknown]),
              ].filter(([, v]) => v !== undefined && v !== null) as Array<
                [string, unknown]
              >;
            } else {
              formattedEntries = entries.map(([k, v]) => [labelMap[k] ?? k, v]);
            }

            const splitIndex = Math.ceil(formattedEntries.length / 2);
            const left = formattedEntries.slice(0, splitIndex);
            const right = formattedEntries.slice(splitIndex);

            return (
              <div
                key={title}
                className="grid grid-cols-[160px_1fr_1fr] gap-x-12 py-6"
              >
                <h3 className="text-sm font-semibold text-left">{title}</h3>
                <div className="flex flex-col gap-3">
                  {left.map(([k, v]) => (
                    <div key={k} className="leading-6">
                      <span className="font-medium">{k}:</span>{" "}
                      <span>{String(v)}</span>
                    </div>
                  ))}
                </div>
                <div className="flex flex-col gap-3">
                  {right.map(([k, v]) => (
                    <div key={k} className="leading-6">
                      <span className="font-medium">{k}:</span>{" "}
                      <span>{String(v)}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
