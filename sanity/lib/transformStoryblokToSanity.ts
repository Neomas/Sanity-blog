import * as fs from "fs";
import * as path from "path";
import { NextResponse } from "next/server";

//TODO
// 1. Map all SB content fields to San content fields
// 2. Create San content types in contentblocks.ts for each block
// 3. Download all assets and upload them to San
// 4. Fetch all SB content and transform it to San content
// 5.1 Do this for each language
// 6. Import all content to San

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
    name: string;
    slug: string;
    full_slug: string;

    content: {
      body: StoryblokComponent[];
    };
  };
  // Add other properties as needed
}

interface SanityButton {
  text: {
    en?: string;
    fr?: string;
    nl?: string;
  };
  link: string;
}

interface SanityHeroComponent {
  _type: "heroComponent";
  _key: string;
  title: {
    en?: string;
    fr?: string;
    nl?: string;
  };
  subtitle?: {
    en?: string;
    fr?: string;
    nl?: string;
  };
  backgroundImage?: {
    asset: {
      _type: "image";
      _ref: string;
    };
  };
  primaryCta?: SanityButton;
}

// Function to parse existing contentblocks.ts and extract component types
function parseExistingSchemas(schemaFilePath: string): string[] {
  try {
    if (!fs.existsSync(schemaFilePath)) {
      console.error(`Schema file does not exist at: ${schemaFilePath}`);
      return [];
    }

    const content = fs.readFileSync(schemaFilePath, "utf8");

    // Extract component types from bodyComponent array
    const bodyComponentMatch = content.match(
      /export const bodyComponent = \[(.*?)\];/s
    );
    if (!bodyComponentMatch) return [];

    const bodyComponentContent = bodyComponentMatch[1];
    const componentTypes =
      bodyComponentContent.match(/{ type: "(.*?)" }/g) || [];

    return componentTypes
      .map((type) => {
        const match = type.match(/"(.*?)"/);
        return match ? match[1] : "";
      })
      .filter(Boolean);
  } catch (error) {
    console.error("Error parsing schema file:", error);
    return [];
  }
}

// Function to add a new component type to the bodyComponent array
function addComponentToBodyComponent(
  schemaFilePath: string,
  componentType: string
): void {
  try {
    let content = fs.readFileSync(schemaFilePath, "utf8");

    // Find bodyComponent array
    const bodyComponentRegex = /(export const bodyComponent = \[)(.*?)(\];)/s;
    const match = content.match(bodyComponentRegex);

    if (!match) {
      console.error("Could not find bodyComponent array in schema file");
      return;
    }
    const componentName =
      componentType.charAt(0).toLowerCase() + componentType.slice(1);

    // Add new component type to the array
    const newBodyComponent = `${match[1]}${match[2]}  { type: "${componentName}" },\n${match[3]}`;
    content = content.replace(bodyComponentRegex, newBodyComponent);

    fs.writeFileSync(schemaFilePath, content, "utf8");
    console.log(`Added ${componentType} to bodyComponent array`);
  } catch (error) {
    console.error(`Error adding component to bodyComponent: ${error}`);
  }
}

