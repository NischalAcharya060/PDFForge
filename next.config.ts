import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    resolveAlias: {
      // Force the CommonJS build of the encryption fork. Its ESM build
      // breaks under Node ESM ("pako.deflate is not a function").
      "pdf-lib-with-encrypt": "./node_modules/pdf-lib-with-encrypt/cjs/index.js",
    },
  },
};

export default nextConfig;