import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Media } from './collections/Media'
import { Challenges } from './collections/Challenges'
import { Users } from './collections/Users'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Media, Challenges],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  folders: {
    browseByFolder: true,
  },
  onInit: async (payload) => {
    // Seed default folders for challenges
    const desiredFolders: { name: string; folderType: ('challenges')[] }[] = [
      { name: 'Single Challenge', folderType: ['challenges'] },
      { name: 'Grouped Challenges', folderType: ['challenges'] },
    ]

    for (const folder of desiredFolders) {
      const existing = await payload.find({
        collection: 'payload-folders',
        where: { name: { equals: folder.name } },
        limit: 1,
      })

      if (!existing.docs.length) {
        await payload.create({
          collection: 'payload-folders',
          data: folder,
        })
      }
    }
  },
  db: mongooseAdapter({
    url: process.env.MONGODB_URI || '',
  }),
  sharp,
  plugins: [],
})
