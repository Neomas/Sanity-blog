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
            props.onChange(set({ ...(props.value || {}), ...newValue }));
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
            props.onChange(set({ ...props.value, ...newValue }));
          },
        });
      },
    },
    fieldset,
    group,
    ...props,
  });
export const ContentBlock = ({
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
    name,
    title,
    type: "object",
    fields: supportedLanguages.map((lang) => ({
      name: lang.id,
      title: lang.title,
      type: "array",
      of: [
        {
          type: "block",
          options: {
            spellCheck: true,
          },
        },
      ],
    })),
    fieldset,
    group,
    ...props,
  });

// Define all fields
export const BloksField = ({
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
    type: "array",
    of: [{ type: "reference", to: [{ type: "component" }] }],
  });

export const RichTextField = ({
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
      type: "array",
      of: [{ type: "block" }],
    })),
  });

export const MarkdownField = ({
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
      type: "markdown",
    })),
  });

export const NumberField = ({
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
      type: "number",
    })),
  });

export const DatetimeField = ({
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
      type: "datetime",
    })),
  });

export const BooleanField = ({
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
      type: "boolean",
    })),
  });

export const OptionField = ({
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
      options: {
        list: ["Option 1", "Option 2", "Option 3"],
      },
    })),
  });

export const OptionsField = ({
  name,
  title,
  fieldset,
  group,
  options,
  ...props
}: {
  name: string;
  title: string;
  fieldset?: string;
  group?: string;
  options?: any[];
}) =>
  defineField({
    name: name,
    title: title,
    type: "object",

    fields: supportedLanguages.map((lang) => ({
      name: lang.id,
      title: lang.title,
      type: "string",
      layout: "dropdown",
      options: {
        list: options,
      },
    })),
  });

export const AssetField = ({
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
      type: "image",
    })),
  });

export const MultiAssetField = ({
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
      type: "array",
      of: [{ type: "image" }],
    })),
  });

export const MultiLinkField = ({
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
      type: "url",
    })),
  });

// Hero Component Schema
export const heroComponent = defineType({
  name: "heroComponent",
  title: "Hero Component",
  type: "object",
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
    TextString({ name: "subtitle", title: "Subtitle", group: "content" }),

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
        TextString({ name: "text", title: "Button Text" }),
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
    ContentBlock({ name: "info", title: "Info" }),
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
    RichTextField({ name: "info", title: "Info" }),
    TextString({ name: "media", title: "Media" }),
    TextString({ name: "title", title: "Title" }),
    TextString({ name: "buttons", title: "Buttons" }),
    TextString({ name: "variant", title: "Variant" }),
  ],
  preview: {
    prepare() {
      return {
        title: "Hero",
      };
    },
  },
});

// ContentBlock Component Schema
export const contentBlock = defineType({
  name: "contentBlock",
  title: "ContentBlock",
  type: "object",
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
    TextString({ name: "id", title: "Id" }),
    RichTextField({ name: "info", title: "Info" }),
    OptionsField({
      name: "color",
      title: "Color",
      options: [
        { title: "white", value: "white" },
        { title: "red", value: "red" },
        { title: "blue", value: "blue" },
      ],
    }),
    AssetField({ name: "media", title: "Media" }),
    TextString({ name: "title", title: "Title" }),
    TextString({ name: "buttons", title: "Buttons" }),
    TextString({ name: "variant", title: "Variant" }),
    TextString({ name: "imagePosition", title: "ImagePosition" }),
    BooleanField({ name: "backgroundShape", title: "BackgroundShape" }),
  ],
  preview: {
    prepare() {
      return {
        title: "ContentBlock",
      };
    },
  },
});

// ContentTimer Component Schema
export const contentTimer = defineType({
  name: "contentTimer",
  title: "ContentTimer",
  type: "object",
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
    TextString({ name: "id", title: "Id" }),
    RichTextField({ name: "info", title: "Info" }),
    TextString({ name: "items", title: "Items" }),
    TextString({ name: "title", title: "Title" }),
    TextString({ name: "button", title: "Button" }),
  ],
  preview: {
    prepare() {
      return {
        title: "ContentTimer",
      };
    },
  },
});

// NewsBlock Component Schema
export const newsBlock = defineType({
  name: "newsBlock",
  title: "NewsBlock",
  type: "object",
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
    TextString({ name: "title", title: "Title" }),
    TextString({ name: "button", title: "Button" }),
  ],
  preview: {
    prepare() {
      return {
        title: "NewsBlock",
      };
    },
  },
});

// InvestmentBlock Component Schema
export const investmentBlock = defineType({
  name: "investmentBlock",
  title: "InvestmentBlock",
  type: "object",
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
    RichTextField({ name: "info", title: "Info" }),
    TextString({ name: "cards", title: "Cards" }),
    RichTextField({ name: "title", title: "Title" }),
    TextString({ name: "button", title: "Button" }),
    TextString({ name: "layout", title: "Layout" }),
  ],
  preview: {
    prepare() {
      return {
        title: "InvestmentBlock",
      };
    },
  },
});

// Global Component Schema
export const global = defineType({
  name: "global",
  title: "Global",
  type: "object",
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
  fields: [TextString({ name: "globalComponent", title: "GlobalComponent" })],
  preview: {
    prepare() {
      return {
        title: "Global",
      };
    },
  },
});

// MapBlock Component Schema
export const mapBlock = defineType({
  name: "mapBlock",
  title: "MapBlock",
  type: "object",
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
    TextString({ name: "email", title: "Email" }),
    AssetField({ name: "image", title: "Image" }),
    RichTextField({ name: "intro", title: "Intro" }),
    TextString({ name: "phone", title: "Phone" }),
    TextString({ name: "title", title: "Title" }),
    RichTextField({ name: "address", title: "Address" }),
    TextString({ name: "addressLink", title: "AddressLink" }),
    TextString({ name: "addressTitle", title: "AddressTitle" }),
  ],
  preview: {
    prepare() {
      return {
        title: "MapBlock",
      };
    },
  },
});

// ContactBlock Component Schema
export const contactBlock = defineType({
  name: "contactBlock",
  title: "ContactBlock",
  type: "object",
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
    TextString({ name: "id", title: "Id" }),
    TextString({ name: "info", title: "Info" }),
    TextString({ name: "title", title: "Title" }),
    TextString({ name: "mailTo", title: "MailTo" }),
    TextString({ name: "mailSubject", title: "MailSubject" }),
  ],
  preview: {
    prepare() {
      return {
        title: "ContactBlock",
      };
    },
  },
});
