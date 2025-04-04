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
  { type: "hero" },
  { type: "contentBlock" },
  { type: "contentTimer" },
  { type: "newsBlock" },
  { type: "investmentBlock" },
  { type: "global" },
  { type: "mapBlock" },
  { type: "contactBlock" },
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

// Hero Component Schema
export const hero = defineType({
  name: "hero",
  title: "Hero",
  type: "object",
  fields: [
    TextString({ name: "title", title: "Title" }),
    TextBlock({ name: "subtitle", title: "Subtitle" }),

    // Add default fields based on common patterns
    defineField({
      name: "content",
      title: "Content",
      type: "object",
      fields: supportedLanguages.map((lang) => ({
        name: lang.id,
        title: lang.title,
        type: "text",
      })),
      components: {
        input: function CustomContentInput(props) {
          const languageFields = supportedLanguages.map((lang) => ({
            name: lang.id,
            title: lang.title,
          }));
          return LocalizedFieldWithToggleTextArea({
            languageFields,
            value: props.value,
            onChange: (newValue: Record<string, any>) => {
              props.onChange([setIfMissing({}), set(newValue)]);
            },
          });
        },
      },
    }),
  ],
  preview: {
    select: {
      title: "title.en",
    },
    prepare({ title }) {
      return {
        title: "Hero",
        subtitle: title,
      };
    },
  },
});

// ContentBlock Component Schema
export const contentBlock = defineType({
  name: "contentBlock",
  title: "ContentBlock",
  type: "object",
  fields: [
    TextString({ name: "title", title: "Title" }),
    TextBlock({ name: "subtitle", title: "Subtitle" }),

    // Add default fields based on common patterns
    defineField({
      name: "content",
      title: "Content",
      type: "object",
      fields: supportedLanguages.map((lang) => ({
        name: lang.id,
        title: lang.title,
        type: "text",
      })),
      components: {
        input: function CustomContentInput(props) {
          const languageFields = supportedLanguages.map((lang) => ({
            name: lang.id,
            title: lang.title,
          }));
          return LocalizedFieldWithToggleTextArea({
            languageFields,
            value: props.value,
            onChange: (newValue: Record<string, any>) => {
              props.onChange([setIfMissing({}), set(newValue)]);
            },
          });
        },
      },
    }),
  ],
  preview: {
    select: {
      title: "title.en",
    },
    prepare({ title }) {
      return {
        title: "ContentBlock",
        subtitle: title,
      };
    },
  },
});

// ContentTimer Component Schema
export const contentTimer = defineType({
  name: "contentTimer",
  title: "ContentTimer",
  type: "object",
  fields: [
    TextString({ name: "title", title: "Title" }),
    TextBlock({ name: "subtitle", title: "Subtitle" }),

    // Add default fields based on common patterns
    defineField({
      name: "content",
      title: "Content",
      type: "object",
      fields: supportedLanguages.map((lang) => ({
        name: lang.id,
        title: lang.title,
        type: "text",
      })),
      components: {
        input: function CustomContentInput(props) {
          const languageFields = supportedLanguages.map((lang) => ({
            name: lang.id,
            title: lang.title,
          }));
          return LocalizedFieldWithToggleTextArea({
            languageFields,
            value: props.value,
            onChange: (newValue: Record<string, any>) => {
              props.onChange([setIfMissing({}), set(newValue)]);
            },
          });
        },
      },
    }),
  ],
  preview: {
    select: {
      title: "title.en",
    },
    prepare({ title }) {
      return {
        title: "ContentTimer",
        subtitle: title,
      };
    },
  },
});

// NewsBlock Component Schema
export const newsBlock = defineType({
  name: "newsBlock",
  title: "NewsBlock",
  type: "object",
  fields: [
    TextString({ name: "title", title: "Title" }),
    TextBlock({ name: "subtitle", title: "Subtitle" }),

    // Add default fields based on common patterns
    defineField({
      name: "content",
      title: "Content",
      type: "object",
      fields: supportedLanguages.map((lang) => ({
        name: lang.id,
        title: lang.title,
        type: "text",
      })),
      components: {
        input: function CustomContentInput(props) {
          const languageFields = supportedLanguages.map((lang) => ({
            name: lang.id,
            title: lang.title,
          }));
          return LocalizedFieldWithToggleTextArea({
            languageFields,
            value: props.value,
            onChange: (newValue: Record<string, any>) => {
              props.onChange([setIfMissing({}), set(newValue)]);
            },
          });
        },
      },
    }),
  ],
  preview: {
    select: {
      title: "title.en",
    },
    prepare({ title }) {
      return {
        title: "NewsBlock",
        subtitle: title,
      };
    },
  },
});

