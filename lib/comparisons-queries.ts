
export const GET_COMPARISONS = `
  query GetComparisons {
    comparisons {
      nodes {
        id
        slug
        title
        uri
        featuredImage {
          node {
            sourceUrl
            altText
          }
        }
        author {
          node {
            name
            slug
          }
        }
        date
      }
    }
  }
`;

export const GET_COMPARISON_BY_SLUG = `
  query GetComparison($slug: ID!) {
    comparison(id: $slug, idType: SLUG) {
      id
      slug
      title
      content
      author {
        node {
          id
          name
          slug
          uri
        }
      }
      featuredImage {
        node {
          sourceUrl
          altText
        }
      }
      seo {
        meta_title
        meta_description
        ogimage {
          node {
            sourceUrl
          }
        }
      }
      date
      modified
      uri
      faq {
       faq_title_1
        faq_title_2
        faq_title_3
        faq_title_4
        faq_title_5
        faq_value_1
        faq_value_2
        faq_value_3
        faq_value_4
        faq_value_5
      }
      fact {
        fact_title_1
        fact_title_2
        fact_title_3
        fact_title_4
        fact_value_1
        fact_value_2
        fact_value_3
        fact_value_4
      }
    }
  }
`;

export const GET_COMPARISONS_WITH_PAGINATION = `
  query GetComparisons($first: Int, $after: String) {
    comparisons(first: $first, after: $after) {
      nodes {
        id
        slug
        title
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
        hasPreviousPage
        startCursor
      }
    }
  }
`;

export const GET_COMPARISONS_COUNT = `
  query GetComparisonsCount {
    comparisons {
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

// For client-side pagination (fallback option)
export const GET_ALL_COMPARISONS = `
  query GetAllComparisons {
    comparisons(first: 1000) {
      nodes {
        id
        slug
        title
        date
        modified
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
    }
  }
`;