function analyzeComponentStructure(
  componentType: string,
  storyblokDir: string
): string[] {
  try {
    // Read all JSON files in the storyblokData directory
    const files = fs.readdirSync(storyblokDir);
    const jsonFiles = files.filter(
      (file) => path.extname(file).toLowerCase() === ".json"
    );

    // Set to track field names for this component
    const fieldMap = new Map<string, { type: string; count: number }>();

    // Process each file to find components of this type
    jsonFiles.forEach((file) => {
      const filePath = path.join(storyblokDir, file);
      const data = fs.readFileSync(filePath, "utf8");
      const storyblokData = JSON.parse(data);

      // Find components of the requested type
      const components =
        storyblokData?.story?.content?.body?.filter(
          (comp: any) => comp.component === componentType
        ) || [];

      // Analyze each component's structure
      components.forEach((component: any) => {
        // Process each property in the component
        Object.entries(component).forEach(([key, value]: [string, any]) => {
          // Skip internal props and component identifier
          if (key === "_uid" || key === "component" || key === "_editable")
            return;

          let fieldType = "string";

          // Determine field type based on value
          if (typeof value === "string") {
            fieldType = "string";
          } else if (typeof value === "number") {
            fieldType = "number";
          } else if (typeof value === "boolean") {
            fieldType = "boolean";
          } else if (Array.isArray(value)) {
            fieldType = "array";
          } else if (value && typeof value === "object") {
            if (value.type === "doc") {
              fieldType = "richtext";
            } else if (value.filename) {
              fieldType = "image";
            } else if (value.cached_url) {
              fieldType = "url";
            } else {
              fieldType = "object";
            }
          }

          // Update field count in map
          const existingField = fieldMap.get(key);
          if (existingField) {
            // If field already exists but with different type, use most specific type
            fieldMap.set(key, {
              type: existingField.type === fieldType ? fieldType : "mixed",
              count: existingField.count + 1,
            });
          } else {
            fieldMap.set(key, { type: fieldType, count: 1 });
          }
        });
      });
    });

    // Generate field definitions based on analysis
    const fields: string[] = [];

    fieldMap.forEach((value, key) => {
      // Only include fields that appear in at least one component
      if (value.count > 0) {
        switch (value.type) {
          case "string":
            fields.push(
              `TextString({ name: "${key}", title: "${key.charAt(0).toUpperCase() + key.slice(1)}" })`
            );
            break;
          case "text":
            fields.push(
              `RichTextField({ name: "${key}", title: "${key.charAt(0).toUpperCase() + key.slice(1)}" })`
            );
            break;
          case "richtext":
            fields.push(
              `RichTextField({ name: "${key}", title: "${key.charAt(0).toUpperCase() + key.slice(1)}" })`
            );
            break;
          case "markdown":
            fields.push(
              `MarkdownBlock({ name: "${key}", title: "${key.charAt(0).toUpperCase() + key.slice(1)}" })`
            );
            break;
          case "number":
            fields.push(
              `NumberField({ name: "${key}", title: "${key.charAt(0).toUpperCase() + key.slice(1)}" })`
            );
            break;
          case "boolean":
            fields.push(
              `BooleanField({ name: "${key}", title: "${key.charAt(0).toUpperCase() + key.slice(1)}" })`
            );
            break;
          case "datetime":
            fields.push(
              `DateTimeField({ name: "${key}", title: "${key.charAt(0).toUpperCase() + key.slice(1)}" })`
            );
            break;
          case "option":
            fields.push(
              `SingleOptionField({ name: "${key}", title: "${key.charAt(0).toUpperCase() + key.slice(1)}" })`
            );
            break;
          case "options":
            fields.push(
              `MultiOptionField({ name: "${key}", title: "${key.charAt(0).toUpperCase() + key.slice(1)}" })`
            );
            break;
          case "image":
            fields.push(
              `AssetField({ name: "${key}", title: "${key.charAt(0).toUpperCase() + key.slice(1)}" })`
            );
            break;
          case "multiasset":
            fields.push(
              `MultiAssetField({ name: "${key}", title: "${key.charAt(0).toUpperCase() + key.slice(1)}" })`
            );
            break;
          case "multilink":
            fields.push(
              `MultiLinkField({ name: "${key}", title: "${key.charAt(0).toUpperCase() + key.slice(1)}" })`
            );
            break;
          case "bloks":
            fields.push(
              `BlocksField({ name: "${key}", title: "${key.charAt(0).toUpperCase() + key.slice(1)}" })`
            );
            break;
          case "mixed":
            if (["variant", "style", "theme"].includes(key)) {
              fields.push(`
              defineField({
                name: "${key}",
                title: "${key.charAt(0).toUpperCase() + key.slice(1)}",
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
              })`);
            } else {
              fields.push(
                `TextString({ name: "${key}", title: "${key.charAt(0).toUpperCase() + key.slice(1)}" })`
              );
            }
            break;
          default:
            fields.push(
              `TextString({ name: "${key}", title: "${key.charAt(0).toUpperCase() + key.slice(1)}" })`
            );
        }
      }
    });

    return fields;
  } catch (error) {
    console.error(
      `Error analyzing component structure for ${componentType}:`,
      error
    );
    // Return default fields as fallback
    return [
      `TextString({ name: "title", title: "Title" })`,
      `TextBlock({ name: "subtitle", title: "Subtitle" })`,
    ];
  }
}

// Function to generate a new component schema definition based on component analysis
function generateComponentSchema(
  componentType: string,
  storyblokDir: string
): string {
  // Convert componentType to camelCase if necessary (assuming it might be PascalCase from Storyblok)
  const componentName =
    componentType.charAt(0).toLowerCase() + componentType.slice(1);

  // Analyze component structure to generate appropriate fields
  const fields = analyzeComponentStructure(componentType, storyblokDir);

  // Join fields with commas and proper indentation
  const fieldsStr = fields.join(",\n    ");

  return `
// ${componentType} Component Schema
export const ${componentName} = defineType({
  name: "${componentName}",
  title: "${componentType}",
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
    ${fieldsStr}
  ],
  preview: {
    prepare() {
      return {
        title: "${componentType}"
      };
    },
  },
});`;
}

