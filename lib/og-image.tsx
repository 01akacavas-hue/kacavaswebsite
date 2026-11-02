import { ImageResponse } from "next/og"

export const ogSize = { width: 1200, height: 630 }
export const ogContentType = "image/png"

export function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#f7f3ec",
          color: "#1a1714",
          padding: "72px",
        }}
      >
        <div style={{ display: "flex", gap: "14px" }}>
          <div style={{ width: 84, height: 8, background: "#1f6b3a" }} />
          <div style={{ width: 84, height: 8, background: "#9b2c2c" }} />
          <div style={{ width: 84, height: 8, background: "#1e4e89" }} />
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 96, letterSpacing: 10, lineHeight: 1 }}>KACAVAS</div>
          <div style={{ marginTop: 18, fontSize: 34, color: "#3f3a34" }}>Eli · Niko · Alec</div>
        </div>
        <div style={{ display: "flex", fontSize: 22, letterSpacing: 6, color: "#3f3a34" }}>
          ACTOR · CAPTAIN · GTM LEAD
        </div>
      </div>
    ),
    ogSize,
  )
}
