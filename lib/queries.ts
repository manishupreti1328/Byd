// lib/queries.ts
export const GET_MODELS = `
  query GetModels {
    models {
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

export const GET_MODEL_BY_SLUG = `
  query GetModel($slug: ID!) {
    model(id: $slug, idType: SLUG) {
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
        # faq6-10 disabled (Still missing in backend)
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
        # fact5-10 disabled (Still missing in backend)
      }
    }
  }
`;

export const GET_COUNTRIES = `
  query GetCountries {
    countries(first: 1000) {
      nodes {
        id
        slug
        title
        date
        uri
        countryData {
          country_name
          country_code
          
        }
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

export const GET_COUNTRY_BY_SLUG = `
  query GetCountryBySlug($slug: ID!) {
    country(id: $slug, idType: SLUG) {
      id
      slug
      title
      content
      date
      modified
      countryData {
        country_name
        country_code
      }
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
        # faq6-10 disabled (Still missing in backend)
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
        # fact5-10 disabled (Still missing in backend)
      }
    }
  }
`;

export const GET_MODELS_WITH_PAGINATION = `
  query GetModels($first: Int, $after: String) {
    models(first: $first, after: $after) {
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

export const GET_MODELS_COUNT = `
  query GetModelsCount {
    models {
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

export const GET_ALL_MODELS = `
  query GetAllModels {
    models(first: 1000) {
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