// Function to add a new component schema to the contentblocks.ts file
function addComponentSchema(
  schemaFilePath: string,
  componentSchema: string
): void {
  try {
    let content = fs.readFileSync(schemaFilePath, "utf8");

    // Add the new schema at the end of the file before any export statements
    const exportStatementMatch = content.match(/export \{[^}]*\};?\s*$/);

    if (exportStatementMatch) {
      // If there's an export statement at the end, insert before it
      const position = exportStatementMatch.index || content.length;
      content =
        content.substring(0, position) +
        componentSchema +
        "\n\n" +
        content.substring(position);
    } else {
      // Otherwise, just append to the end
      content += "\n\n" + componentSchema;
    }

    fs.writeFileSync(schemaFilePath, content, "utf8");
    console.log(`Added new component schema to file`);
  } catch (error) {
    console.error(`Error adding component schema: ${error}`);
  }
}

// Enhanced transform function that also checks and updates schema
function transformAndUpdateSchemas(
  storyblokDir: string,
  sanityDir: string,
  schemaFilePath: string
) {
  // Read all files in the storyblokData directory
  const files = fs.readdirSync(storyblokDir);

  // Filter for JSON files
  const jsonFiles = files.filter(
    (file) => path.extname(file).toLowerCase() === ".json"
  );

  console.log(`Transforming files and checking schemas`);

  // Get existing component types from schema
  const existingComponentTypes = parseExistingSchemas(schemaFilePath);
  console.log(
    `Found existing component types: ${existingComponentTypes.join(", ")}`
  );

  // Set to track found component types (to avoid duplicates)
  const foundComponentTypes = new Set<string>();

  jsonFiles.forEach((file) => {
    const filePath = path.join(storyblokDir, file);
    const outputFilePath = path.join(sanityDir, file);

    try {
      // Read and parse each JSON file
      const data = fs.readFileSync(filePath, "utf8");
      const storyblokData = JSON.parse(data);

      // Extract component types from the data
      const componentTypes =
        storyblokData?.story?.content?.body?.map(
          (component: any) => component.component
        ) || [];

      // Add each component type to the set
      componentTypes.forEach((type: string) => {
        if (type) foundComponentTypes.add(type);
      });

      // Original transform and save logic
      const sanityData = transformStoryblokToSanity(storyblokData);
      const sanityJson = JSON.stringify(sanityData, null, 2);
      fs.writeFileSync(outputFilePath, sanityJson, "utf8");

      console.log(`Successfully processed and saved ${file}`);
    } catch (err) {
      console.error(`Error processing file ${file}:`, err);
    }
  });

  // Check which component types are missing from the schema
  const missingComponentTypes = Array.from(foundComponentTypes).filter(
    (type) => {
      // Convert componentType to camelCase
      const componentName = type.charAt(0).toLowerCase() + type.slice(1);
      return !existingComponentTypes.includes(componentName);
    }
  );

  console.log(
    `Found ${missingComponentTypes.length} missing component types: ${missingComponentTypes.join(", ")}`
  );

  // Add missing component types to the schema
  missingComponentTypes.forEach((type) => {
    console.log(`Adding schema for component type: ${type}`);

    // Add to bodyComponent array
    addComponentToBodyComponent(schemaFilePath, type);

    // Generate and add new component schema
    const componentSchema = generateComponentSchema(type, storyblokDir);
    addComponentSchema(schemaFilePath, componentSchema);
  });

  console.log(
    `Schema update completed. Added ${missingComponentTypes.length} new component types.`
  );

  return {
    transformedFiles: jsonFiles.length,
    addedComponents: missingComponentTypes,
  };
}

function storyBlokFormatTransform(component: any) {
  let newComponent: any = {};

  Object.entries(component).map((item: any, i) => {
    // console.log(item);
    // console.log(typeof item?.[1]);
    // console.log({ item });

    if (
      item?.[0] === "_uid" ||
      item?.[0] === "id" ||
      item?.[0] === "component" ||
      item?.[0] === "_editable"
    )
      return;

    if (item?.[1] && item?.[1]?.type && item?.[1]?.type === "doc") {
      let itemArray: any = [];
      item?.[1]?.content?.map((contentItem, i) => {
        return contentItem?.content?.map((contentItem: any) => {
          itemArray.push({
            markDefs: [],
            children: [
              {
                text: contentItem.text,
                marks: [],
                _type: "span",
              },
            ],
            _type: "block",
            style: "normal",
          });
        });
      });
      const content = {
        en: itemArray,
      };

      newComponent[item?.[0]] = content;
    }
    if (typeof item?.[1] === "string") {
      const content = {
        en: item?.[1],
      };
      newComponent[item?.[0]] = content;
    }
    // if (Array.isArray(item?.[1] && item?.[1])) {
    //   storyBlokFormatTransform(item);
    // }
    if (item?.[1] && item?.[1]?.filename) {
      const content = {
        // en: item?.[1],
      };
      newComponent[item?.[0]] = content;
    }
  });

  // console.log({ newComponent });
  return newComponent;
}

