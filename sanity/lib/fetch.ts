import type { ClientPerspective, QueryParams } from "next-sanity";
import { draftMode } from "next/headers";

import { client, rawClient } from "@/sanity/lib/client";
import { token } from "@/sanity/lib/token";

/**
 * Used to fetch data in Server Components, it has built in support for handling Draft Mode and perspectives.
 * When using the "published" perspective then time-based revalidation is used, set to match the time-to-live on Sanity's API CDN (60 seconds)
 * and will also fetch from the CDN.
 * When using the "drafts" perspective then the data is fetched from the live API and isn't cached, it will also fetch draft content that isn't published yet.
 */
export async function sanityFetch<const QueryString extends string>({
  query,
  params = {},
  perspective: _perspective,
  /**
   * Stega embedded Content Source Maps are used by Visual Editing by both the Sanity Presentation Tool and Vercel Visual Editing.
   * The Sanity Presentation Tool will enable Draft Mode when loading up the live preview, and we use it as a signal for when to embed source maps.
   * When outside of the Sanity Studio we also support the Vercel Toolbar Visual Editing feature, which is only enabled in production when it's a Vercel Preview Deployment.
   */
  stega: _stega,
}: {
  query: QueryString;
  params?: QueryParams | Promise<QueryParams>;
  perspective?: Omit<ClientPerspective, "raw">;
  stega?: boolean;
}) {
  const perspective = (await draftMode()).isEnabled
    ? _perspective
      ? _perspective
      : "drafts"
    : "published";
  const stega =
    _stega || perspective === "drafts" || process.env.VERCEL_ENV === "preview";
  if (perspective !== "published") {
    return client.fetch(query, await params, {
      stega,
      perspective: perspective as ClientPerspective,
      // The token is required to fetch draft content
      token,
      // The `drafts` perspective isn't available on the API CDN
      useCdn: false,
      // And we can't cache the responses as it would slow down the live preview experience
      next: { revalidate: 0 },
    });
  }

  return client.fetch(query, await params, {
    stega,
    perspective: "published",
    // The `published` perspective is available on the API CDN
    useCdn: true,
    // Only enable Stega in production if it's a Vercel Preview Deployment, as the Vercel Toolbar supports Visual Editing
    // When using the `published` perspective we use time-based revalidation to match the time-to-live on Sanity's API CDN (60 seconds)
    next: { revalidate: 60 },
  });
}

export async function fetchActiveReleaseDocuments() {
  // Fetch active releases
  const activeReleasesQuery = `[releases::all()[state == 'active']]
`;
  const activeReleases = await rawClient.fetch(activeReleasesQuery);

  // console.log("FETCHING ACTIVE RELEASES", activeReleases);
  if (activeReleases.length === 0) {
    console.log("No active releases found.");
    return [];
  }

  const releaseId = activeReleases[0]._id; // Assuming the first active release

  // Fetch documents associated with the active release
  const documentsInReleaseQuery = `
    *[sanity::partOfRelease($releaseId)]
  `;
  const params = { releaseId };
  const documents = await rawClient.fetch(documentsInReleaseQuery, params);

  return documents;
}
