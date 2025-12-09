import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
  },
  auth: true,
  fields: [
    {
      name: 'role',
      type: 'select',
      options: [
        {
          label: 'Admin',
          value: 'admin',
        },
        {
          label: 'Editor',
          value: 'editor',
        },
      ],
      defaultValue: 'editor',
      required: true,
      access: {
        read: () => true,
        update: ({ req: { user } }) => {
          // Only admins can change roles
          return user?.role === 'admin'
        },
      },
    },
  ],
}
