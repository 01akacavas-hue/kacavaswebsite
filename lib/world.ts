import { feature } from "topojson-client"
import type { FeatureCollection, GeoJsonProperties, Geometry } from "geojson"
import type { GeometryCollection, Topology } from "topojson-specification"
import rawWorld from "../public/maps/countries-110m.json"

type WorldTopology = Topology<{
  countries: GeometryCollection<GeoJsonProperties>
}>

const topology = rawWorld as unknown as WorldTopology

export const countries = feature(
  topology,
  topology.objects.countries,
) as FeatureCollection<Geometry, GeoJsonProperties>

export const MAP_WIDTH = 800
export const MAP_HEIGHT = 460
