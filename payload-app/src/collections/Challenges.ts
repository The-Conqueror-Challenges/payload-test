import type { CollectionConfig } from 'payload'

export const Challenges: CollectionConfig = {
  slug: 'challenges',
  admin: {
    useAsTitle: 'title',
  },
  folders: true,
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'status',
      type: 'select',
      options: [
        {
          label: 'Draft',
          value: 'draft',
        },
        {
          label: 'Pending Approval',
          value: 'pending_approval',
        },
        {
          label: 'Published',
          value: 'published',
        },
      ],
      defaultValue: 'draft',
      required: true,
      access: {
        read: () => true,
        update: ({ req: { user } }) => {
          // Only admins can change status to published
          if (user?.role === 'admin') return true
          // Editors can only set to draft or pending_approval
          return user?.role === 'editor'
        },
      },
    },
  ],
  access: {
    read: () => true,
    create: ({ req: { user } }) => {
      // Both admins and editors can create
      return user?.role === 'admin' || user?.role === 'editor'
    },
    update: ({ req: { user } }) => {
      // Both admins and editors can update
      return user?.role === 'admin' || user?.role === 'editor'
    },
    delete: ({ req: { user } }) => {
      // Only admins can delete
      return user?.role === 'admin'
    },
  },
  hooks: {
    beforeChange: [
      ({ req, operation, data }) => {
        // Prevent editors from assigning folders
        if (req.user?.role === 'editor') {
          // Remove folder reference if editor tries to set one
          if (data.folder) {
            delete data.folder
          }
        }
        // If editor is creating/updating, set status to pending_approval
        if (req.user?.role === 'editor') {
          if (operation === 'create') {
            data.status = 'pending_approval'
          } else if (operation === 'update' && data.status !== 'published') {
            // If editor updates and it's not already published, set to pending_approval
            if (data.status !== 'draft') {
              data.status = 'pending_approval'
            }
          }
        }
        return data
      },
    ],
    afterChange: [
      async ({ req, doc, operation, previousDoc }) => {
        // Notify admins when editor creates or updates a challenge
        if (req.user?.role === 'editor' && (operation === 'create' || operation === 'update')) {
          try {
            // Find all admin users
            const admins = await req.payload.find({
              collection: 'users',
              where: {
                role: {
                  equals: 'admin',
                },
              },
            })

            // Create notifications for each admin
            for (const admin of admins.docs) {
              await req.payload.create({
                collection: 'notifications',
                data: {
                  message: `Editor ${req.user.email} ${operation === 'create' ? 'created' : 'updated'} challenge "${doc.title}" - Status: ${doc.status}`,
                  challenge: doc.id,
                  editor: req.user.id,
                  read: false,
                  type: operation === 'create' ? 'challenge_created' : 'challenge_updated',
                },
              })
            }
          } catch (error) {
            console.error('Error notifying admins:', error)
          }
        }
      },
    ],
  },
  versions: {
    drafts: true,
  },
}

