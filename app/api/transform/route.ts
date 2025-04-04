import importToSanity from "@lib/importToSanity";
import transformFiles from "@lib/transformStoryblokToSanity";
import fetchAllStoryblokPages from "@lib/fetchAllStoryblokPages";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  // fetch all the pages from Storyblok
  await fetchAllStoryblokPages();

  // TODO:
  // fetch all language options.

  // transform the files from Storyblok to Sanity
  const data = await transformFiles();

  //import the transformed files in Sanity
  await importToSanity();

  return data;
}
