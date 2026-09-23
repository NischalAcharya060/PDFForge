import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    resolveAlias: {
      // Force the CommonJS build of the encryption fork. Its ESM build
      // breaks under Node ESM ("pako.deflate is not a function").
      "pdf-lib-with-encrypt": "./node_modules/pdf-lib-with-encrypt/cjs/index.js",
    },
  },
  async redirects() {
    return [
      {
        source: "/PDFForge-Setup.exe",
        destination:
          "https://github.com/NischalAcharya060/PDFForge-Viewer/releases/download/v1.0.0/PDFForge-Setup.exe",
        permanent: false,
      },
      {
        source: "/releases/1.0.0/PDFForge-Setup.exe",
        destination:
          "https://github.com/NischalAcharya060/PDFForge-Viewer/releases/download/v1.0.0/PDFForge-Setup.exe",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;