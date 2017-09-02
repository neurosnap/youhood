import WebSocket from 'ws';

export type HoodId = string;
export type HoodIds = HoodId[];
export type HoodHash = { [key: string]: Hood };

export interface State {
  selected: HoodId;
  hoods: HoodHash;
  menus: Menus;
  hoodsOnPoint: HoodIds;
}

export interface Menus {
  overlay: boolean;
}

export interface HoodUser {
  id: string;
  name: string;
}

export interface HoodProperties {
  id: HoodId;
  name: string;
  state: string;
  county: string;
  city: string;
  regionid?: string;
  user: HoodUser;
}

export interface Feature<T extends GeoJSON.GeometryObject> extends GeoJSON.Feature<T> {
  properties: HoodProperties;
}

export interface Polygon<T extends GeoJSON.Polygon | GeoJSON.MultiPolygon> extends L.Polygon {
  toGeoJSON(): Feature<T>;
  feature?: Feature<T>;
}

export type PolygonLeaflet = Polygon<GeoJSON.Polygon>;
export type Hood = Feature<GeoJSON.Polygon | GeoJSON.MultiPolygon>;
export type Hoods = Hood[];
export type PolygonHood = Hood | PolygonLeaflet | L.Layer;

export interface GeoJson {
  geometry: {
    coordinates: any;
  };
  properties: HoodProperties;
  type: string;
}

export interface WebSocketEvent {
  data: WebSocket.Data;
  type: string;
  target: WebSocket;
}

export type GeoJsonFeatures = GeoJSON.FeatureCollection<GeoJSON.Polygon>;

export interface WebSocketMessage {
  type: string;
  data: GeoJSON.FeatureCollection<GeoJSON.Polygon>;
}

export type HoodGeoJSON = L.GeoJSON;

export interface HoodMap {
  map: L.Map;
  hoodGeoJSON: HoodGeoJSON;
}
