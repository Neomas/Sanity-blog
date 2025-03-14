import { DocumentTextIcon } from "@sanity/icons";
import { format, parseISO } from "date-fns";
import { defineField, defineType } from "sanity";

import authorType from "./author";
import { Any } from "next-sanity";

/**
 * This file is the schema definition for a post with internationalization.
 */

// Define the supported languages
const supportedLanguages = [
  { id: "en", title: "English" },
  { id: "fr", title: "French" },
  // Add more languages as needed
];

// Create a localized string field
const localeString = defineField({
  name: "localeString",
  type: "object",
  title: "Localized String",
  fields: supportedLanguages.map((lang) => ({
    name: lang.id,
    title: lang.title,
    type: "string",
  })),
});

// Create a localized text field
const localeText = defineField({
  name: "localeText",
  type: "object",
  title: "Localized Text",
  fields: supportedLanguages.map((lang) => ({
    name: lang.id,
    title: lang.title,
    type: "text",
  })),
});

// Create a localized block content field
const localeBlockContent = defineField({
  name: "localeBlockContent",
  type: "object",
  title: "Localized Block Content",
  fields: supportedLanguages.map((lang) => ({
    name: lang.id,
    title: lang.title,
    type: "array",
    of: [{ type: "block" }],
  })),
});

export default defineType({
  name: "post",
  title: "Post",
  icon: DocumentTextIcon,
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "object",
      fields: supportedLanguages.map((lang) => ({
        name: lang.id,
        title: lang.title,
        type: "string",
        validation: (rule: Any) => (lang.id === "en" ? rule.required() : rule),
      })),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      description: "A slug is required for the post to show up in the preview",
      options: {
        source: (doc) => doc.title?.en || "",
        maxLength: 96,
        isUnique: (value, context) => context.defaultIsUnique(value, context),
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "content",
      title: "Content",
      type: "object",
      fields: supportedLanguages.map((lang) => ({
        name: lang.id,
        title: lang.title,
        type: "array",
        of: [{ type: "block" }],
      })),
    }),
    defineField({
      name: "excerpt",
      title: "Excerpt",
      type: "object",
      fields: supportedLanguages.map((lang) => ({
        name: lang.id,
        title: lang.title,
        type: "text",
      })),
    }),
    defineField({
      name: "coverImage",
      title: "Cover Image",
      type: "image",
      options: {
        hotspot: true,
        aiAssist: {
          imageDescriptionField: "alt.en",
        },
      },
      fields: [
        {
          name: "alt",
          type: "object",
          title: "Alternative text",
          description: "Important for SEO and accessiblity.",
          fields: supportedLanguages.map((lang) => ({
            name: lang.id,
            title: lang.title,
            type: "string",
          })),
          validation: (rule) => {
            return rule.custom((alt, context) => {
              if (
                (context.document?.coverImage as any)?.asset?._ref &&
                !alt?.en
              ) {
                return "English alt text is required";
              }
              return true;
            });
          },
        },
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "date",
      title: "Date",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: "author",
      title: "Author",
      type: "reference",
      to: [{ type: authorType.name }],
    }),
  ],
  preview: {
    select: {
      title: "title",
      author: "author.name",
      date: "date",
      media: "coverImage",
    },
    prepare({ title, media, author, date }) {
      const subtitles = [
        author && `by ${author}`,
        date && `on ${format(parseISO(date), "LLL d, yyyy")}`,
      ].filter(Boolean);

      return { title, media, subtitle: subtitles.join(" ") };
    },
  },
});
