import type { CollectionConfig } from 'payload'

export const GroupedChallenges: CollectionConfig = {
  slug: 'grouped-challenges',
  admin: {
    useAsTitle: 'name',
  },
  labels: {
    singular: 'Challenge Group',
    plural: 'Challenge Groups',
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
      name: 'status',
      type: 'select',
      admin: {
        description: 'The publication status of the challenge',
      },
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
        update: ({ req: { user }, data }) => {
          // Only admins can change status to published
          if (user?.role === 'admin') return true
          // Editors can only set to draft or pending_approval, not published
          if (user?.role === 'editor') {
            // Prevent editors from setting status to published
            if (data?.status === 'published') {
              return false
            }
            return true
          }
          return false
        },
      },
    },
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Name',
      admin: {
        description: 'The name of the challenge',
      },
    },
    {
      name: 'general',
      type: 'group',
      label: 'General',
      fields: [
        {
          name: 'slug',
          type: 'text',
          required: true,
          label: 'Slug',
          admin: {
            description: 'URL-friendly identifier',
          },
        },
        {
          name: 'launchDate',
          type: 'date',
          required: true,
          label: 'Launch Date',
          admin: {
            description: 'The date and time when the challenge will be launched',
            date: {
              pickerAppearance: 'dayAndTime',
            },
          },
        },
        {
          name: 'challenges',
          type: 'relationship',
          relationTo: 'single-challenges',
          hasMany: true,
          required: true,
          label: 'Challenges',
          admin: {
            description: 'Select the individual challenges that are part of this group',
          },
        },
      ],
    },
    {
      name: 'distances',
      type: 'array',
      label: 'Distances',
      minRows: 1,
      defaultValue: [{}],
      admin: {
        description: 'Add multiple distance groups for different measurement contexts',
      },
      fields: [
        {
          name: 'appDistanceKm',
          type: 'number',
          required: true,
          label: 'App Distance (Km)',
          admin: {
            description: 'The total distance of the challenge in kilometers as shown in the app',
            step: 0.01,
          },
        },
        {
          name: 'appDistanceMi',
          type: 'number',
          required: true,
          label: 'App Distance (Mi)',
          admin: {
            description: 'The total distance of the challenge in miles as shown in the app',
            step: 0.01,
          },
        },
        {
          name: 'marketingDistanceKm',
          type: 'number',
          required: true,
          label: 'Marketing Distance (Km)',
          admin: {
            description: 'The marketing distance in kilometers',
            step: 0.01,
          },
        },
        {
          name: 'marketingDistanceMi',
          type: 'number',
          required: true,
          label: 'Marketing Distance (Mi)',
          admin: {
            description: 'The marketing distance in miles',
            step: 0.01,
          },
        },
      ],
    },
    {
      name: 'routeDetails',
      type: 'group',
      label: 'Route Details',
      fields: [
        {
          name: 'virtualPostcards',
          type: 'number',
          required: true,
          label: 'Virtual Postcards',
          admin: {
            description: 'The number of virtual postcards available in this challenge',
            step: 1,
          },
        },
        {
          name: 'localSpots',
          type: 'number',
          required: true,
          label: 'Local Spots',
          admin: {
            description: 'The number of local spots or checkpoints in this challenge',
            step: 1,
          },
        },
        {
          name: 'mapType',
          type: 'select',
          required: true,
          label: 'Map Type',
          admin: {
            description: 'The type of map display to use for this challenge',
          },
          options: [
            {
              label: 'Roadmap',
              value: 'roadmap',
            },
            {
              label: 'Satellite',
              value: 'satellite',
            },
            {
              label: 'Terrain',
              value: 'terrain',
            },
            {
              label: 'Hybrid',
              value: 'hybrid',
            },
          ],
        },
        {
          name: 'continent',
          type: 'select',
          required: true,
          label: 'Continent',
          admin: {
            description: 'The continent where this challenge takes place',
          },
          options: [
            {
              label: 'Africa',
              value: 'africa',
            },
            {
              label: 'Antarctica',
              value: 'antarctica',
            },
            {
              label: 'Asia',
              value: 'asia',
            },
            {
              label: 'Europe',
              value: 'europe',
            },
            {
              label: 'North America',
              value: 'north_america',
            },
            {
              label: 'Oceania',
              value: 'oceania',
            },
            {
              label: 'South America',
              value: 'south_america',
            },
          ],
        },
      ],
    },
    {
      name: 'media',
      type: 'group',
      label: 'Media',
      fields: [
        {
          name: 'colorHex',
          type: 'text',
          required: true,
          label: 'Color Hex',
          admin: {
            description: 'Hex color code (e.g., #FF5733)',
          },
        },
        {
          name: 'medalFrontImage',
          type: 'upload',
          relationTo: 'media',
          required: true,
          label: 'Medal Front Image',
          admin: {
            description: 'The image displayed on the front of the medal',
          },
        },
        {
          name: 'medalBackImage',
          type: 'upload',
          relationTo: 'media',
          required: true,
          label: 'Medal Back Image',
          admin: {
            description: 'The image displayed on the back of the medal',
          },
        },
        {
          name: 'backgroundImage',
          type: 'upload',
          relationTo: 'media',
          required: true,
          label: 'Background Image',
          admin: {
            description: 'The background image used for the challenge',
          },
        },
        {
          name: 'headerImage',
          type: 'upload',
          relationTo: 'media',
          required: true,
          label: 'Header Image',
          admin: {
            description: 'The header image displayed at the top of the grouped challenge',
          },
        },
        {
          name: 'roundStickerImage',
          type: 'upload',
          relationTo: 'media',
          required: true,
          label: 'Round Sticker Image',
          admin: {
            description: 'The round sticker image for this challenge',
          },
        },
        {
          name: 'medalShowreelVideo',
          type: 'upload',
          relationTo: 'media',
          required: true,
          label: 'Medal Showreel Video',
          admin: {
            description: 'The video showcasing the medal',
          },
        },
        {
          name: 'medalShowreelThumbnail',
          type: 'upload',
          relationTo: 'media',
          required: true,
          label: 'Medal Showreel Thumbnail',
          admin: {
            description: 'The thumbnail image for the medal showreel video',
          },
        },
      ],
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
        // Set lastModifiedBy to current user's email
        if (req.user?.email) {
          data.lastModifiedBy = req.user.email
        }
        
        // If editor is creating/updating, prevent them from setting status to published
        if (req.user?.role === 'editor') {
          if (operation === 'create') {
            data.status = 'pending_approval'
          } else if (operation === 'update') {
            // Editors cannot set status to published - only admins can approve
            if (data.status === 'published') {
              // Revert to pending_approval if editor tries to set to published
              data.status = 'pending_approval'
            } else if (data.status && data.status !== 'draft' && data.status !== 'pending_approval') {
              // Ensure only valid statuses for editors
              data.status = 'pending_approval'
            }
          }
        }
        return data
      },
    ],
    afterChange: [
      async ({ req, doc, operation, previousDoc }) => {
        const { payload } = req
        
        // Sync bidirectional relationship: Update single challenges to show they belong to this grouped challenge
        if (operation === 'create' || operation === 'update') {
          try {
            const challenges = doc.general?.challenges || (doc as { challenges?: string[] }).challenges || []
            const previousChallenges = previousDoc?.general?.challenges || (previousDoc as { challenges?: string[] })?.challenges || []
            
            // Get all single challenges that were previously in this group
            const removedChallenges = previousChallenges.filter((id: string) => !challenges.includes(id))
            
            // Remove this grouped challenge from single challenges that are no longer in the group
            for (const challengeId of removedChallenges) {
              try {
                const singleChallenge = await payload.findByID({
                  collection: 'single-challenges',
                  id: challengeId,
                  req,
                })
                
                const currentGroups = Array.isArray(singleChallenge.general?.groupedChallenges) 
                  ? singleChallenge.general.groupedChallenges.map((g: any) => typeof g === 'string' ? g : g.id)
                  : []
                
                const updatedGroups = currentGroups.filter((groupId: string) => groupId !== doc.id)
                
                await payload.update({
                  collection: 'single-challenges',
                  id: challengeId,
                  data: {
                    general: {
                      ...(singleChallenge.general || {}),
                      groupedChallenges: updatedGroups,
                    },
                  },
                  req,
                  overrideAccess: true,
                })
              } catch (error) {
                console.error(`[Sync] Error removing grouped challenge from single challenge ${challengeId}:`, error)
              }
            }
            
            // Add this grouped challenge to all single challenges in the group
            for (const challengeId of challenges) {
              try {
                const singleChallenge = await payload.findByID({
                  collection: 'single-challenges',
                  id: challengeId,
                  req,
                })
                
                const currentGroups = Array.isArray(singleChallenge.general?.groupedChallenges) 
                  ? singleChallenge.general.groupedChallenges.map((g: any) => typeof g === 'string' ? g : g.id)
                  : []
                
                if (!currentGroups.includes(doc.id)) {
                  await payload.update({
                    collection: 'single-challenges',
                    id: challengeId,
                    data: {
                      general: {
                        ...(singleChallenge.general || {}),
                        groupedChallenges: [...currentGroups, doc.id],
                      },
                    },
                    req,
                    overrideAccess: true,
                  })
                }
              } catch (error) {
                console.error(`[Sync] Error adding grouped challenge to single challenge ${challengeId}:`, error)
              }
            }
          } catch (error) {
            console.error('[Sync] Error syncing grouped challenge relationships:', error)
          }
        }
        
        // Notify admins when a grouped challenge is created or updated by editors (not admins)
        if (req.user && req.user.role === 'editor' && (operation === 'create' || operation === 'update')) {
          try {
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
              const challengeName = (doc as { name?: string }).name || 'Unknown'
              await payload.create({
                collection: 'notifications',
                data: {
                  message: `Editor ${req.user.email} ${operation === 'create' ? 'created' : 'updated'} grouped challenge "${challengeName}" - Status: ${doc.status}`,
                  challenge: doc.id,
                  editor: req.user.id,
                },
                req,
                overrideAccess: true,
              })
            }
          } catch (error) {
            console.error('[Notifications] Error notifying admins:', error)
            console.error('[Notifications] Full error:', error instanceof Error ? error.message : String(error))
            // Don't throw - we don't want notification failures to break the main operation
          }
        }
      },
    ],
    afterDelete: [
      async ({ req, doc }) => {
        // When a grouped challenge is deleted, remove it from all single challenges
        try {
          const { payload } = req
          const challenges = doc.general?.challenges || (doc as { challenges?: string[] }).challenges || []
          
          for (const challengeId of challenges) {
            try {
              const singleChallenge = await payload.findByID({
                collection: 'single-challenges',
                id: challengeId,
                req,
              })
              
              const currentGroups = Array.isArray(singleChallenge.general?.groupedChallenges) 
                ? singleChallenge.general.groupedChallenges.map((g: any) => typeof g === 'string' ? g : g.id)
                : []
              
              const updatedGroups = currentGroups.filter((groupId: string) => groupId !== doc.id)
              
              await payload.update({
                collection: 'single-challenges',
                id: challengeId,
                data: {
                  general: {
                    ...(singleChallenge.general || {}),
                    groupedChallenges: updatedGroups,
                  },
                },
                req,
                overrideAccess: true,
              })
            } catch (error) {
              console.error(`[Sync] Error removing deleted grouped challenge from single challenge ${challengeId}:`, error)
            }
          }
        } catch (error) {
          console.error('[Sync] Error syncing after grouped challenge deletion:', error)
        }
      },
    ],
  },
  versions: {
    drafts: true,
  },
}

