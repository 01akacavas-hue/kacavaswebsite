import { ImageResponse } from "next/og"

export const ogSize = { width: 1200, height: 630 }
export const ogContentType = "image/png"

export function OgImage({
  eyebrow = "Kacavas",
  title = "Nicholas, Elias, and Alexander",
  footer = "Actor, captain, and GTM lead",
  accent = "#1a1714",
}: {
  eyebrow?: string
  title?: string
  footer?: string
  accent?: string
} = {}) {
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
          <div style={{ width: accent === "#1f6b3a" ? 120 : 84, height: 8, background: "#1f6b3a" }} />
          <div style={{ width: accent === "#9b2c2c" ? 120 : 84, height: 8, background: "#9b2c2c" }} />
          <div style={{ width: accent === "#1e4e89" ? 120 : 84, height: 8, background: "#1e4e89" }} />
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 28, letterSpacing: 8, color: accent }}>{eyebrow.toUpperCase()}</div>
          <div style={{ marginTop: 16, fontSize: 76, lineHeight: 1, maxWidth: 980 }}>{title}</div>
        </div>
        <div style={{ display: "flex", fontSize: 26, color: "#3f3a34" }}>{footer}</div>
      </div>
    ),
    ogSize,
  )
}
