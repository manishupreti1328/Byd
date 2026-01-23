// lib/graphql.ts
export const WP_API_URL = process.env.WORDPRESS_API_URL as string;

export async function fetchGraphQL<T>(query: string, variables?: any): Promise<T> {
  console.log('GraphQL Query:', query.substring(0, 100) + '...'); // Debug
  const response = await fetch(WP_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    cache: 'no-store',
    body: JSON.stringify({ query, variables }),
  });

  const json = await response.json();
  
  // Debug the response
  console.log('GraphQL Response - nodes count:', json.data?.models?.nodes?.length || 0);
  console.log('Full first node:', JSON.stringify(json.data?.models?.nodes?.[0], null, 2));
  
  if (json.errors) {
    console.error("GraphQL Errors:", JSON.stringify(json.errors, null, 2));
    throw new Error("GraphQL fetch error");
  }
  return json.data;
}

// -------------------
// UPDATED QUERIES - VERIFIED TO WORK
// -------------------

// Query to get ALL models with high limit
export const GET_ALL_MODELS = `
  query GetAllModels {
    models(first: 1000, where: {orderby: {field: DATE, order: DESC}}) {
      nodes {
        id
        slug
        title
        excerpt
        uri
        date
        featuredImage {
          node {
            sourceUrl
            altText
            mediaDetails {
              width
              height
            }
          }
        }
        author {
          node {
            name
            slug
          }
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

// Original query (keeping for compatibility)
export const GET_MODELS = GET_ALL_MODELS;

// Single model query
export const GET_MODEL_BY_SLUG = `
  query GetModel($slug: ID!) {
    model(id: $slug, idType: SLUG) {
      id
      slug
      title
      content
      date
      modified
      featuredImage {
        node {
          sourceUrl
          altText
        }
      }
      author {
        node {
          id
          name
          slug
          uri
        }
      }
      seo {
        meta_title
        meta_description
        ogimage {
          node { sourceUrl }
        }
      }
    }
  }
`;