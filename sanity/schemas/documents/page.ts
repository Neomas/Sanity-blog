import { DocumentTextIcon } from "@sanity/icons";
import { format, parseISO } from "date-fns";
import { defineField, defineType } from "sanity";
import { bodyComponent } from "@/sanity/lib/utils";

export default defineType({
  name: "page",
  title: "Pages",
  icon: DocumentTextIcon,
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      description: "A slug is required for the page to show up in the preview",
      options: {
        source: "title",
        maxLength: 96,
        isUnique: (value, context) => context.defaultIsUnique(value, context),
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "contentBlocks",
      title: "Content Blocks",
      type: "array",
      of: bodyComponent,
      description: "Add and arrange content blocks for this page",
    }),
    defineField({
      name: "seo",
      title: "SEO",
      type: "object",
      fields: [
        defineField({
          name: "metaDescription",
          title: "Meta Description",
          type: "text",
          validation: (rule) =>
            rule
              .max(160)
              .warning("SEO descriptions should be under 160 characters"),
        }),
        defineField({
          name: "keywords",
          title: "Keywords",
          type: "array",
          of: [{ type: "string" }],
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: "title",
      blocks: "contentBlocks",
    },
    prepare({ title, blocks }) {
      return {
        title,
        subtitle: `${blocks?.length || 0} content block${blocks?.length !== 1 ? "s" : ""}`,
      };
    },
  },
});
