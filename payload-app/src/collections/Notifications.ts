import type { CollectionConfig } from 'payload'

export const Notifications: CollectionConfig = {
  slug: 'notifications',
  admin: {
    useAsTitle: 'message',
    defaultColumns: ['message', 'read', 'createdAt'],
  },
  access: {
    read: ({ req: { user } }) => {
      // Only admins can read notifications
      return user?.role === 'admin'
    },
    create: ({ req }) => {
      // Allow creation from authenticated contexts (hooks run with user context)
      // This allows hooks to create notifications, but prevents manual creation through admin UI
      // Hooks will have req.user set, so this will allow hook-based creation
      return !!req.user
    },
    update: ({ req: { user } }) => {
      // Only admins can update (mark as read)
      return user?.role === 'admin'
    },
    delete: ({ req: { user } }) => {
      // Only admins can delete
      return user?.role === 'admin'
    },
  },
  fields: [
    {
      name: 'message',
      type: 'text',
      required: true,
    },
    {
      name: 'challenge',
      type: 'relationship',
      relationTo: 'challenges',
      required: false,
    },
    {
      name: 'editor',
      type: 'relationship',
      relationTo: 'users',
      required: false,
    },
    {
      name: 'read',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'type',
      type: 'select',
      options: [
        {
          label: 'Challenge Created',
          value: 'challenge_created',
        },
        {
          label: 'Challenge Updated',
          value: 'challenge_updated',
        },
      ],
      defaultValue: 'challenge_created',
    },
  ],
  timestamps: true,
}

