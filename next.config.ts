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
        "*.svg": {
          loaders: ["@svgr/webpack"],
          as: "*.js",
        },
      },
    },
  },

  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback, // if you miss it, all the other options in fallback, specified
      // by next.js will be dropped. Doesn't make much sense, but how it is
      fs: false,
    };

    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });

    return config;
  },
  
};

export default nextConfig;
