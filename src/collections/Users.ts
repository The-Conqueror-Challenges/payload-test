import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
  },
  auth: true,
  access: {
    read: () => true,
    create: ({ req: { user } }) => {
      // Only admins can create users
      return user?.role === 'admin'
    },
    update: ({ req: { user } }) => {
      // Only admins can update users
      return user?.role === 'admin'
    },
    delete: ({ req: { user } }) => {
      // Only admins can delete users
      return user?.role === 'admin'
    },
  },
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
        {
          label: 'Viewer',
          value: 'viewer',
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
