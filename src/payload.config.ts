import { buildConfig } from 'payload';
import { sqliteAdapter } from '@payloadcms/db-sqlite';
import { lexicalEditor } from '@payloadcms/richtext-lexical';
import path from 'path';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

import Users from './payload/collections/Users';
import Orders from './payload/collections/Orders';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
    admin: {
        user: Users.slug,
    },
    collections: [
        Users,
        Orders,
    ],
    editor: lexicalEditor({}),
    // Use generated secret or fallback to ensure dev server starts
    secret: process.env.PAYLOAD_SECRET || 'b6463890a5830f75b69fa9b0ff8998d5dced4a0fadf2dbdf412773fcdb9fa33d',
    typescript: {
        outputFile: path.resolve(dirname, 'payload-types.ts'),
    },
    db: sqliteAdapter({
        client: {
            url: process.env.DATABASE_URI || 'file:./payload.db',
        },
    }),
    sharp,
});
