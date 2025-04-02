import createImageUrlBuilder from "@sanity/image-url";

import { dataset, projectId } from "@/sanity/lib/api";

const imageBuilder = createImageUrlBuilder({
  projectId: projectId || "",
  dataset: dataset || "",
});

export const urlForImage = (source: any, width?: number, height?: number) => {
  // Ensure that source image contains a valid reference
  if (!source?.asset?._ref) {
    return undefined;
  }
  width = width || 120;
  height = height || 1000;
  // console.log({ source });

  const url = !source.hotpots
    ? imageBuilder?.image(source).auto("format").fit("max")
    : imageBuilder
        ?.image(source)
        .auto("format")
        .fit("max")
        .crop("center")
        .focalPoint(source.hotspot.x, source.hotspot.y)
        .width(source.hotspot?.height)
        .height(source.hotspot?.height);

  return url;
};

export function resolveOpenGraphImage(image: any, width = 1200, height = 627) {
  if (!image) return;
  const url = urlForImage(image)?.width(1200).height(627).fit("crop").url();
  if (!url) return;
  return { url, alt: image?.alt as string, width, height };
}

export function resolveHref(
  documentType?: string,
  slug?: string
): string | undefined {
  switch (documentType) {
    case "post":
      return slug ? `/posts/${slug}` : undefined;
    default:
      console.warn("Invalid document type:", documentType);
      return undefined;
  }
}
export const getLocalizedValue = (field: any, language = "en") => {
  if (!field) return "";
  return field[language] || field.en || ""; // Fallback to English if requested language is missing
};

// Define the supported languages
export const supportedLanguages = [
  { id: "en", title: "English" },
  { id: "fr", title: "French" },
  { id: "nl", title: "Nederlands" },
  // Add more languages as needed
];

/**
 * Resolves the download URL for a file stored in Sanity
 * @param file The file object from Sanity containing asset reference
 * @returns The download URL for the file or undefined if no valid file reference
 */
export function resolveFileUrl(file: any): string | undefined {
  if (!file?.asset?._ref) {
    return undefined;
  }
  
  // Extract the file ID from the asset reference
  // Format is typically: file-{fileId}-{extension}
  const fileId = file.asset._ref.split('-').slice(1, -1).join('-');
  const extension = file.asset._ref.split('-').pop();
  
  // Construct the Sanity CDN URL for file download
  const fileUrl = `https://cdn.sanity.io/files/${projectId}/${dataset}/${fileId}.${extension}`;
  
  return fileUrl;
}