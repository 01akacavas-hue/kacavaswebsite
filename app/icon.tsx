import { ImageResponse } from "next/og"

export const size = { width: 32, height: 32 }
export const contentType = "image/png"

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#090908",
          color: "#f3efe6",
          fontSize: 18,
        }}
      >
        K
      </div>
    ),
    size,
  )
}
