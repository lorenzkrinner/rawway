import { KeyboardSoundTest, KeyboardSpecs } from "~/types/keyboard";
import { getMediaImageById, getMetaobjectById, removeEdgesAndNodes } from ".";
import { HIDDEN_PRODUCT_TAG } from "../constants";
import {
  Cart,
  Collection,
  Connection,
  CrossSellProduct,
  Dimensions,
  Image,
  ShopifyCart,
  ShopifyCollection,
  ShopifyMetafield,
  ShopifyMetafieldReference,
  ShopifyMetaobjectByIdOperation,
  ShopifyProduct,
} from "./types";

export const reshapeCart = (cart: ShopifyCart): Cart => {
  if (!cart.cost?.totalTaxAmount) {
    cart.cost.totalTaxAmount = {
      amount: "0.0",
      currencyCode: cart.cost.totalAmount.currencyCode,
    };
  }

  return {
    ...cart,
    lines: removeEdgesAndNodes(cart.lines),
  };
};

export const reshapeCollection = (
  collection: ShopifyCollection,
): Collection | undefined => {
  if (!collection) {
    return undefined;
  }

  return {
    ...collection,
    path: `/search/${collection.handle}`,
  };
};

export const reshapeCollections = (collections: ShopifyCollection[]) => {
  const reshapedCollections = [];

  for (const collection of collections) {
    if (collection) {
      const reshapedCollection = reshapeCollection(collection);

      if (reshapedCollection) {
        reshapedCollections.push(reshapedCollection);
      }
    }
  }

  return reshapedCollections;
};

export const reshapeImages = (
  images: Connection<Image>,
  productTitle: string,
) => {
  const flattened = removeEdgesAndNodes(images);

  return flattened.map((image) => {
    const filename = image.url.match(/.*\/(.*)\..*/)?.[1];
    return {
      ...image,
      altText: image.altText || `${productTitle} - ${filename}`,
    };
  });
};

const findMetafield = (
  metafields: ShopifyMetafield[] | undefined,
  key: string,
): string | undefined => {
  const mf = metafields?.find((m) => m?.key === key);
  return mf?.value ?? undefined;
};

const flattenMetafieldReferences = (
  metafields: ShopifyMetafield[] | undefined,
  key: string,
): ShopifyMetafieldReference[] => {
  const mf = metafields?.find((m) => m?.key === key);
  if (!mf?.references) return [];
  return removeEdgesAndNodes(mf.references);
};

const flattenMetafieldImages = (
  metafields: ShopifyMetafield[] | undefined,
  key: string,
): Image[] => {
  return flattenMetafieldReferences(metafields, key)
    .filter((ref) => ref.image)
    .map((ref) => ref.image!);
};

type ReshapableMetaobject =
  | ShopifyMetaobjectByIdOperation["data"]["node"]
  | ShopifyMetafieldReference;

type ReshapableField = {
  key: string;
  value: string;
  reference?: { image?: Image } | null;
};

export const reshapeMetaobject = async (
  metaobject: ReshapableMetaobject,
): Promise<Record<string, unknown>> => {
  const fields = metaobject?.fields as ReshapableField[] | undefined;
  if (!fields) return {};
  const obj: Record<string, unknown> = {};
  for (const field of fields) {
    if (field.reference?.image) {
      obj[field.key] = field.reference.image;
    } else if (field.value.startsWith("gid://shopify/MediaImage/")) {
      const img = await getMediaImageById(field.value);
      obj[field.key] = img ?? field.value;
    } else {
      obj[field.key] = field.value;
    }
  }
  return obj;
};

export const reshapeMetaobjects = (metaobjects: ReshapableMetaobject[]) => {
  return metaobjects.map((metaobject) => reshapeMetaobject(metaobject));
};

export const resolveMetaobjectById = async (
  id: string,
): Promise<Record<string, unknown>> => {
  const metaobject = await getMetaobjectById(id);
  if (!metaobject) return {};
  return reshapeMetaobject(metaobject);
};

