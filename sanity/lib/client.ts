import { createClient } from "next-sanity";

import { apiVersion, dataset, projectId, studioUrl } from "@/sanity/lib/api";

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
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

export const rawClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  perspective: "raw",
});
