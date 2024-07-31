import type { CollectionConfig } from 'payload/types'

import type { Comment } from '../../payload-types'

import { checkRole } from '../Users/checkRole'
import { populateUser } from './hooks/populateUser'
import { revalidatePost } from './hooks/revalidatePost'

const Comments: CollectionConfig = {
  access: {
    read: () => true,
    create: () => true,
    update: ({ data, req: { user } }) => {
      return Boolean(
        checkRole(['admin'], user) ||
          (data?.status === 'draft' && (typeof data?.user === 'string' ? data?.user : data?.user?.id) === user?.id)
      )
    },
    // Only admins can delete comments
    delete: ({ req: { user } }) => checkRole(['admin'], user),
  },
  admin: {
    preview: (comment: Partial<Comment>) =>
      `${process.env.PAYLOAD_PUBLIC_SERVER_URL}/posts/${
        comment?.doc && typeof comment?.doc === 'object' ? comment?.doc?.slug : (comment?.doc as string)
      }`,
    useAsTitle: 'comment',
  },
  fields: [
    {
      name: 'user',
      hasMany: false,
      relationTo: 'users',
      type: 'relationship',
    },
    // This field is only used to populate the user data via the `populateUser` hook
    // This is because the `user` collection has access control locked to protect user privacy
    // GraphQL will also not return mutated user data that differs from the underlying schema
    {
      name: 'populatedUser',
      access: {
        update: () => false,
      },
      admin: {
        disabled: true,
        readOnly: true,
      },
      fields: [
        {
          name: 'id',
          type: 'text',
        },
        {
          name: 'name',
          type: 'text',
        },
      ],
      type: 'group',
    },
    {
      name: 'doc',
      hasMany: false,
      relationTo: 'posts',
      type: 'relationship',
    },
    {
      name: 'comment',
      type: 'textarea',
    },
  ],
  hooks: {
    afterChange: [revalidatePost],
    afterRead: [populateUser],
  },
  slug: 'comments',
  versions: {
    drafts: true,
  },
}

export default Comments
