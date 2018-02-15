export type HoodGeoJSON = L.GeoJSON;

export interface HoodMap {
  map: L.Map;
  hoodGeoJSON: HoodGeoJSON;
  drawControl: L.Control;
}