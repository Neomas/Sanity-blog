// import { client as writeClient } from "@/sanity/lib/client"; // Adjust path to your Sanity client

// async function migrateDocuments() {
//   // Fetch all documents of the old type
//   const documents = await writeClient.fetch('*[_type == "pages"]');

//   // Batch migrate documents
//   const transaction = writeClient.transaction();

//   documents.forEach((doc) => {
//     transaction
//       .create({
//         ...doc,
//         _type: "page", // Change type
//         _id: undefined, // Let Sanity generate new ID
//       })
//       .delete(doc._id); // Remove old document
//   });

//   // Commit the transaction
//   await transaction.commit();
//   console.log(`Migrated ${documents.length} documents`);
// }

// // migrateDocuments().catch(console.error);
// export default migrateDocuments;