const resolveOptionalMetaobject = async (
  id: string | undefined,
): Promise<Record<string, unknown> | undefined> => {
  if (!id) return undefined;
  const result = await resolveMetaobjectById(id);
  return Object.keys(result).length > 0 ? result : undefined;
};

export const reshapeCrossSellProducts = (
  metafields: ShopifyProduct["metafields"],
): CrossSellProduct[] => {
  const mf = metafields?.find((m) => m?.key === "cross_sell_products");
  if (!mf?.references) return [];

  return removeEdgesAndNodes(mf.references)
    .filter((ref) => ref.id && ref.title)
    .map((ref) => {
      const images = ref.images ? removeEdgesAndNodes(ref.images) : [];
      const firstVariant = ref.variants
        ? removeEdgesAndNodes(ref.variants)[0]
        : undefined;

      let featureBullets: string[] = [];
      const bulletsMf = ref.metafields?.find(
        (m) => m?.key === "feature_bullets",
      );
      if (bulletsMf?.value) {
        const parsed: unknown = JSON.parse(bulletsMf.value);
        if (Array.isArray(parsed)) {
          featureBullets = parsed as string[];
        }
      }

      return {
        id: ref.id!,
        handle: ref.handle ?? "",
        title: ref.title!,
        description: ref.description ?? "",
        availableForSale: ref.availableForSale ?? false,
        featuredImage: ref.featuredImage ?? {
          url: "",
          altText: "",
          width: 0,
          height: 0,
        },
        images,
        priceRange: {
          maxVariantPrice: ref.priceRange?.maxVariantPrice ?? {
            amount: "0",
            currencyCode: "EUR",
          },
        },
        firstVariantId: firstVariant?.id ?? "",
        featureBullets,
      };
    });
};

const parseJsonStringArray = (value: string | undefined): string[] => {
  if (!value) return [];
  const parsed: unknown = JSON.parse(value);
  return Array.isArray(parsed) ? (parsed as string[]) : [];
};

export const reshapeProduct = async (
  product: ShopifyProduct,
  filterHiddenProducts: boolean = true,
) => {
  if (
    !product ||
    (filterHiddenProducts && product.tags.includes(HIDDEN_PRODUCT_TAG))
  ) {
    return undefined;
  }

  const { images, variants, metafields, ...rest } = product;

  return {
    ...rest,
    images: reshapeImages(images, product.title),
    variants: removeEdgesAndNodes(variants),
    faqItems: await Promise.all(
      reshapeMetaobjects(flattenMetafieldReferences(metafields, "faq")),
    ),
    crossSellProducts: reshapeCrossSellProducts(metafields),
    featureBullets: parseJsonStringArray(
      findMetafield(metafields, "feature_bullets"),
    ),
    showcaseImages: flattenMetafieldImages(metafields, "showcase_images"),
    spotlightImages: flattenMetafieldImages(metafields, "spotlight_images"),
    productFaqs: await Promise.all(
      reshapeMetaobjects(
        flattenMetafieldReferences(metafields, "product_faqs"),
      ),
    ),
    includedItems: await Promise.all(
      reshapeMetaobjects(
        flattenMetafieldReferences(metafields, "included_items"),
      ),
    ),
    keyboardSpecs: (await resolveOptionalMetaobject(
      findMetafield(metafields, "keyboard_specs"),
    )) as KeyboardSpecs | undefined,
    dimensions: (await resolveOptionalMetaobject(
      findMetafield(metafields, "dimensions"),
    )) as Dimensions | undefined,
    soundTest: (await resolveOptionalMetaobject(
      findMetafield(metafields, "sound_test"),
    )) as KeyboardSoundTest | undefined,
    batteryWorkingTime: findMetafield(metafields, "battery_working_time"),
  };
};

export const reshapeProducts = async (products: ShopifyProduct[]) => {
  const reshapedProducts = [];

  for (const product of products) {
    if (product) {
      const reshapedProduct = await reshapeProduct(product);

      if (reshapedProduct) {
        reshapedProducts.push(reshapedProduct);
      }
    }
  }

  return reshapedProducts;
};
