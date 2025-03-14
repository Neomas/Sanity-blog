import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    // Matches the behavior of `sanity dev` which sets styled-components to use the fastest way of inserting CSS rules in both dev and production. It's default behavior is to disable it in dev mode.
    SC_DISABLE_SPEEDY: "false",
  },

  async rewrites() {
    const defaultLocale = "en";

    return {
      beforeFiles: [],
      // Handling locale prefixes
      afterFiles: [
        {
          source: "/:path((?!nl|en|fr|api).*)*",
          // missing: [
          //   { type: "header", key: "next-router-prefetch" },
          //   { type: "header", key: "purpose", value: "prefetch" },
          // ],
          destination: `/${defaultLocale}/:path*`,
        },
      ],
    };
  },
};

export default nextConfig;
