import * as fs from "fs";
import * as path from "path";

// Define the directories
const storyblokDir = path.resolve(process.cwd(), "storyblokData");
const sanityDir = path.resolve(process.cwd(), "sanityData");

// Ensure the source directory exists
if (!fs.existsSync(storyblokDir)) {
  console.error(`Source directory "${storyblokDir}" does not exist.`);
  process.exit(1);
}

// Ensure the destination directory exists; if not, create it
if (!fs.existsSync(sanityDir)) {
  fs.mkdirSync(sanityDir, { recursive: true });
}

// Define interfaces for Storyblok and Sanity structures
interface StoryblokButton {
  _uid: string;
  title: string;
  link: {
    cached_url: string;
  };
  // Add other properties as needed
}

interface StoryblokComponent {
  _uid: string;
  component: string;
  title: string;
  subtitle?: string;
  media?: {
    filename: string;
  };
  buttons?: StoryblokButton[];
  // Add other properties as needed
}

interface StoryblokStory {
  story: {
    content: {
      body: StoryblokComponent[];
    };
  };
  // Add other properties as needed
}

interface SanityButton {
  text: string;
  link: string;
}

interface SanityHeroComponent {
  _type: "heroComponent";
  _key: string;
  title: string;
  subtitle?: string;
  backgroundImage?: {
    asset: {
      _type: "image";
      _ref: string;
    };
  };
  primaryCta?: SanityButton;
}

interface SanityPage {
  _type: "page";
  contentBlocks: SanityHeroComponent /* | OtherComponentInterfaces */[];
}

// Function to transform Storyblok data to Sanity format
function transformStoryblokToSanity(storyblokData: StoryblokStory): SanityPage {
  console.log(storyblokData);
  const contentBlocks = storyblokData?.story?.content?.body
    .map((component) => {
      console.log({ component });

      switch (component.component) {
        case "Hero": {
          const heroComponent: SanityHeroComponent = {
            _type: "heroComponent",
            _key: component._uid,
            title: component.title,
            subtitle: component.subtitle,
            backgroundImage: component.media
              ? {
                  asset: {
                    _type: "image",
                    _ref: component.media.filename, // Adjust this if you have a different way to reference images
                  },
                }
              : undefined,
            primaryCta: component.buttons
              ? {
                  text: component.buttons[0].title,
                  link: component.buttons[0].link.cached_url,
                }
              : undefined,
          };
          return heroComponent;
        }
        // Handle other component types here
        default: {
          let newComponent: any = {
            _type: component.component,
            ...component,
          };

          newComponent._uid = null;
          newComponent.id = null;
          return newComponent;
        }
      }
    })
    .filter((block): block is SanityHeroComponent => block !== null); // Remove any null values

  return {
    _type: "page",
    contentBlocks,
  };
}

const transformFiles = () => {
  // Read all files in the storyblokData directory
  const files = fs.readdirSync(storyblokDir);

  // Filter for JSON files
  const jsonFiles = files.filter(
    (file) => path.extname(file).toLowerCase() === ".json"
  );
  console.log(`Transforming`);

  jsonFiles.forEach((file) => {
    const filePath = path.join(storyblokDir, file);
    const outputFilePath = path.join(sanityDir, file);

    try {
      // Read and parse each JSON file
      const data = fs.readFileSync(filePath, "utf8");
      const storyblokData = JSON.parse(data);
      const sanityData = transformStoryblokToSanity(storyblokData);
      const sanityJson = JSON.stringify(sanityData, null, 2);

      // Write the transformed data to the sanityData directory
      fs.writeFileSync(outputFilePath, sanityJson, "utf8");
      console.log(`Successfully processed and saved ${file}`);
    } catch (err) {
      console.error(`Error processing file ${file}:`, err);
    }
  });

  console.log(`Done!`);
};

export default transformFiles;
