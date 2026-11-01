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
          background: "#090908",
          color: "#f3efe6",
          padding: "72px",
        }}
      >
        <div style={{ display: "flex", gap: "14px" }}>
          <div style={{ width: 84, height: 8, background: "#e0b15c" }} />
          <div style={{ width: 84, height: 8, background: "#a3b896" }} />
          <div style={{ width: 84, height: 8, background: "#e07a52" }} />
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 96, letterSpacing: 10, lineHeight: 1 }}>KACAVAS</div>
          <div style={{ marginTop: 18, fontSize: 34, color: "#c8c1b4" }}>Eli · Niko · Alec</div>
        </div>
        <div style={{ display: "flex", fontSize: 22, letterSpacing: 6, color: "#c8c1b4" }}>
          ACTOR · CAPTAIN · OPERATOR
        </div>
      </div>
    ),
    ogSize,
  )
}
