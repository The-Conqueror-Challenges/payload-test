import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true,
  },
  fields: [
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
          label: 'Grouped Challenge',
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
      label: 'Grouped Challenge',
      validate: (value: any, { data }: { data?: any }) => {
        if (data?.challengeType === 'grouped' && !value) {
          return 'Please select a Grouped Challenge. This field is required when "Grouped Challenge" is selected.'
        }
        return true
      },
      admin: {
        condition: (data) => data?.challengeType === 'grouped',
        description: 'Select a grouped challenge (required)',
      },
    },
  ],
  hooks: {
    beforeValidate: [
      ({ data, operation }) => {
        // Require the corresponding challenge field based on challengeType
        if (operation === 'create' || operation === 'update') {
          if (data?.challengeType === 'single' && !data?.singleChallenge) {
            throw new Error('Please select a Single Challenge. This field is required when "Single Challenge" is selected.')
          }
          if (data?.challengeType === 'grouped' && !data?.groupedChallenge) {
            throw new Error('Please select a Grouped Challenge. This field is required when "Grouped Challenge" is selected.')
          }
        }
      },
    ],
    beforeChange: [
      ({ data }) => {
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
  },
  upload: true,
}
