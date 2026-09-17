import { ImageResponse } from "next/og";

import { siteConfig } from "@/config/site";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export const alt = `${siteConfig.name} — ${siteConfig.tagline}. Free, private, in-browser PDF tools.`;

export default function TwitterImage() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          background: "linear-gradient(135deg, #0f172a 0%, #1e293b 55%, #334155 100%)",
          color: "#f8fafc",
          fontFamily: "sans-serif",
          padding: 64,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 16,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 88,
              height: 88,
              borderRadius: 24,
              background: "#7c3aed",
              fontSize: 48,
              fontWeight: 800,
              color: "#ffffff",
            }}
          >
            F
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 64, fontWeight: 800, lineHeight: 1.1 }}>
              {siteConfig.name}
            </div>
            <div style={{ fontSize: 30, color: "#c4b5fd", fontWeight: 600 }}>
              {siteConfig.tagline}
            </div>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            textAlign: "center",
            maxWidth: 860,
            fontSize: 34,
            lineHeight: 1.4,
            color: "#e2e8f0",
            marginTop: 32,
          }}
        >
          Free, unlimited PDF tools that run entirely in your browser. No uploads, no
          accounts, no watermarks.
        </div>
      </div>
    ),
    { ...size },
  );
}