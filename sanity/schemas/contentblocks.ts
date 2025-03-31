import { defineType, defineField } from "sanity";
import { supportedLanguages } from "@lib/utils";
import {
  LocalizedFieldWithToggle,
  LocalizedFieldWithToggleTextArea,
} from "../../app/components/atoms/LocalizedFieldWithToggle";
import { set, setIfMissing } from "sanity";

export const bodyComponent = [
  { type: "heroComponent" },
  { type: "uspComponent" },
  { type: "blogGridComponent" },
  // Add more component types here as you create them
];

export const TextString = ({ name, title }: { name: string; title: string }) =>
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
  });
export const TextBlock = ({ name, title }: { name: string; title: string }) =>
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
  });

// Hero Component Schema
export const heroComponent = defineType({
  name: "heroComponent",
  title: "Hero Component",
  type: "object",
  fields: [
    TextString({ name: "title", title: "Title" }),
    TextBlock({ name: "subtitle", title: "Subtitle" }),

    defineField({
      name: "backgroundImage",
      title: "Background Image",
      type: "image",
      options: {
        hotspot: true,
      },
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
