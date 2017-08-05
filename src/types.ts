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

export interface PolygonOptions {
  attribution: string;
  color: string;
  dashArray: string;
  dashOffset: string;
  fill: boolean;
  fillColor: string;
  fillOpacity: number;
  fillRule: string;
  interactive: boolean;
  lineCap: string;
  lineJoin: string;
  noClip: boolean;
  nonBubblingEvents: Object[];
  opacity: number;
  pane: string;
  smoothFactor: number;
  stroke: boolean;
  weight: number;
}

export interface Polygon {
  feature: GeoJson;
  options: PolygonOptions;
  _leaflet_id: number;
  setStyle: Function;
  bringToFront: Function;
}

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

export type InputEvent = Event & {target: HTMLInputElement};
