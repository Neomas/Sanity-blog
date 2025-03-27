require("dotenv").config({ path: ".env.local" });
const prependFile = require("prepend-file");
const replaceFile = require("replace-in-file");
const { exec } = require("child_process");

if (!process.env.SB_SPACE_ID) {
  console.log("SB_SPACE_ID is not set in .env.local");
  return;
}

console.log("getting storyblok components");
exec(
  `npx storyblok pull-components --space ${process.env.SB_SPACE_ID}`,
  {
    cwd: `${__dirname}/model`,
  },
  (error, stdout, stderr) => {
    if (error) {
      console.log(error);
      return;
    }
    console.log("components downloaded");
    generateTypes();
  }
);

const generateTypes = async () => {
  console.log("generating typescript types");

  // create empty file
  const file = `${__dirname}/../../src/types/components-schema.ts`;
  const fs = require("fs");
  fs.writeFileSync(file, "");

  // generate types to file

  const source = `./model/components.${process.env.SB_SPACE_ID}.json`;
  const target = `../../src/types/components-schema.ts`;
  console.warn(`npx storyblok-generate-ts source=${source} target=${target}`);

  exec(
    `npx storyblok-generate-ts source=${source} target=${target}`,
    {
      cwd: `${__dirname}`,
    },
    (error, stdout, stderr) => {
      if (error) {
        console.log(error);
        return;
      }
      console.log("types generated");
      //addRelations();
    }
  );

  // hold for storyblokToTypescript to finish
  await timeout(3000);

  // append types with relationships
  const resolve_relations = require("../../config/storyblok.config.js");
  const components = require(`./model/components.${process.env.SB_SPACE_ID}.json`);

  // make array with key component and value array of fields
  const componentsArray = [];
  resolve_relations.forEach((relation) => {
    const [component, field] = relation.split(".");
    componentsArray[component] = componentsArray[component] || [];
    componentsArray[component].push(field);
  });

  // add import line
  const importLine = `import { ISbStoryData } from "@storyblok/react"; \n\n`;
  await prependFile(file, importLine);

  // replace old type with new type
  for (let relation of Object.entries(componentsArray)) {
    const [component, fields] = relation;
    await replaceFile({
      files: file,
      from: new RegExp(`export interface ${component}Storyblok`, "g"),
      to: `export interface ${component}StoryblokWithoutRelations`,
      countMatches: true,
    });
  }

  Object.entries(componentsArray).forEach((relation) => {
    const [component, fields] = relation;

    const componentObject = components.components.find((c) => c.name === component);
    if (!componentObject) {
      console.log(`component ${component} not found`);
      return;
    }

    let output = `export type ${componentObject.name}Storyblok = ${componentObject.name}StoryblokWithoutRelations & {\n`;

    fields.forEach((field) => {
      if (!componentObject.schema[field]) {
        console.log(`component ${component} has no field ${field}`);
        return;
      }

      const relatedTypes = componentObject.schema[field].filter_content_type;
      const arrayOutput = componentObject.schema[field].type === "options" ? "[]" : "";

      if (!Array.isArray(relatedTypes)) {
        output += `  ${field}?: StoryData${arrayOutput};\n`;
      } else {
        output += `  ${field}?: StoryData<${relatedTypes.join(" | ")}Storyblok>${arrayOutput};\n`;
      }
    });

    output += "};\n\n";

    // append output to file
    fs.appendFileSync(file, output);
  });
};

// function to wait for a timeout
function timeout(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
