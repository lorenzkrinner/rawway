import imageFragment from "./image";
import seoFragment from "./seo";

const productFragment = /* GraphQL */ `
  fragment product on Product {
    id
    handle
    availableForSale
    title
    description
    descriptionHtml
    options {
      id
      name
      values
    }
    priceRange {
      maxVariantPrice {
        amount
        currencyCode
      }
      minVariantPrice {
        amount
        currencyCode
      }
    }
    variants(first: 250) {
      edges {
        node {
          id
          title
          availableForSale
          selectedOptions {
            name
            value
          }
          price {
            amount
            currencyCode
          }
          weight
          weightUnit
        }
      }
    }
    featuredImage {
      ...image
    }
    images(first: 20) {
      edges {
        node {
          ...image
        }
      }
    }
    seo {
      ...seo
    }
    tags
    updatedAt
    metafields(
      identifiers: [
        { namespace: "custom", key: "spotlight_images" }
        { namespace: "custom", key: "faq_item" }
        { namespace: "custom", key: "cross_sell_products" }
        { namespace: "custom", key: "feature_bullets" }
        { namespace: "custom", key: "keyboard_specs" }
        { namespace: "custom", key: "dimensions" }
        { namespace: "custom", key: "battery_working_time" }
        { namespace: "custom", key: "product_faqs" }
        { namespace: "custom", key: "sound_test" }
        { namespace: "custom", key: "showcase_images" }
        { namespace: "custom", key: "included_items" }
      ]
    ) {
      key
      value
      references(first: 10) {
        edges {
          node {
            ... on MediaImage {
              image {
                ...image
              }
            }
            ... on Metaobject {
              fields {
                key
                value
              }
            }
            ... on Product {
              id
              handle
              title
              description
              availableForSale
              featuredImage {
                ...image
              }
              images(first: 10) {
                edges {
                  node {
                    ...image
                  }
                }
              }
              priceRange {
                maxVariantPrice {
                  amount
                  currencyCode
                }
              }
              variants(first: 1) {
                edges {
                  node {
                    id
                    title
                    availableForSale
                    price {
                      amount
                      currencyCode
                    }
                  }
                }
              }
              metafields(
                identifiers: [{ namespace: "custom", key: "feature_bullets" }]
              ) {
                key
                value
              }
            }
          }
        }
      }
    }
  }
  ${imageFragment}
  ${seoFragment}
`;

export default productFragment;
