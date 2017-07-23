/* @flow */
export type State = {
  selected: ?Polygon,
  polygons: Polygons,
};

export type HoodId = string;
export type HoodIds = Array<HoodId>;

export type PolygonOptions = {
  attribution: ?string,
  color: string,
  dashArray: ?string,
  dashOffset: ?string,
  fill: boolean,
  fillColor: ?string,
  fillOpacity: number,
  fillRule: string,
  interactive: boolean,
  lineCap: string,
  lineJoin: string,
  noClip: boolean,
  nonBubblingEvents: Array<Object>,
  opacity: number,
  pane: string,
  smoothFactor: number,
  stroke: boolean,
  weight: number,
};

export type Polygon = {
  feature: GeoJson,
  options: PolygonOptions,
  _leaflet_id: number,
  setStyle: Function,
  bringToFront: Function,
};

export type Polygons = Array<Polygon>;

export type HoodUser = {
  id: string,
  name: string,
};

export type HoodProperties = {
  id: HoodId,
  name: string,
  state: string,
  county: string,
  city: string,
  regionid?: string,
  user: HoodUser,
};

export type GeoJson = {
  geometry: {
    coordinates: Array<*>,
  },
  properties: HoodProperties,
  type: string,
};

export type InputEvent = Event & {target: HTMLInputElement};
