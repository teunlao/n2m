import { ARCHIVE_BLOCK, CALL_TO_ACTION, CONTENT, CONTENT_MEDIA, MEDIA_BLOCK } from './blocks'
import { LINK_FIELDS } from './link'
import { MEDIA } from './media'
import { META } from './meta'

export const POSTS = `
  query Posts {
    Posts(limit: 300) {
      docs {
        slug
      }
    }
  }
`

export const POST = `
  query Article($id: String!, $draft: Boolean = false) {
    Posts(where: { slug: { equals: $id }}, limit: 1, draft: $draft) {
      docs {
        id
        slug
        title
        categories {
          title
        }
        createdAt
        publishedOn
        populatedAuthors {
          id
          name
        }
        hero {
          type
          richText
          ${MEDIA}
        }
        layout {
          ${CONTENT}
          ${CALL_TO_ACTION}
          ${CONTENT}
          ${CONTENT_MEDIA}
          ${MEDIA_BLOCK}
          ${ARCHIVE_BLOCK}
        }
        enablePremiumContent
        relatedPosts {
          id
          slug
          title
          ${META}
        }
        ${META}
      }
    }
  }
`

export const POST_PREMIUM_CONTENT = `
  query Post($slug: String, $draft: Boolean) {
    Posts(where: { slug: { equals: $slug }}, limit: 1, draft: $draft) {
      docs {
        premiumContent {
          ${CALL_TO_ACTION}
          ${CONTENT}
          ${MEDIA_BLOCK}
          ${ARCHIVE_BLOCK}
        }
      }
    }
  }
`
