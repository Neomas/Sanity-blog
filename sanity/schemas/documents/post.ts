import { DocumentTextIcon } from "@sanity/icons";
import { format, parseISO } from "date-fns";
import { defineField, defineType } from "sanity";
import LocalizedFieldWithToggle, {
  LocalizedFieldWithToggleTextArea,
  // LocalizedFieldWithToggleWysiwyg,
} from "@/app/components/atoms/LocalizedFieldWithToggle";
import authorType from "./author";
import { set, setIfMissing } from "sanity";
import { supportedLanguages } from "@/sanity/lib/utils";
import { TextString, TextBlock } from "../contentblocks";

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
      fields: [TextString({ name: "title", title: "Title" })],
      // components: {
      // Use a simpler approach to define the component

      //   input: function CustomTitleInput(props) {
      //     const languageFields = supportedLanguages.map((lang) => ({
      //       name: lang.id,
      //       title: lang.title,
      //     }));
      //     return LocalizedFieldWithToggle({
      //       languageFields,
      //       value: props.value,
      //       onChange: (newValue: Record<string, any>) => {
      //         props.onChange(
      //           [setIfMissing({}), set(newValue)] // Apply both patches
      //         );
      //       },
      //     });
      //   },
      // },
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      description: "A slug is required for the post to show up in the preview",
      options: {
        //@ts-ignore
        source: (document) => (document?.title?.en as string) || "",
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
        of: [
          {
            type: "block",
            options: {
              spellCheck: true,
            },
          },
          {
            type: "object",
            name: "card",
            title: "Card",
            fields: [
              TextString({ name: "title", title: "Title" }),
              TextString({ name: "info", title: "Info" }),
              {
                name: "image",
                type: "image",
                options: {
                  hotspot: true,
                  aiAssist: {
                    imageDescriptionField: "alt.en",
                  },
                },
              },
            ],
          },
        ],
      })),
    }),
    defineField({
      name: "excerpt",
      title: "Excerpt",
      type: "object",
      fields: [TextBlock({ name: "title", title: "Title" })],
      // components: {
      //   // Use a simpler approach to define the component
      //   input: function CustomTitleInput(props) {
      //     const languageFields = supportedLanguages.map((lang) => ({
      //       name: lang.id,
      //       title: lang.title,
      //     }));
      //     return LocalizedFieldWithToggleTextArea({
      //       ...props,
      //       languageFields,
      //       onChange: (newValue: Record<string, any>) => {
      //         props.onChange(
      //           [setIfMissing({}), set(newValue)] // Apply both patches
      //         );
      //       },
      //     });
      //   },
      // },
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
          fields: [TextBlock({ name: "title", title: "Title" })],

          validation: (rule) => {
            return rule.custom((alt: Record<string, string>, context) => {
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
      title: "title.en",
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
