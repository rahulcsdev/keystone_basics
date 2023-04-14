import { config, list } from "@keystone-6/core";
import { allowAll } from "@keystone-6/core/access";
import { withAuth, session } from "./auth";
import {
  text,
  relationship,
  timestamp,
  select,
  password,
} from "@keystone-6/core/fields";
import { document } from "@keystone-6/fields-document";
const lists = {
  User: list({
    access: allowAll,
    fields: {
      name: text({ validation: { isRequired: true } }),
      email: text({ validation: { isRequired: true }, isIndexed: "unique" }),
      posts: relationship({ ref: "Post.author", many: true }),
      likePosts: relationship({ ref: "Post.likes", many: true }),
      password: password({ validation: true }),
    },
  }),
  Post: list({
    access: allowAll,
    fields: {
      title: text({ validation: { isRequired: true } }),

      author: relationship({
        ref: "User.posts",
      }),
      likes: relationship({ ref: "User.likePosts", many: true }),
      publishedAt: timestamp(),
      status: select({
        defaultValue: "draft",
        ui: { displayMode: "segmented-control" },
        options: [
          {
            label: "Published",
            value: "published",
          },
          { label: "Draft", value: "draft" },
        ],
      }),
      content: document({
        formatting: true,
        links: true,
        dividers: true,
        layouts: [
          [1, 1],
          [1, 1, 1],
          [2, 1],
          [1, 2],
          [1, 2, 1],
        ],
      }),
    },
  }),
};

export default config(
  withAuth({
    db: {
      provider: "sqlite",
      url: "file:./keystone.db",
    },
    lists,
    session,
    ui: {
      isAccessAllowed: (context) => !!context.session?.data,
    },
  })
);
// export default config({
//   db: {
//     provider: "sqlite",
//     url: "file:./keystone.db",
//   },
//   lists,
// });
