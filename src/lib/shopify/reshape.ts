import { removeEdgesAndNodes } from ".";
import { HIDDEN_PRODUCT_TAG } from "../constants";
import { Cart, Collection, Connection, CrossSellProduct, FaqItem, Image, ShopifyCart, ShopifyCollection, ShopifyProduct } from "./types";

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

export const reshapeImages = (images: Connection<Image>, productTitle: string) => {
  const flattened = removeEdgesAndNodes(images);

  return flattened.map((image) => {
    const filename = image.url.match(/.*\/(.*)\..*/)?.[1];
    return {
      ...image,
      altText: image.altText || `${productTitle} - ${filename}`,
    };
  });
};

export const reshapeCustomFields = (
  metafields: ShopifyProduct["metafields"],
): Record<string, unknown> => {
  const custom: Record<string, unknown> = {};

  for (const mf of metafields ?? []) {
    if (!mf?.key) continue;

    if (mf.key === "spotlight_images" && mf.references) {
      custom[mf.key] = removeEdgesAndNodes(mf.references)
        .filter((ref) => ref.image)
        .map((ref) => ref.image!);
      continue;
    }

    if (mf.references) {
      const firstReference = removeEdgesAndNodes(mf.references)[0];
      const fields = firstReference?.fields;
      if (fields?.length) {
        custom[mf.key] = fields.reduce<Record<string, string>>((acc, f) => {
          acc[f.key] = f.value;
          return acc;
        }, {});
        continue;
      }
    }

    if (mf.value) {
      custom[mf.key] = mf.value;
    }
  }

  return custom;
};

export const reshapeFaqItems = (
  metafields: ShopifyProduct["metafields"],
): FaqItem[] => {
  const mf = metafields?.find((m) => m?.key === "faq");
  if (!mf?.references) return [];

  return removeEdgesAndNodes(mf.references)
    .filter((ref) => ref.fields)
    .map((ref) => {
      const fields = ref.fields!;
      const getField = (key: string) =>
        fields.find((f) => f.key === key)?.value ?? "";
      return {
        title: getField("title"),
        icon: getField("icon"),
        content: getField("content"),
      };
    });
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
            currencyCode: "USD",
          },
        },
        firstVariantId: firstVariant?.id ?? "",
        featureBullets,
      };
    });
};

export const reshapeFeatureBullets = (
  metafields: ShopifyProduct["metafields"],
): string[] => {
  const mf = metafields?.find((m) => m?.key === "feature_bullets");
  if (!mf?.value) return [];
  const parsed: unknown = JSON.parse(mf.value);
  if (Array.isArray(parsed)) return parsed as string[];
  return [];
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
    custom: reshapeCustomFields(metafields),
    faqItems: reshapeFaqItems(metafields),
    crossSellProducts: reshapeCrossSellProducts(metafields),
    featureBullets: reshapeFeatureBullets(metafields),
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