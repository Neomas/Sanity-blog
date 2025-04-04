// import { client as writeClient } from "@/sanity/lib/client"; // Adjust path to your Sanity client
import * as fs from "fs";
import { createClient } from "next-sanity";
import * as path from "path";
import { apiVersion, dataset, projectId, studioUrl } from "@/sanity/lib/api";

export const writeClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token: process.env.SANITY_WRITE_TOKEN, // Use a write token with full permissions used to fix content in sanity

  perspective: "raw",
  stega: {
    studioUrl,
    logger: console,
    filter: (props) => {
      if (props.sourcePath.at(-1) === "title") {
        return true;
      }

      return props.filterDefault(props);
    },
  },
});

const sanityDir = path.resolve(process.cwd(), "sanityData");

async function importToSanity() {
  // Fetch all documents of the old type
  //   const documents = await writeClient.fetch('*[_type == "pages"]');
  const files = fs.readdirSync(sanityDir);

  // Batch migrate documents
  const transaction = writeClient.transaction();

  const jsonFiles = files.filter(
    (file) => path.extname(file).toLowerCase() === ".json"
  );

  jsonFiles.forEach((doc) => {
    const filePath = path.join(sanityDir, doc);
    const outputFilePath = path.join(sanityDir, doc);

    try {
      // Read and parse each JSON file
      const data = fs.readFileSync(filePath, "utf8");
      const sanityData = JSON.parse(data);

      console.log({ sanityData });
      transaction.create({
        ...sanityData,
        _id: undefined,
      });
    } catch (err) {
      console.error(`Error processing file ${doc}:`, err);
    }
  });

  // Commit the transaction
  await transaction.commit();
  console.log(`Imported ${jsonFiles.length} pages`);
}

// migrateDocuments().catch(console.error);
export default importToSanity;
