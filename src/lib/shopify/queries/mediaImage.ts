import imageFragment from "../fragments/image";

export const getMediaImageByIdQuery = /* GraphQL */ `
  query getMediaImageById($id: ID!) {
    node(id: $id) {
      ... on MediaImage {
        id
        image {
          ...image
        }
      }
    }
  }
  ${imageFragment}
`;
