import importToSanity from "@lib/importToSanity";
import transformFiles from "@lib/transformStoryblokToSanity";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const data = await transformFiles();

  //import the transformed files in Sanity
  await importToSanity();

  return data;
}
