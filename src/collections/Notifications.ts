import type { CollectionConfig } from 'payload'

export const Notifications: CollectionConfig = {
  slug: 'notifications',
  admin: {
    useAsTitle: 'message',
    defaultColumns: ['message', 'challenge', 'media', 'editor', 'createdAt'],
    disableDuplicate: true,
  },
  access: {
    read: ({ req: { user } }) => {
      // Only admins can read notifications
      if (!user) return false
      return user.role === 'admin'
    },
    create: () => {
      // Prevent manual creation through admin UI
      // Notifications are only created automatically by hooks using overrideAccess: true
      return false
    },
    update: ({ req: { user } }) => {
      // Only admins can update (mark as read)
      if (!user) return false
      return user.role === 'admin'
    },
    delete: ({ req: { user } }) => {
      // Only admins can delete
      if (!user) return false
      return user.role === 'admin'
    },
  },
  fields: [
    {
      name: 'lastModifiedBy',
      type: 'text',
      label: 'Last Modified By',
      admin: {
        readOnly: true,
        description: 'Shows who last modified this document',
      },
    },
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
      admin: {
        description: 'Click to go to the related challenge for editing/approval',
        position: 'sidebar',
      },
    },
    {
      name: 'media',
      type: 'relationship',
      relationTo: 'media',
      required: false,
      admin: {
        description: 'Click to go to the related media file for editing/approval',
        position: 'sidebar',
      },
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
    beforeChange: [
      ({ req, data }) => {
        // Set lastModifiedBy to current user's email
        if (req.user?.email) {
          data.lastModifiedBy = req.user.email
        }
        return data
      },
    ],
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
        if (doc.media) {
          doc.media = serializeRelationship(doc.media)
        }
        if (doc.editor) {
          doc.editor = serializeRelationship(doc.editor)
        }
        
        return doc
      },
    ],
  },
}

