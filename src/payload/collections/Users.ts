import { CollectionConfig } from 'payload';

const Users: CollectionConfig = {
    slug: 'users',
    auth: true,
    admin: {
        useAsTitle: 'email',
    },
    fields: [
        // Email and Password are added by default when auth: true
    ],
};

export default Users;
