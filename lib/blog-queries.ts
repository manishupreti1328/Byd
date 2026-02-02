
export const GET_BLOGS = `
  query GetBlogs {
    allBlogs {
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

export const GET_BLOG_BY_SLUG = `
  query GetBlog($slug: ID!) {
     blog: blogs(id: $slug, idType: SLUG) {
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
        fieldGroupName
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
        fieldGroupName
      }
      date
      modified
      uri
    }
  }
`;

// For client-side pagination (fallback option)
export const GET_ALL_BLOGS = `
  query GetAllBlogs {
    allBlogs(first: 1000) {
      nodes {
        id
        slug
        title
        date
        modified
        uri
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
        seo {
            meta_description
        }
      }
    }
  }
`;
