import type { CollectionConfig } from 'payload'

export const SingleChallenges: CollectionConfig = {
  slug: 'single-challenges',
  admin: {
    useAsTitle: 'name',
  },
  fields: [
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
        update: ({ req: { user } }) => {
          // Only admins can change status to published
          if (user?.role === 'admin') return true
          // Editors can only set to draft or pending_approval
          return user?.role === 'editor'
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
          name: 'groupedChallenges',
          type: 'relationship',
          relationTo: 'grouped-challenges',
          hasMany: true,
          required: false,
          label: 'Part of Grouped Challenges',
          admin: {
            description: 'The grouped challenges that include this single challenge (automatically synced)',
            readOnly: true,
            isSortable: false,
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
          label: 'Medal Front Image',
          admin: {
            description: 'The image displayed on the front of the medal',
          },
        },
        {
          name: 'medalBackImage',
          type: 'upload',
          relationTo: 'media',
          label: 'Medal Back Image',
          admin: {
            description: 'The image displayed on the back of the medal',
          },
        },
        {
          name: 'backgroundImage',
          type: 'upload',
          relationTo: 'media',
          label: 'Background Image',
          admin: {
            description: 'The background image used for the challenge',
          },
        },
        {
          name: 'roundStickerImage',
          type: 'upload',
          relationTo: 'media',
          label: 'Round Sticker Image',
          admin: {
            description: 'The round sticker image for this challenge',
          },
        },
        {
          name: 'medalShowreelVideo',
          type: 'upload',
          relationTo: 'media',
          label: 'Medal Showreel Video',
          admin: {
            description: 'The video showcasing the medal',
          },
        },
        {
          name: 'medalShowreelThumbnail',
          type: 'upload',
          relationTo: 'media',
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
        const { payload } = req
        
        // Sync fields from this challenge to all grouped challenges that contain it
        if (operation === 'create' || operation === 'update') {
          try {
            const groupedChallenges = Array.isArray(doc.general?.groupedChallenges) 
              ? doc.general.groupedChallenges.map((g: any) => typeof g === 'string' ? g : g.id)
              : []
            
            // Update each grouped challenge that contains this challenge
            for (const groupId of groupedChallenges) {
              try {
                const groupedChallenge = await payload.findByID({
                  collection: 'grouped-challenges',
                  id: groupId,
                  req,
                })
                
                // Get all challenges in this group
                const challengeIds = Array.isArray(groupedChallenge.general?.challenges) 
                  ? groupedChallenge.general.challenges.map((c: any) => typeof c === 'string' ? c : c.id)
                  : []
                
                // Fetch all challenges to aggregate their data
                const challenges = await Promise.all(
                  challengeIds.map(async (id: string) => {
                    try {
                      return await payload.findByID({
                        collection: 'single-challenges',
                        id,
                        req,
                      })
                    } catch (error) {
                      console.error(`[Sync] Error fetching challenge ${id}:`, error)
                      return null
                    }
                  })
                )
                
                const validChallenges = challenges.filter((c): c is NonNullable<typeof c> => c !== null)
                
                // Aggregate distances: sum all distances from all challenges into a single entry
                const aggregatedDistances = validChallenges.reduce((acc: any, challenge: any) => {
                  if (Array.isArray(challenge.distances)) {
                    challenge.distances.forEach((distance: any) => {
                      acc.appDistanceKm = (acc.appDistanceKm || 0) + (distance.appDistanceKm || 0)
                      acc.appDistanceMi = (acc.appDistanceMi || 0) + (distance.appDistanceMi || 0)
                      acc.marketingDistanceKm = (acc.marketingDistanceKm || 0) + (distance.marketingDistanceKm || 0)
                      acc.marketingDistanceMi = (acc.marketingDistanceMi || 0) + (distance.marketingDistanceMi || 0)
                    })
                  }
                  return acc
                }, {} as any)
                
                // Convert to array format (single entry with summed values)
                const distancesArray = Object.keys(aggregatedDistances).length > 0 
                  ? [aggregatedDistances]
                  : []
                
                // Aggregate route details: sum virtualPostcards and localSpots, use first challenge's mapType and continent
                const aggregatedRouteDetails = validChallenges.reduce((acc: any, challenge: any) => {
                  if (challenge.routeDetails) {
                    acc.virtualPostcards = (acc.virtualPostcards || 0) + (challenge.routeDetails.virtualPostcards || 0)
                    acc.localSpots = (acc.localSpots || 0) + (challenge.routeDetails.localSpots || 0)
                    // Use first challenge's mapType and continent if not set
                    if (!acc.mapType && challenge.routeDetails.mapType) {
                      acc.mapType = challenge.routeDetails.mapType
                    }
                    if (!acc.continent && challenge.routeDetails.continent) {
                      acc.continent = challenge.routeDetails.continent
                    }
                  }
                  return acc
                }, {} as any)
                
                // Prepare update data
                const updateData: any = {}
                
                // Update distances if we have aggregated data
                if (distancesArray.length > 0) {
                  updateData.distances = distancesArray
                }
                
                // Update route details if we have aggregated data
                if (Object.keys(aggregatedRouteDetails).length > 0) {
                  updateData.routeDetails = {
                    ...groupedChallenge.routeDetails,
                    ...aggregatedRouteDetails,
                  }
                }
                
                // Only update if we have changes
                if (Object.keys(updateData).length > 0) {
                  await payload.update({
                    collection: 'grouped-challenges',
                    id: groupId,
                    data: updateData,
                    req,
                    overrideAccess: true,
                  })
                }
              } catch (error) {
                console.error(`[Sync] Error syncing challenge data to grouped challenge ${groupId}:`, error)
              }
            }
          } catch (error) {
            console.error('[Sync] Error syncing challenge fields to grouped challenges:', error)
          }
        }
        
        // Notify admins when a challenge is created or updated by any user (admin or editor)
        if (req.user && (operation === 'create' || operation === 'update')) {
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
                  message: `${req.user.role === 'admin' ? 'Admin' : 'Editor'} ${req.user.email} ${operation === 'create' ? 'created' : 'updated'} challenge "${challengeName}" - Status: ${doc.status}`,
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
        // When a single challenge is deleted, remove it from all grouped challenges
        try {
          const { payload } = req
          const groupedChallenges = Array.isArray(doc.general?.groupedChallenges) 
            ? doc.general.groupedChallenges.map((g: any) => typeof g === 'string' ? g : g.id)
            : []
          
          for (const groupId of groupedChallenges) {
            try {
              const groupedChallenge = await payload.findByID({
                collection: 'grouped-challenges',
                id: groupId,
                req,
              })
              
              const currentChallenges = Array.isArray(groupedChallenge.general?.challenges) 
                ? groupedChallenge.general.challenges.map((c: any) => typeof c === 'string' ? c : c.id)
                : []
              
              const updatedChallenges = currentChallenges.filter((challengeId: string) => challengeId !== doc.id)
              
              // Update the challenges list
              await payload.update({
                collection: 'grouped-challenges',
                id: groupId,
                data: {
                  general: {
                    ...groupedChallenge.general,
                    challenges: updatedChallenges,
                  },
                },
                req,
                overrideAccess: true,
              })
              
              // Recalculate aggregated fields from remaining challenges
              if (updatedChallenges.length > 0) {
                const remainingChallenges = await Promise.all(
                  updatedChallenges.map(async (id: string) => {
                    try {
                      return await payload.findByID({
                        collection: 'single-challenges',
                        id,
                        req,
                      })
                    } catch (error) {
                      console.error(`[Sync] Error fetching challenge ${id}:`, error)
                      return null
                    }
                  })
                )
                
                const validChallenges = remainingChallenges.filter((c): c is NonNullable<typeof c> => c !== null)
                
                // Aggregate distances: sum all distances from remaining challenges
                const aggregatedDistances = validChallenges.reduce((acc: any, challenge: any) => {
                  if (Array.isArray(challenge.distances)) {
                    challenge.distances.forEach((distance: any) => {
                      acc.appDistanceKm = (acc.appDistanceKm || 0) + (distance.appDistanceKm || 0)
                      acc.appDistanceMi = (acc.appDistanceMi || 0) + (distance.appDistanceMi || 0)
                      acc.marketingDistanceKm = (acc.marketingDistanceKm || 0) + (distance.marketingDistanceKm || 0)
                      acc.marketingDistanceMi = (acc.marketingDistanceMi || 0) + (distance.marketingDistanceMi || 0)
                    })
                  }
                  return acc
                }, {} as any)
                
                // Aggregate route details: sum virtualPostcards and localSpots, use first challenge's mapType and continent
                const aggregatedRouteDetails = validChallenges.reduce((acc: any, challenge: any) => {
                  if (challenge.routeDetails) {
                    acc.virtualPostcards = (acc.virtualPostcards || 0) + (challenge.routeDetails.virtualPostcards || 0)
                    acc.localSpots = (acc.localSpots || 0) + (challenge.routeDetails.localSpots || 0)
                    if (!acc.mapType && challenge.routeDetails.mapType) {
                      acc.mapType = challenge.routeDetails.mapType
                    }
                    if (!acc.continent && challenge.routeDetails.continent) {
                      acc.continent = challenge.routeDetails.continent
                    }
                  }
                  return acc
                }, {} as any)
                
                // Update aggregated fields
                const updateData: any = {}
                
                if (Object.keys(aggregatedDistances).length > 0) {
                  updateData.distances = [aggregatedDistances]
                }
                
                if (Object.keys(aggregatedRouteDetails).length > 0) {
                  updateData.routeDetails = {
                    ...groupedChallenge.routeDetails,
                    ...aggregatedRouteDetails,
                  }
                }
                
                if (Object.keys(updateData).length > 0) {
                  await payload.update({
                    collection: 'grouped-challenges',
                    id: groupId,
                    data: updateData,
                    req,
                    overrideAccess: true,
                  })
                }
              } else {
                // If no challenges remain, clear aggregated fields
                await payload.update({
                  collection: 'grouped-challenges',
                  id: groupId,
                  data: {
                    distances: [],
                    routeDetails: {
                      virtualPostcards: 0,
                      localSpots: 0,
                      mapType: groupedChallenge.routeDetails?.mapType || 'roadmap',
                      continent: groupedChallenge.routeDetails?.continent || 'asia',
                    },
                  },
                  req,
                  overrideAccess: true,
                })
              }
            } catch (error) {
              console.error(`[Sync] Error removing deleted single challenge from grouped challenge ${groupId}:`, error)
            }
          }
        } catch (error) {
          console.error('[Sync] Error syncing after single challenge deletion:', error)
        }
      },
    ],
  },
  versions: {
    drafts: true,
  },
}

