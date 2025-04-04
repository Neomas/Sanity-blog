import { defineType, defineField, defineConfig } from "sanity";
import { supportedLanguages } from "@lib/utils";
import {
  LocalizedFieldWithToggle,
  LocalizedFieldWithToggleTextArea,
} from "@components/Atoms/LocalizedFieldWithToggle";
import { set, setIfMissing } from "sanity";

export const bodyComponent = [
  { type: "heroComponent" },
  { type: "uspComponent" },
  { type: "blogGridComponent" },
  { type: "documentsBlockComponent" },
  // Add more component types here as you create them
];

export const TextString = ({
  name,
  title,
  fieldset,
  group,
  ...props
}: {
  name: string;
  title: string;
  fieldset?: string;
  group?: string;
}) =>
  defineField({
    name: name,
    title: title,
    type: "object",
    fields: supportedLanguages.map((lang) => ({
      name: lang.id,
      title: lang.title,
      type: "string",
    })),
    components: {
      // Use a simpler approach to define the component
      input: function CustomTitleInput(props) {
        const languageFields = supportedLanguages.map((lang) => ({
          name: lang?.id,
          title: lang?.title,
        }));
        return LocalizedFieldWithToggle({
          languageFields,
          value: props.value,
          onChange: (newValue: Record<string, any>) => {
            props.onChange(
              [setIfMissing({}), set(newValue)] // Apply both patches
            );
          },
        });
      },
    },

    fieldset,
    group,
    ...props,
  });
export const TextBlock = ({
  name,
  title,
  fieldset,
  group,
  ...props
}: {
  name: string;
  title: string;
  fieldset?: string;
  group?: string;
}) =>
  defineField({
    name: name,
    title: title,
    type: "object",
    fields: supportedLanguages.map((lang) => ({
      name: lang.id,
      title: lang.title,
      type: "string",
    })),
    components: {
      // Use a simpler approach to define the component
      input: function CustomTitleInput(props) {
        const languageFields = supportedLanguages.map((lang) => ({
          name: lang.id,
          title: lang.title,
        }));
        return LocalizedFieldWithToggleTextArea({
          languageFields,
          value: props.value,
          onChange: (newValue: Record<string, any>) => {
            props.onChange(
              [setIfMissing({}), set(newValue)] // Apply both patches
            );
          },
        });
      },
    },
    fieldset,
    group,
    ...props,
  });

// Hero Component Schema
export const heroComponent = defineType({
  name: "heroComponent",
  title: "Hero Component",
  type: "object",
  // fieldsets: [
  //   { name: "content", title: "Content", options: { collapsible: true } },
  //   { name: "layout", title: "Layout", options: { collapsible: true } },
  // ],
  groups: [
    {
      name: "content",
      title: "Content",
      default: true,
    },
    {
      name: "layout",
      title: "Layout",
    },
  ],
  fields: [
    TextString({ name: "title", title: "Title", group: "content" }),
    TextBlock({ name: "subtitle", title: "Subtitle", group: "content" }),

    defineField({
      name: "backgroundImage",
      title: "Background Image",
      type: "image",
      options: {
        hotspot: true,
      },
      group: "content",
    }),
    defineField({
      name: "primaryCta",
      title: "Primary CTA",
      type: "object",
      fields: [
        defineField({
          name: "text",
          title: "Button Text",
          type: "string",
        }),
        defineField({
          name: "link",
          title: "Link",
          type: "url",
        }),
      ],
      group: "content",
    }),
    defineField({
      name: "variant",
      title: "Variant",
      type: "string",
      options: {
        list: [
          { title: "Primary", value: "primary" },
          { title: "Secondary", value: "secondary" },
          { title: "Tertiary", value: "tertiary" },
        ],
        layout: "dropdown",
      },
      group: "layout",
    }),
  ],
  preview: {
    select: {
      title: "title.en",
      media: "backgroundImage",
    },
    prepare({ title, media }) {
      return {
        title: "Hero Component",
        subtitle: title,
        media,
      };
    },
  },
});

// USP Component Schema
export const uspComponent = defineType({
  name: "uspComponent",
  title: "USP Component",
  type: "object",
  fields: [
    TextString({ name: "title", title: "Title" }),

    defineField({
      name: "uspItems",
      title: "USP Items",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            TextString({ name: "icon", title: "Icon" }),
            TextString({ name: "title", title: "USP Title" }),
            TextBlock({ name: "description", title: "Description" }),
          ],
          preview: {
            select: {
              title: "title.en",
              icon: "icon.en",
            },
            prepare({ title, icon }) {
              return {
                title,
                subtitle: icon ? `Icon: ${icon}` : "No icon",
              };
            },
          },
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: "title.en",
      itemCount: "uspItems",
    },
    prepare({ title, itemCount }) {
      const itemsLength = itemCount?.length || 0;
      return {
        title: "USP Component",
        subtitle: `${title} (${itemsLength} items)`,
      };
    },
  },
});
// Blog grid Schema
export const blogGridComponent = defineType({
  name: "blogGridComponent",
  title: "Blog Grid",
  type: "object",
  fields: [
    TextString({ name: "title", title: "Title" }),
    TextBlock({ name: "info", title: "Info" }),
  ],
  preview: {
    select: {
      title: "title.en",
    },
    prepare({ title }) {
      return {
        title: "Blog Grid",
        subtitle: `${title}`,
      };
    },
  },
});
// Documents Block Schema
export const documentsBlockComponent = defineType({
  name: "documentsBlockComponent",
  title: "Documents Block",
  type: "object",
  fields: [
    TextString({ name: "title", title: "Title" }),
    TextBlock({ name: "info", title: "Info" }),
  ],
  preview: {
    select: {
      title: "title.en",
    },
    prepare({ title }) {
      return {
        title: `${title}`,
      };
    },
  },
});

// Documents Block Schema
export const formComponent = defineType({
  name: "formComponent",
  title: "Form Block",
  type: "object",
  fields: [
    TextString({ name: "title", title: "Title" }),
    TextBlock({ name: "info", title: "Info" }),
  ],

  preview: {
    select: {
      title: "title.en",
    },
    prepare({ title }) {
      return {
        title: `${title}`,
      };
    },
  },
});

// // Text Image Component Schema
// export const textImageComponent = defineType({
//   name: "textImageComponent",
//   title: "Text & Image Component",
//   type: "object",
//   fields: [
//     defineField({
//       name: "title",
//       title: "Title",
//       type: "string",
//     }),
//     defineField({
//       name: "content",
//       title: "Content",
//       type: "text",
//     }),
//     defineField({
//       name: "image",
//       title: "Image",
//       type: "image",
//       options: {
//         hotspot: true,
//       },
//     }),
//     defineField({
//       name: "imagePosition",
//       title: "Image Position",
//       type: "string",
//       options: {
//         list: [
//           { title: "Left", value: "left" },
//           { title: "Right", value: "right" },
//         ],
//       },
//       initialValue: "left",
//     }),
//   ],
//   preview: {
//     select: {
//       title: "title",
//       media: "image",
//     },
//     prepare({ title, media }) {
//       return {
//         title: "Text & Image Component",
//         subtitle: title,
//         media,
//       };
//     },
//   },
// });
