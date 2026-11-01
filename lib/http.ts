export function isSameOrigin(request: Request): boolean {
  const origin = request.headers.get("origin")
  if (!origin) return true
  const host = request.headers.get("host")
  if (!host) return false
  try {
    return new URL(origin).host === host
  } catch {
    return false
  }
}

export async function readJson(request: Request): Promise<unknown> {
  const type = request.headers.get("content-type") ?? ""
  if (!type.toLowerCase().includes("application/json")) return null
  try {
    return await request.json()
  } catch {
    return null
  }
}

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}
