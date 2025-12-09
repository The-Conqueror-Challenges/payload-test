import type { CollectionConfig } from 'payload'

export const Challenges: CollectionConfig = {
  slug: 'challenges',
  folders: true,
  hooks: {
    beforeValidate: [
      async ({ data, operation }) => {
        // Require a folder to be selected when creating a challenge
        if (operation === 'create' && !data?.folder) {
          throw new Error('Please choose a folder: Single Challenge or Grouped Challenges.')
        }
      },
    ],
  },
  fields: [
    {
      name: 'singleChallenge',
      type: 'group',
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'groupedChallenges',
      type: 'group',
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
        },
      ],
    },
  ],
}

