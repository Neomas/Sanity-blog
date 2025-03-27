import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    SC_DISABLE_SPEEDY: "false",
  },

  async rewrites() {
    const defaultLocale = "en";

    return {
      beforeFiles: [],
      afterFiles: [
        {
          source: "/:path((?!nl|en|fr|api|studio).*)*",
          destination: `/${defaultLocale}/:path*`,
        },
      ],
    };
  },

  experimental: {
    turbo: {
      rules: {
        "*.glsl": {
          loaders: ["glsl-shader-loader"],
          as: "*.js",
        },
      },
    },
  },
};

export default nextConfig;
