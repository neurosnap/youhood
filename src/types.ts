import WebSocket from 'ws';

export type HoodId = string;
export type HoodIds = HoodId[];
export type HoodHash = { [key: string]: Hood };

export interface Menus {
  overlay: boolean;
}

export type UserId = string;
export interface User {
  id: UserId;
  email: string;
  createdAt?: string;
  isTmp?: boolean;
}
export type Users = User[];
export interface UserHash {
  [key: string]: User;
}
export interface RawUser {
  id: UserId;
  email: string;
  created_at: string;
  is_tmp: boolean;
}

export interface HoodProperties {
  id: HoodId;
  userId: UserId;
  name: string;
  state: string;
  county: string;
  city: string;
  regionid?: string;
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
  drawControl: L.Control;
}

export interface Point {
  value: number;
  reason: string;
}
export type Points = Point[];

export type Token = string;
export type AuthError = string;
export type VoteList = UserId[];
export interface Votes {
  [key: string]: UserId[];
}

export interface State {
  selected: HoodId;
  hoods: HoodHash;
  menus: Menus;
  hoodsOnPoint: HoodIds;
  points: Points;
  currentUser: UserId;
  users: UserHash;
  token: Token;
  authError: AuthError;
  votes: Votes;
}
