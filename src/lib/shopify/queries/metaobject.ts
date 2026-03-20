import imageFragment from "../fragments/image";

export const getMetaobjectByIdQuery = /* GraphQL */ `
  query getMetaobjectById($id: ID!) {
    node(id: $id) {
      ... on Metaobject {
        id
        fields {
          key
          value
          reference {
            ... on MediaImage {
              image {
                ...image
              }
            }
          }
        }
      }
    }
  }
  ${imageFragment}
`;
