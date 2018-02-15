import { UserId } from '@youhood/user/types';

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