// InvestmentBlock Component Schema
export const investmentBlock = defineType({
  name: "investmentBlock",
  title: "InvestmentBlock",
  type: "object",
  fields: [
    TextString({ name: "title", title: "Title" }),
    TextBlock({ name: "subtitle", title: "Subtitle" }),

    // Add default fields based on common patterns
    defineField({
      name: "content",
      title: "Content",
      type: "object",
      fields: supportedLanguages.map((lang) => ({
        name: lang.id,
        title: lang.title,
        type: "text",
      })),
      components: {
        input: function CustomContentInput(props) {
          const languageFields = supportedLanguages.map((lang) => ({
            name: lang.id,
            title: lang.title,
          }));
          return LocalizedFieldWithToggleTextArea({
            languageFields,
            value: props.value,
            onChange: (newValue: Record<string, any>) => {
              props.onChange([setIfMissing({}), set(newValue)]);
            },
          });
        },
      },
    }),
  ],
  preview: {
    select: {
      title: "title.en",
    },
    prepare({ title }) {
      return {
        title: "InvestmentBlock",
        subtitle: title,
      };
    },
  },
});

// Global Component Schema
export const global = defineType({
  name: "global",
  title: "Global",
  type: "object",
  fields: [
    TextString({ name: "title", title: "Title" }),
    TextBlock({ name: "subtitle", title: "Subtitle" }),

    // Add default fields based on common patterns
    defineField({
      name: "content",
      title: "Content",
      type: "object",
      fields: supportedLanguages.map((lang) => ({
        name: lang.id,
        title: lang.title,
        type: "text",
      })),
      components: {
        input: function CustomContentInput(props) {
          const languageFields = supportedLanguages.map((lang) => ({
            name: lang.id,
            title: lang.title,
          }));
          return LocalizedFieldWithToggleTextArea({
            languageFields,
            value: props.value,
            onChange: (newValue: Record<string, any>) => {
              props.onChange([setIfMissing({}), set(newValue)]);
            },
          });
        },
      },
    }),
  ],
  preview: {
    select: {
      title: "title.en",
    },
    prepare({ title }) {
      return {
        title: "Global",
        subtitle: title,
      };
    },
  },
});

// MapBlock Component Schema
export const mapBlock = defineType({
  name: "mapBlock",
  title: "MapBlock",
  type: "object",
  fields: [
    TextString({ name: "title", title: "Title" }),
    TextBlock({ name: "subtitle", title: "Subtitle" }),

    // Add default fields based on common patterns
    defineField({
      name: "content",
      title: "Content",
      type: "object",
      fields: supportedLanguages.map((lang) => ({
        name: lang.id,
        title: lang.title,
        type: "text",
      })),
      components: {
        input: function CustomContentInput(props) {
          const languageFields = supportedLanguages.map((lang) => ({
            name: lang.id,
            title: lang.title,
          }));
          return LocalizedFieldWithToggleTextArea({
            languageFields,
            value: props.value,
            onChange: (newValue: Record<string, any>) => {
              props.onChange([setIfMissing({}), set(newValue)]);
            },
          });
        },
      },
    }),
  ],
  preview: {
    select: {
      title: "title.en",
    },
    prepare({ title }) {
      return {
        title: "MapBlock",
        subtitle: title,
      };
    },
  },
});

// ContactBlock Component Schema
export const contactBlock = defineType({
  name: "contactBlock",
  title: "ContactBlock",
  type: "object",
  fields: [
    TextString({ name: "title", title: "Title" }),
    TextBlock({ name: "subtitle", title: "Subtitle" }),

    // Add default fields based on common patterns
    defineField({
      name: "content",
      title: "Content",
      type: "object",
      fields: supportedLanguages.map((lang) => ({
        name: lang.id,
        title: lang.title,
        type: "text",
      })),
      components: {
        input: function CustomContentInput(props) {
          const languageFields = supportedLanguages.map((lang) => ({
            name: lang.id,
            title: lang.title,
          }));
          return LocalizedFieldWithToggleTextArea({
            languageFields,
            value: props.value,
            onChange: (newValue: Record<string, any>) => {
              props.onChange([setIfMissing({}), set(newValue)]);
            },
          });
        },
      },
    }),
  ],
  preview: {
    select: {
      title: "title.en",
    },
    prepare({ title }) {
      return {
        title: "ContactBlock",
        subtitle: title,
      };
    },
  },
});
