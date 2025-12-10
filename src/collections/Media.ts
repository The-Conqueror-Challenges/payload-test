import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
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
      name: 'alt',
      type: 'text',
      required: true,
    },
    {
      name: 'challengeType',
      type: 'select',
      required: true,
      label: 'Challenge Type',
      options: [
        {
          label: 'None',
          value: 'none',
        },
        {
          label: 'Single Challenge',
          value: 'single',
        },
        {
          label: 'Challenge Group',
          value: 'grouped',
        },
      ],
      defaultValue: 'none',
      admin: {
        description: 'Select the type of challenge, or choose "None"',
      },
    },
    {
      name: 'singleChallenge',
      type: 'relationship',
      relationTo: 'single-challenges',
      required: false,
      label: 'Single Challenge',
      validate: (value: any, { data }: { data?: any }) => {
        if (data?.challengeType === 'single' && !value) {
          return 'Please select a Single Challenge. This field is required when "Single Challenge" is selected.'
        }
        return true
      },
      admin: {
        condition: (data) => data?.challengeType === 'single',
        description: 'Select a single challenge (required)',
      },
    },
    {
      name: 'groupedChallenge',
      type: 'relationship',
      relationTo: 'grouped-challenges',
      required: false,
      label: 'Challenge Group',
      validate: (value: any, { data }: { data?: any }) => {
        if (data?.challengeType === 'grouped' && !value) {
          return 'Please select a Challenge Group. This field is required when "Challenge Group" is selected.'
        }
        return true
      },
      admin: {
        condition: (data) => data?.challengeType === 'grouped',
        description: 'Select a challenge group (required)',
      },
    },
  ],
  hooks: {
    beforeChange: [
      ({ req, data }) => {
        // Set lastModifiedBy to current user's email
        if (req.user?.email) {
          data.lastModifiedBy = req.user.email
        }
        // Clear relationship fields based on challengeType selection
        if (data?.challengeType === 'none') {
          data.singleChallenge = null
          data.groupedChallenge = null
        } else if (data?.challengeType === 'single') {
          data.groupedChallenge = null
        } else if (data?.challengeType === 'grouped') {
          data.singleChallenge = null
        }
        return data
      },
    ],
    beforeValidate: [
      ({ data, operation }) => {
        // Require the corresponding challenge field based on challengeType
        if (operation === 'create' || operation === 'update') {
          if (data?.challengeType === 'single' && !data?.singleChallenge) {
            throw new Error('Please select a Single Challenge. This field is required when "Single Challenge" is selected.')
          }
          if (data?.challengeType === 'grouped' && !data?.groupedChallenge) {
            throw new Error('Please select a Challenge Group. This field is required when "Challenge Group" is selected.')
          }
        }
      },
    ],
    afterChange: [
      async ({ req, doc, operation }) => {
        // Notify admins when media is created or updated by editors (not admins)
        if (req.user && req.user.role === 'editor' && (operation === 'create' || operation === 'update')) {
          try {
            const { payload } = req
            // Find all admin users
            const admins = await payload.find({
              collection: 'users',
              where: {
                role: {
                  equals: 'admin',
                },
              },
              req,
            })

            // Create notifications for each admin
            // Use overrideAccess to ensure creation succeeds regardless of access control
            for (const admin of admins.docs) {
              const mediaAlt = (doc as { alt?: string }).alt || 'Unknown'
              const mediaFilename = (doc as { filename?: string }).filename || ''
              const mediaName = mediaFilename || mediaAlt
              await payload.create({
                collection: 'notifications',
                data: {
                  message: `Editor ${req.user.email} ${operation === 'create' ? 'created' : 'updated'} media "${mediaName}"`,
                  media: doc.id,
                  editor: req.user.id,
                },
                req,
                overrideAccess: true,
              })
            }
          } catch (error) {
            console.error('[Notifications] Error notifying admins about media:', error)
            console.error('[Notifications] Full error:', error instanceof Error ? error.message : String(error))
            // Don't throw - we don't want notification failures to break the main operation
          }
        }
      },
    ],
  },
  upload: true,
}