// Function to transform Storyblok data to Sanity format
function transformStoryblokToSanity(storyblokData: StoryblokStory): any {
  // console.log(storyblokData);
  const contentBlocks = storyblokData?.story?.content?.body
    .map((component) => {
      // console.log({ component });

      switch (component.component) {
        case "Hero": {
          const heroComponent: SanityHeroComponent = {
            _type: "heroComponent",
            _key: component._uid,
            title: { en: component.title },
            subtitle: { en: component.subtitle },
            backgroundImage: undefined,
            // component.media
            // ? {
            //     asset: {
            //       _type: "image",
            //       _ref: component.media.filename, // Adjust this if you have a different way to reference images
            //     },
            //   }
            // : undefined,
            primaryCta:
              component?.buttons && component?.buttons?.length > 0
                ? {
                    text: { en: component.buttons[0].title },
                    link: "",
                  }
                : undefined,
          };
          return heroComponent;
        }
        // Handle other component types here
        default: {
          const componentName =
            component.component.charAt(0).toLowerCase() +
            component.component.slice(1);

          let newComponent: any = {
            _type: componentName,
            ...storyBlokFormatTransform(component),
          };

          return newComponent;
        }
      }
    })
    .filter((block): block is SanityHeroComponent => block !== null); // Remove any null values

  return {
    _type: "page",
    title: storyblokData?.story?.name,
    slug: {
      current: storyblokData?.story?.full_slug,
      _type: "slug",
    },
    contentBlocks,
  };
}

// Main function to execute the transformation and schema update
export default async function transformFiles() {
  // Define paths
  const storyblokDir = path.resolve(process.cwd(), "storyblokData");
  const sanityDir = path.resolve(process.cwd(), "sanityData");
  const schemaFilePath = path.resolve(
    process.cwd(),
    "sanity/schemas/contentblocks.ts"
  );

  // Ensure directories exist
  if (!fs.existsSync(storyblokDir)) {
    console.error(`Source directory "${storyblokDir}" does not exist.`);
    return NextResponse.json(
      { error: `Source directory "${storyblokDir}" does not exist.` },
      { status: 500 }
    );
  }

  if (!fs.existsSync(sanityDir)) {
    fs.mkdirSync(sanityDir, { recursive: true });
  }

  // Ensure schema file exists
  if (!fs.existsSync(schemaFilePath)) {
    console.error(`Schema file "${schemaFilePath}" does not exist.`);
    return NextResponse.json(
      { error: `Schema file "${schemaFilePath}" does not exist.` },
      { status: 500 }
    );
  }

  try {
    // Transform files and update schema
    const result = transformAndUpdateSchemas(
      storyblokDir,
      sanityDir,
      schemaFilePath
    );

    return NextResponse.json({
      success: true,
      message: `Transform successful. Processed ${result.transformedFiles} files. Added ${result.addedComponents.length} new component types.`,
      addedComponents: result.addedComponents,
    });
  } catch (error) {
    console.error("Error during transformation:", error);
    return NextResponse.json(
      { error: `An error occurred during transformation: ${error}` },
      { status: 500 }
    );
  }
}

// const transformFiles = () => {
//   // Read all files in the storyblokData directory
//   const files = fs.readdirSync(storyblokDir);

//   // Filter for JSON files
//   const jsonFiles = files.filter(
//     (file) => path.extname(file).toLowerCase() === ".json"
//   );
//   console.log(`Transforming`);
//   console.log(jsonFiles);

//   jsonFiles.forEach((file) => {
//     const filePath = path.join(storyblokDir, file);
//     const outputFilePath = path.join(sanityDir, file);

//     try {
//       // Read and parse each JSON file
//       const data = fs.readFileSync(filePath, "utf8");
//       const storyblokData = JSON.parse(data);
//       const sanityData = transformStoryblokToSanity(storyblokData);
//       const sanityJson = JSON.stringify(sanityData, null, 2);

//       // Write the transformed data to the sanityData directory
//       fs.writeFileSync(outputFilePath, sanityJson, "utf8");
//       console.log(`Successfully processed and saved ${file}`);
//     } catch (err) {
//       console.error(`Error processing file ${file}:`, err);
//     }
//   });

//   console.log(`Done!`);

//   return new Response(
//     `Transform Successful:
//     ${jsonFiles.flatMap((file) => file.replace(".json", ""))?.join(`, `)}
//     `,
//     {
//       status: 200,
//       headers: { "Content-Type": "application/json" },
//     }
//   );
// };

// export default transformFiles;
