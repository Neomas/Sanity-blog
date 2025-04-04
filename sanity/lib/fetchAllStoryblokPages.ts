import fs from "fs-extra";
import path from "path";
import StoryblokClient from "storyblok-js-client";
import { ISbStoriesParams } from "@storyblok/react";
import { cache } from "react";

// Set your Storyblok API key here
// const STORYBLOK_API_KEY = "your-storyblok-api-key";

// Create a directory for storing the JSON files if it doesn't exist
const STORYBLOK_DATA_DIR = path.resolve(process.cwd(), "storyblokData");

// Ensure the directory exists
const getStoryBlokClient = () => {
  let Storyblok = new StoryblokClient({
    accessToken: process.env.SB_ACCESS_TOKEN,
    cache: {
      clear: "auto",
      type: "memory",
    },

    responseInterceptor: (response) => {
      if (response.status === 404) {
        console.error("StoryblokClient failed 404", response);
      }
      //console.error("response status", response);
      // return the response
      return response;
    },
  });

  return Storyblok;
};

interface StoryblokPage {
  story: {
    id: number;
    name: string;
    slug: string;
    full_slug: string;
    content: object;
  }; // Page content
}

export const getStory = cache(async (id: string, params: ISbStoriesParams) => {
  const { version = "published", language = "default" } = params;
  const Storyblok = getStoryBlokClient();
  try {
    const url = `cdn/stories/${id}`;

    const story = await Storyblok.get(
      url,
      {
        version: version, //version,
        // cv: new Date().getTime(),
        language: language,
      },
      {
        next: {
          revalidate: false,
          tags: ["stories", id.replace("/", "")],
        },
      }
    );

    return story.data;
  } catch (e) {
    console.error(e);
    return null;
  }
});

export const getStories = cache(async (params: ISbStoriesParams) => {
  const { version = "published", language = "default", ...filters } = params;

  // try to get the component name from the filters (replace with custom logic, eg pass a contentType)
  let componentName = "";
  if (filters?.filter_query?.component) {
    // object to array and get the first value
    componentName =
      (Object.values(filters?.filter_query?.component)?.[0] as string) || "";
  }
  const cacheTags = ["stories", "list", `list-${componentName}`];
  const cacheType = version === "published" ? "force-cache" : "no-cache";

  const Storyblok = getStoryBlokClient();
  const stories = await Storyblok.get(
    "cdn/stories",
    {
      version: version,
      // cv: new Date().getTime(),
      language: language,
      // resolve_relations: resolve_relations,
      ...filters,
    },
    { next: { tags: cacheTags }, cache: cacheType }
  );

  // get all slugs and filter locale out if needed.
  const slugs = stories.data.stories.map((story) =>
    story.full_slug.replace(`${language}/`, "")
  );
  // await all separate stories

  const storyPromises = slugs.map((slug) => getStory(slug, params));
  const storyData = await Promise.all(storyPromises);
  // console.log({ stories });
  return { data: storyData, total: stories?.total };
});

export async function getLinks() {
  const Storyblok = getStoryBlokClient();
  const links = Storyblok.get("cdn/links", {
    version: "published",
    cv: Date.now(),
  });

  return links;
}

// Function to fetch pages from Storyblok API
// const fetchPages = async () => {
//   try {
//     const response = await axios.get(
//       `https://api.storyblok.com/v1/cdn/stories`,
//       {
//         params: {
//           version: "draft", // Can change to 'published' if needed
//           token: STORYBLOK_API_KEY,
//         },
//       }
//     );
//     return response.data.stories as StoryblokPage[];
//   } catch (error) {
//     console.error("Error fetching pages from Storyblok:", error);
//     return [];
//   }
// };

// Function to write each page's data into a separate JSON file
const writePagesToJson = async (pages: StoryblokPage[]) => {
  for (const page of pages) {
    const filePath = path.join(STORYBLOK_DATA_DIR, `${page.story.slug}.json`);

    // Write the page content to the JSON file
    await fs.writeJson(filePath, page, { spaces: 2 });
    console.log(`Written ${filePath}`);
  }
};

// Main function to fetch and save pages
const fetchAndSaveStoryblokPages = async () => {
  const { data: pages } = await getStories({
    version: "published",
  });

  if (pages.length > 0) {
    await writePagesToJson(pages);
    console.log("All pages have been written to JSON files.");
  } else {
    console.log("No pages were fetched.");
  }
};

// Execute the function
// fetchAndSaveStoryblokPages();
export default fetchAndSaveStoryblokPages;
