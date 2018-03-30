import { UserId } from '@youhood/user/types';

type ActionType = string;
export type HoodId = string;
export type HoodIds = HoodId[];
export type HoodHash = { [key: string]: Hood };

export interface HoodProperties {
  id: HoodId;
  userId: UserId;
  name: string;
  state: string;
  county: string;
  city: string;
  regionid?: string;
  visible: boolean;
}

export interface HoodPropsMap {
  [key: string]: HoodProperties;
}

export interface Feature<T extends GeoJSON.GeometryObject> extends GeoJSON.Feature<T> {
  properties: HoodProperties;
}

export interface Polygon<T extends GeoJSON.Polygon | GeoJSON.MultiPolygon> extends L.Polygon {
  toGeoJSON(): Feature<T>;
  feature?: Feature<T>;
}

export type GeoJsonFeatures = GeoJSON.FeatureCollection<GeoJSON.Polygon>;

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

export interface AddHoodsAction {
  type: ActionType;
  payload: Hoods;
}

export interface HoodSelectedAction {
  type: ActionType;
  payload: HoodId;
}

export interface HopAction {
  type: ActionType;
  payload: HoodIds;
}

export interface SetHoodNamePayload {
  hoodId: HoodId;
  name: string;
}

export interface SetHoodNameAction {
  type: ActionType;
  payload: SetHoodNamePayload;
}

export interface ToggleHoodSelectedAction {
  type: ActionType;
  payload: HoodId;
}

export interface SetHoodsAction {
  type: ActionType;
  payload: Hoods;
}

export interface HoverHoodPayload {
  hoodId: HoodId;
  hover: boolean;
}

export interface HoverHoodAction {
  type: ActionType;
  payload: HoverHoodPayload;
}

export interface EditHoodPayload {
  hoodId: HoodId;
  edit: boolean;
}

export interface EditHoodAction {
  type: string;
  payload: EditHoodPayload;
}

export interface SaveHoodAction {
  type: string;
  payload: HoodId;
}

export interface AddHoodPropsMap {
  type: string;
  payload: HoodPropsMap;
}

export interface SetEdit {
  type: string;
  payload: boolean;
}
