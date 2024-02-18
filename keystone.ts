// Welcome to Keystone!
//
// This file is what Keystone uses as the entry-point to your headless backend
//
// Keystone imports the default export of this file, expecting a Keystone configuration object
//   you can find out more at https://keystonejs.com/docs/apis/config

import { config } from '@keystone-6/core';

// to keep this file tidy, we define our schema in a different file
import { lists } from './schema';

// authentication is configured separately here too, but you might move this elsewhere
// when you write your list-level access control functions, as they typically rely on session data
import { withAuth, session } from './auth';

export default withAuth(
  config({
    db: {
      provider: 'mysql',
      url: process.env.DATABASE_URL ?? 'mysql://glzj2bfqnshmew6i6qfd:pscale_pw_ngnIAh4vCu54y38T3jigdHj0B1iLx3gUrfRm1LtI2DC@aws.connect.psdb.cloud/desh-tv-clone-backend?sslaccept=strict'
      ,
      additionalPrismaDatasourceProperties: {
        relationMode: "prisma",
      },
      enableLogging: true,
      useMigrations: false,
      idField: { kind: 'autoincrement' },
    },
    lists,
    session,
    server: {
      port: Number(process.env.BASE_PORT),
    },
    storage: {
      my_images: {
        kind: 'local',
        type: 'image',
        generateUrl: path => `http://localhost:3333/images${path}`,
        serverRoute: {
          path: '/images',
        },
        storagePath: 'public/images',
      },
    },
  })
);
