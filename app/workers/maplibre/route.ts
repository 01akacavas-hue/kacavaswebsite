import { readFile } from "node:fs/promises"
import { join } from "node:path"

/** Same-origin MapLibre worker. The bundled copy looks for this file beside a chunk that does not exist. */
export async function GET() {
  const body = await readFile(join(process.cwd(), "node_modules/maplibre-gl/dist/maplibre-gl-worker.mjs"))
  return new Response(body, {
    headers: {
      "content-type": "text/javascript; charset=utf-8",
      "cache-control": "public, max-age=31536000, immutable",
    },
  })
}
