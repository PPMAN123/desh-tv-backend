"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// keystone.ts
var keystone_exports = {};
__export(keystone_exports, {
  default: () => keystone_default
});
module.exports = __toCommonJS(keystone_exports);
var import_core4 = require("@keystone-6/core");

// schemas/user.ts
var import_core = require("@keystone-6/core");
var import_access = require("@keystone-6/core/access");
var import_fields = require("@keystone-6/core/fields");
var user_default = (0, import_core.list)({
  // WARNING
  //   for this starter project, anyone can create, query, update and delete anything
  //   if you want to prevent random people on the internet from accessing your data,
  //   you can find out more at https://keystonejs.com/docs/guides/auth-and-access-control
  access: import_access.allowAll,
  // this is the fields for our User list
  fields: {
    // by adding isRequired, we enforce that every User should have a name
    //   if no name is provided, an error will be displayed
    name: (0, import_fields.text)({ validation: { isRequired: true } }),
    email: (0, import_fields.text)({
      validation: { isRequired: true },
      // by adding isIndexed: 'unique', we're saying that no user can have the same
      // email as another user - this may or may not be a good idea for your project
      isIndexed: "unique"
    }),
    password: (0, import_fields.password)({ validation: { isRequired: true } }),
    // we can use this field to see what Posts this User has authored
    //   more on that in the Post list below
    // posts: relationship({ ref: 'Post.author', many: true }),
    createdAt: (0, import_fields.timestamp)({
      // this sets the timestamp to Date.now() when the user is first created
      defaultValue: { kind: "now" }
    })
  }
});

// schemas/article.ts
var import_core2 = require("@keystone-6/core");
var import_access2 = require("@keystone-6/core/access");
var import_axios = __toESM(require("axios"));
var import_node_fs = __toESM(require("node:fs"));
var import_fields2 = require("@keystone-6/core/fields");
var import_fields_document = require("@keystone-6/fields-document");
var import_dotenv = __toESM(require("dotenv"));
import_dotenv.default.config();
function buildSlug(input) {
  return "/article/" + input.trim().toLowerCase().replace(/[^\w ]+/g, "").replace(/ +/g, "-");
}
var article_default = (0, import_core2.list)({
  access: import_access2.allowAll,
  fields: {
    slug: (0, import_fields2.text)({
      hooks: {
        resolveInput: ({ operation, resolvedData, inputData }) => {
          if (operation === "create" && !inputData.slug) {
            return buildSlug(inputData.title);
          }
          return resolvedData.slug;
        }
      },
      ui: {
        createView: {
          fieldMode: "hidden"
        }
      },
      db: {
        nativeType: "VarChar(380)"
      },
      isIndexed: "unique"
    }),
    image: (0, import_fields2.image)({ storage: "my_images" }),
    image_data: (0, import_fields2.text)({
      db: {
        //@ts-ignore
        nativeType: "LongText",
        isNullable: true
      },
      hooks: {
        resolveInput: async ({ operation, resolvedData, inputData }) => {
          if (!resolvedData.image_data) {
            console.log(resolvedData.image);
            const { data } = await import_axios.default.get(
              `${process.env.BASE_URL}/images/${resolvedData.image.id}.${resolvedData.image.extension}`,
              {
                responseEncoding: "base64"
              }
            );
            const imageBase64 = `data:image/${resolvedData.image.extension == "jpg" ? "jpeg" : resolvedData.image.extension};base64,` + data;
            import_node_fs.default.writeFile("./base64.txt", imageBase64, (err) => {
              if (err) {
                console.log(err);
              }
            });
            return imageBase64;
          }
          return null;
        }
      },
      ui: {
        createView: {
          fieldMode: "hidden"
        }
      },
      validation: {
        isRequired: false
      }
    }),
    title: (0, import_fields2.text)({
      isIndexed: "unique",
      validation: { isRequired: true }
    }),
    translated_date: (0, import_fields2.timestamp)({ validation: { isRequired: true } }),
    created_at: (0, import_fields2.timestamp)({
      defaultValue: { kind: "now" },
      validation: { isRequired: true }
    }),
    content: (0, import_fields_document.document)({
      formatting: true,
      layouts: [
        [1, 1],
        [1, 1, 1],
        [2, 1],
        [1, 2],
        [1, 2, 1]
      ],
      links: true,
      dividers: true
    }),
    category: (0, import_fields2.relationship)({
      ref: "Category.articles",
      ui: { hideCreate: false, displayMode: "select" },
      many: false
    }),
    recommendedArticles: (0, import_fields2.relationship)({
      ref: "Article",
      ui: { hideCreate: false, displayMode: "select" },
      many: true
    })
  }
});

