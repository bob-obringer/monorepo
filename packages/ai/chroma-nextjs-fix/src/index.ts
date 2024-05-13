import type { NextJsWebpackConfig } from "next/dist/server/config-shared";

export const nextjsWebpackConfigFix: NextJsWebpackConfig =
  function nextjsWebpackConfigFix(config, { isServer }) {
    // chromadb workaround suggests
    if (!isServer) {
      config.resolve.fallback.fs = false;
    }

    // chromadb uses native modules
    // https://stackoverflow.com/questions/78132142/cant-integrate-nextjs-with-chromadb
    config.module.rules.push({
      test: /\.node$/,
      use: "node-loader",
    });

    return config;
  };
