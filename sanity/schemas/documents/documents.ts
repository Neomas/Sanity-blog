import { UploadIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export default defineType({
  name: "documents",
  title: "Documents",
  icon: UploadIcon,
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "picture",
      title: "Picture",
      type: "image",
      fields: [
        {
          name: "alt",
          type: "string",
          title: "Alternative text",
          description: "Important for SEO and accessiblity.",
          validation: (rule) => {
            return rule.custom((alt, context) => {
              if ((context.document?.picture as any)?.asset?._ref && !alt) {
                return "Required";
              }
              return true;
            });
          },
        },
      ],
      options: {
        hotspot: true,
        aiAssist: {
          imageDescriptionField: "alt",
        },
      },
    }),

    defineField({
      name: "file",
      title: "File",
      type: "file",
      fields: [
        {
          name: "description",
          type: "string",
          title: "Description",
          description: "Brief description of the uploaded file.",
        },
      ],
      options: {
        accept: ".pdf,.doc,.docx,.txt,.xls,.xlsx,.csv",
      },
      validation: (rule) => rule.required(),
    }),
  ],
});