// schemas/category.ts
var import_core3 = require("@keystone-6/core");
var import_access3 = require("@keystone-6/core/access");
var import_fields3 = require("@keystone-6/core/fields");
var category_default = (0, import_core3.list)({
  // WARNING
  //   for this starter project, anyone can create, query, update and delete anything
  //   if you want to prevent random people on the internet from accessing your data,
  //   you can find out more at https://keystonejs.com/docs/guides/auth-and-access-control
  access: import_access3.allowAll,
  // this is the fields for our Post list
  fields: {
    name: (0, import_fields3.text)({ validation: { isRequired: true } }),
    slug: (0, import_fields3.text)({ validation: { isRequired: true } }),
    // with this field, you can set a User as the author for a Post
    articles: (0, import_fields3.relationship)({
      // we could have used 'User', but then the relationship would only be 1-way
      ref: "Article.category",
      // this is some customisations for changing how this will look in the AdminUI
      ui: { hideCreate: false, displayMode: "select" },
      // a Post can only have one author
      //   this is the default, but we show it here for verbosity
      many: true
    })
  }
});

// schema.ts
var lists = {
  User: user_default,
  Article: article_default,
  Category: category_default
};

// auth.ts
var import_crypto = require("crypto");
var import_auth = require("@keystone-6/auth");
var import_session = require("@keystone-6/core/session");
var sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret && process.env.NODE_ENV !== "production") {
  sessionSecret = (0, import_crypto.randomBytes)(32).toString("hex");
}
var { withAuth } = (0, import_auth.createAuth)({
  listKey: "User",
  identityField: "email",
  // this is a GraphQL query fragment for fetching what data will be attached to a context.session
  //   this can be helpful for when you are writing your access control functions
  //   you can find out more at https://keystonejs.com/docs/guides/auth-and-access-control
  sessionData: "name createdAt",
  secretField: "password",
  // WARNING: remove initFirstItem functionality in production
  //   see https://keystonejs.com/docs/config/auth#init-first-item for more
  initFirstItem: {
    // if there are no items in the database, by configuring this field
    //   you are asking the Keystone AdminUI to create a new user
    //   providing inputs for these fields
    fields: ["name", "email", "password"]
    // it uses context.sudo() to do this, which bypasses any access control you might have
    //   you shouldn't use this in production
  }
});
var sessionMaxAge = 60 * 60 * 24 * 30;
var session = (0, import_session.statelessSessions)({
  maxAge: sessionMaxAge,
  secret: sessionSecret
});

// keystone.ts
var keystone_default = withAuth(
  (0, import_core4.config)({
    db: {
      provider: "mysql",
      url: process.env.DATABASE_URL ?? "mysql://glzj2bfqnshmew6i6qfd:pscale_pw_ngnIAh4vCu54y38T3jigdHj0B1iLx3gUrfRm1LtI2DC@aws.connect.psdb.cloud/desh-tv-clone-backend?sslaccept=strict",
      additionalPrismaDatasourceProperties: {
        relationMode: "prisma"
      },
      enableLogging: true,
      useMigrations: false,
      idField: { kind: "autoincrement" }
    },
    lists,
    session,
    server: {
      port: Number(process.env.BASE_PORT)
    },
    storage: {
      my_images: {
        kind: "local",
        type: "image",
        generateUrl: (path) => `http://localhost:3333/images${path}`,
        serverRoute: {
          path: "/images"
        },
        storagePath: "public/images"
      }
    }
  })
);
