import WebSocket from 'ws';

export interface State {
  selected: Hood;
  hoods: Hoods;
  menus: Menus;
  hoodsOnPoint: HoodIds;
}

export interface Menus {
  overlay: boolean;
}

export type HoodId = string;
export type HoodIds = HoodId[];

export type Polygon = L.Polygon;

export type Polygons = Polygon[];
export type Hood = Polygon;
export type Hoods = Hood[];

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
