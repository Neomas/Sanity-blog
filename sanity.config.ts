"use client";
/**
 * This config is used to set up Sanity Studio that's mounted on the `app/(sanity)/studio/[[...tool]]/page.tsx` route
 */
import { visionTool } from "@sanity/vision";
import { PluginOptions, defineConfig } from "sanity";
import { unsplashImageAsset } from "sanity-plugin-asset-source-unsplash";
import {
  presentationTool,
  defineDocuments,
  defineLocations,
  type DocumentLocation,
} from "sanity/presentation";
import { structureTool } from "sanity/structure";

import { apiVersion, dataset, projectId, studioUrl } from "@/sanity/lib/api";
import { pageStructure, singletonPlugin } from "@/sanity/plugins/settings";
import { supportedLanguages, resolveHref } from "@lib/utils";

import author from "@schemas/documents/author";
import post from "@schemas/documents/post";
import settings from "@schemas/singletons/settings";
import documents from "@schemas/documents/documents";
import page from "@schemas/documents/page";

import {
  heroComponent,
  uspComponent,
  blogGridComponent,
  documentsBlockComponent,
  hero,
  contentBlock,
  contentTimer,
  newsBlock,
  investmentBlock,
  global,
  mapBlock,
  contactBlock,
} from "@schemas/contentblocks"; // Adjust the path as needed

// import LocalizedInput from "@components/Studio/LocalizedInput";
// import DocumentSelector from "@components/Studio/DocumentSelector";
// import React from "react";

const homeLocation = {
  title: "Home",
  href: "/",
} satisfies DocumentLocation;

export default defineConfig({
  basePath: studioUrl,
  projectId,
  dataset,
  schema: {
    types: [
      // Singletons
      settings,
      // Documents
      page,
      post,
      author,
      documents,
      heroComponent,
      uspComponent,
      blogGridComponent,
      documentsBlockComponent,
      hero,
      contentBlock,
      contentTimer,
      newsBlock,
      investmentBlock,
      global,
      mapBlock,
      contactBlock,
    ],
  },
  // changes form items in the studio
  // form: {
  //   components: {
  //     input: (props) => {
  //       const { schemaType } = props;

  //       // For multilingual text fields
  //       if (schemaType.name === "object" || schemaType.name === "localeText") {
  //         return React.createElement(LocalizedInput, props);
  //       }
  //       // For document reference fields
  //       // if (schemaType.name === "reference") {
  //       //   return React.createElement(DocumentSelector, props);
  //       // }

  //       return props.renderDefault(props);
  //     },

  //     // Default to standard Sanity input
  //   },
  // },

  plugins: [
    presentationTool({
      resolve: {
        mainDocuments: defineDocuments([
          {
            route: "/posts/:slug",
            filter: `_type == "post" && slug.current == $slug`,
          },
          {
            route: "/fr", // French homepage
            filter: `_type == "page" && slug.current == "home"`,
          },
          {
            route: "/nl", // Dutch homepage
            filter: `_type == "page" && slug.current == "home"`,
          },
          {
            route: "/", // Root route
            filter: `_type == "page" && slug.current == "home"`, // Specifically select the home page
          },
          {
            route: "/:slug",
            filter: `_type == "page" && slug.current != "home"`, // Exclude home page from general routing
          },
          {
            route: "/:lang/:slug",
            filter: `_type == "page" && slug.current != "home" && (language == $lang)`,
          },
        ]),
        locations: {
          // Global settings for all locations
          settings: defineLocations({
            locations: [homeLocation],
            message: "Global settings applied across all pages",
            tone: "caution",
          }),

          post: defineLocations({
            select: {
              title: "title?.en",
              slug: "slug.current",
            },
            resolve: (doc) => {
              const href = resolveHref("post", doc?.slug);

              return {
                locations: [
                  {
                    title: doc?.title || "Untitled Post",
                    href: href || "/", // Fallback to home
                  },
                  homeLocation,
                ],
              };
            },
          }),
          home: defineLocations({
            select: {
              title: "title?.en",
              slug: "slug.current",
            },
            resolve: (doc) => {
              const localeLocations = supportedLanguages.map((lang) => ({
                title: `Home (${lang.title})`,
                href: lang.id === "en" ? "/" : `/${lang.id}`, // Root for English, /{lang} for others
              }));

              return {
                locations: [
                  {
                    title: "Home Page",
                    href: "/", // Direct link to home
                  },
                  // Global settings link
                  {
                    title: "Global Settings",
                    href: "/desk/settings", // Corrected settings path
                  },
                  ...localeLocations,
                  homeLocation,
                ],

                context: {
                  // You can add global settings information here
                  globalSettings: {
                    siteTitle: "Your Site Title",
                    description: "Global context for pages",
                  },
                },
              };
            },
          }),
        },
      },
      previewUrl: {
        previewMode: {
          enable: "/api/draft-mode/enable",
        },
      },
    }),
    structureTool({ structure: pageStructure([settings]) }),
    // Configures the global "new document" button, and document actions, to suit the Settings document singleton
    singletonPlugin([settings.name]),
    // Add an image asset source for Unsplash
    unsplashImageAsset(),
    // Sets up AI Assist with preset prompts
    // https://www.sanity.io/docs/ai-assist
    // assistWithPresets(),
    // Vision lets you query your content with GROQ in the studio
    // https://www.sanity.io/docs/the-vision-plugin
    process.env.NODE_ENV === "development" &&
      visionTool({ defaultApiVersion: apiVersion }),
  ].filter(Boolean) as PluginOptions[],
});
