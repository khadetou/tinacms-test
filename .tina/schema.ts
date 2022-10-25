import { imageConfigDefault } from "next/dist/shared/lib/image-config";
import {
  defineConfig,
  defineSchema,
  RouteMappingPlugin,
  TinaTemplate,
} from "tinacms";
import type { Template } from "tinacms/dist/admin/types";
import { client } from "./__generated__/client";

const heroBlock: Template = {
  name: "hero",
  label: "Hero Block",
  fields: [
    {
      type: "string",
      label: "Heading",
      name: "heading",
    },
    {
      type: "string",
      label: "Sub Heading",
      name: "subheading",
    },
    {
      type: "string",
      label: "Description",
      name: "description",
      ui: {
        component: "textarea",
      },
    },
    {
      type: "image",
      name: "image",
      label: "Hero Image",
    },
  ],
};

const projectSection: Template = {
  name: "projects",
  label: "Projects Section",
  fields: [
    {
      type: "string",
      label: "Heading",
      name: "heading",
    },
    {
      type: "string",
      label: "Sub Heading",
      name: "subheading",
    },
    {
      type: "object",
      label: "Project Items",
      name: "items",
      list: true,
      fields: [
        {
          name: "image",
          label: "Project Image",
          type: "image",
        },
        {
          name: "name",
          label: "Content name",
          type: "string",
        },
        {
          type: "string",
          label: "Description",
          name: "description",
          ui: {
            component: "textarea",
          },
        },
        {
          name: "href",
          label: "Link URL",
          type: "string",
        },
      ],
    },
  ],
};

const featuredSection: Template = {
  name: "features",
  label: "Featured Articles",
  fields: [
    {
      type: "object",
      label: "Featured Items",
      name: "items",
      list: true,
      fields: [
        {
          name: "image",
          label: "Featured Image",
          type: "image",
        },
        {
          name: "title",
          label: "Featured Title",
          type: "string",
        },
        {
          name: "author",
          label: "Featured Author",
          type: "string",
        },
        {
          name: "category",
          label: "Featured Category",
          type: "string",
        },
        {
          type: "string",
          label: "Description",
          name: "description",
          ui: {
            component: "textarea",
          },
        },
        {
          name: "href",
          label: "Link URL",
          type: "string",
        },
      ],
    },
  ],
};

const schema = defineSchema({
  config: {
    clientId: process.env.NEXT_PUBLIC_TINA_CLIENT_ID,
    branch:
      process.env.NEXT_PUBLIC_TINA_BRANCH ||
      process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_REF ||
      process.env.HEAD,
    token: process.env.TINA_TOKEN,
    media: {
      loadCustomStore: async () => {
        const pack = await import("next-tinacms-cloudinary");
        return pack.TinaCloudCloudinaryMediaStore;
      },
    },
  },
  collections: [
    {
      label: "Page Content",
      name: "page",
      path: "content/page",
      format: "mdx",
      fields: [
        {
          type: "object",
          list: true,
          name: "block",
          label: "Sections",
          templates: [heroBlock, projectSection, featuredSection],
        },
      ],
    },
    {
      label: "Blog Posts",
      name: "post",
      path: "content/post",
      format: "mdx",
      fields: [
        {
          type: "string",
          label: "Title",
          name: "title",
        },
        {
          type: "datetime",
          label: "Published Date",
          name: "date",
        },
        {
          type: "image",
          label: "Cover Image",
          name: "image",
        },
        {
          type: "string",
          label: "Author",
          name: "author",
        },
        {
          type: "string",
          label: "Category",
          name: "category",
          options: ["tutorials", "thoughts", "productivity", "other"],
          list: true,
        },
        {
          type: "string",
          label: "Tags",
          name: "tags",
          list: true,
          ui: {
            component: "tags",
          },
        },
        {
          type: "string",
          label: "description",
          name: "description",
          ui: {
            component: "textarea",
          },
        },
        {
          type: "rich-text",
          label: "Blog Post Body",
          name: "body",
          isBody: true,
          templates: [
            {
              name: "youtube",
              label: "Youtube Video",
              fields: [
                {
                  type: "string",
                  label: "Youtube Video URL",
                  name: "url",
                },
              ],
            },
          ],
        },
      ],
    },
  ],
});

export default schema;

export const tinaConfig = defineConfig({
  client,
  schema,
  cmsCallback: (cms) => {
    const RouteMapping = new RouteMappingPlugin((collection, document) => {
      if (["page"].includes(collection.name)) {
        if (document._sys.filename === "home") {
          return "/";
        }
      }

      if (["post"].includes(collection.name)) {
        return `/posts/${document._sys.filename}`;
      }

      return undefined;
    });

    cms.plugins.add(RouteMapping);

    return cms;
  },
});
