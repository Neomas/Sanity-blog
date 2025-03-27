import { DocumentTextIcon } from "@sanity/icons";
import { format, parseISO } from "date-fns";
import { defineField, defineType } from "sanity";
// Fix import statement to avoid type errors
import LocalizedFieldWithToggle, {
  LocalizedFieldWithToggleTextArea,
  LocalizedFieldWithToggleWysiwyg,
} from "@/app/components/atoms/LocalizedFieldWithToggle";
import authorType from "./author";
import { set, setIfMissing } from "sanity";
import { supportedLanguages } from "@/sanity/lib/utils";
/**
 * This file is the schema definition for a post with internationalization.
 */

// Define the supported languages
// const supportedLanguages = [
//   { id: "en", title: "English" },
//   { id: "fr", title: "French" },
//   { id: "nl", title: "Nederlands" },
//   // Add more languages as needed
// ];

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
      })),
      components: {
        // Use a simpler approach to define the component
        input: function CustomTitleInput(props) {
          const languageFields = supportedLanguages.map((lang) => ({
            name: lang.id,
            title: lang.title,
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
              { name: "title", type: "string", title: "Title" },
              { name: "info", type: "text", title: "info" },
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
            // components: {
            //   input: function CardInput(props: any) {
            //     return (
            //       <Card
            //             title={props.value?.title }
            //             info={props.value?.content }
            //             image={props.value?.image}
            //             />
            //           )
            //   }
            // },
          },
        ],
      })),

      // components: {
      //   // Use a simpler approach to define the component
      //   input: function CustomTitleInput(props) {
      //     const languageFields = supportedLanguages.map((lang) => ({
      //       name: lang.id,
      //       title: lang.title,
      //     }));
      //     return LocalizedFieldWithToggleWysiwyg({
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
      name: "excerpt",
      title: "Excerpt",
      type: "object",
      fields: supportedLanguages.map((lang) => ({
        name: lang.id,
        title: lang.title,
        type: "text",
      })),
      components: {
        // Use a simpler approach to define the component
        input: function CustomTitleInput(props) {
          const languageFields = supportedLanguages.map((lang) => ({
            name: lang.id,
            title: lang.title,
          }));
          return LocalizedFieldWithToggleTextArea({
            ...props,
            languageFields,
            onChange: (newValue: Record<string, any>) => {
              props.onChange(
                [setIfMissing({}), set(newValue)] // Apply both patches
              );
            },
          });
        },
      },
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
          components: {
            // Use a simpler approach to define the component
            input: function CustomTitleInput(props: any) {
              const languageFields = supportedLanguages.map((lang) => ({
                name: lang.id,
                title: lang.title,
              }));
              return LocalizedFieldWithToggle({
                ...props,
                languageFields,
                onChange: (newValue: Record<string, any>) => {
                  props.onChange(
                    [setIfMissing({}), set(newValue)] // Apply both patches
                  );
                },
              });
            },
          },
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
