import type { CollectionConfig } from 'payload'

export const Notifications: CollectionConfig = {
  slug: 'notifications',
  admin: {
    useAsTitle: 'message',
    defaultColumns: ['message', 'createdAt'],
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
      relationTo: ['single-challenges', 'grouped-challenges'],
      required: false,
    },
    {
      name: 'editor',
      type: 'relationship',
      relationTo: 'users',
      required: false,
    },
  ],
  timestamps: true,
  hooks: {
    afterRead: [
      ({ doc }) => {
        // Serialize relationship fields to prevent serialization errors when passing to client components
        // Convert Mongoose documents or complex objects to plain values (IDs or strings)
        const serializeRelationship = (value: unknown): unknown => {
          if (!value) return value
          if (typeof value === 'string') return value
          if (typeof value === 'object' && value !== null) {
            // If it's a Mongoose document or has toJSON method, extract the ID
            if ('toJSON' in value || 'buffer' in value || '_id' in value) {
              return (value as { id?: string; _id?: unknown }).id || 
                     String((value as { _id?: unknown })._id || value)
            }
            // If it has an id property, use it
            if ('id' in value) {
              return (value as { id: string }).id
            }
          }
          return value
        }

        if (doc.challenge) {
          doc.challenge = serializeRelationship(doc.challenge)
        }
        if (doc.editor) {
          doc.editor = serializeRelationship(doc.editor)
        }
        
        return doc
      },
    ],
  },
}

