import { removeEdgesAndNodes } from ".";
import { HIDDEN_PRODUCT_TAG } from "../constants";
import {
  Cart,
  Collection,
  Connection,
  CrossSellProduct,
  Image,
  ShopifyCart,
  ShopifyCollection,
  ShopifyMetafield,
  ShopifyMetafieldReference,
  ShopifyMetaobjectByIdOperation,
  ShopifyProduct
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

export const reshapeMetaobject = (metaobject: ReshapableMetaobject): Record<string, string> => {
  const fields = metaobject?.fields;
  if (!fields) return {};
  const obj: Record<string, string> = {};
  for (const field of fields) {
    obj[field.key] = field.value;
  }
  return obj;
}

export const reshapeMetaobjects = (metaobjects: ReshapableMetaobject[]) => {
  return metaobjects.map((metaobject) => reshapeMetaobject(metaobject));
}

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
            currencyCode: "USD",
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

export const reshapeProduct = (
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
    faqItems: reshapeMetaobjects(flattenMetafieldReferences(metafields, "faq")),
    crossSellProducts: reshapeCrossSellProducts(metafields),
    featureBullets: parseJsonStringArray(findMetafield(metafields, "feature_bullets")),
    showcaseImages: flattenMetafieldImages(metafields, "showcase_images"),
    spotlightImages: flattenMetafieldImages(metafields, "spotlight_images"),
    productFaqs: reshapeMetaobjects(flattenMetafieldReferences(metafields, "product_faqs")),
    includedItems: reshapeMetaobjects(flattenMetafieldReferences(metafields, "included_items")),
    keyboardSpecsId: findMetafield(metafields, "keyboard_specs"),
    dimensionsId: findMetafield(metafields, "dimensions"),
    soundTestId: findMetafield(metafields, "sound_test"),
    batteryWorkingTime: findMetafield(metafields, "battery_working_time"),
  };
};

export const reshapeProducts = (products: ShopifyProduct[]) => {
  const reshapedProducts = [];

  for (const product of products) {
    if (product) {
      const reshapedProduct = reshapeProduct(product);

      if (reshapedProduct) {
        reshapedProducts.push(reshapedProduct);
      }
    }
  }

  return reshapedProducts;
};
