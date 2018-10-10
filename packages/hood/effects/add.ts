import { put } from 'redux-saga/effects';

import { HoodMap } from '@youhood/map/types';

import { Hood, Hoods, GeoJsonFeatures, PolygonHood, Feature } from '../types';
import { addHoods, addHoodUIProps } from '../actions';
import { getHoodId, getHoodUIPropsMapFromHoods } from '../utils';

const MIN_VOTES = 0;
const filterNegativeHoods = (hood: Hood) => hood.properties.votes >= MIN_VOTES;

interface AddHoodsAction {
  type: string;
  payload: GeoJsonFeatures;
}

export function* onAddHoodsAndProps(
  { hoodGeoJSON }: HoodMap,
  action: AddHoodsAction,
) {
  const data = action.payload;
  console.log(data);
  if (data.features.length === 0) {
    return;
  }

  const layers = <Hoods>data.features.filter(filterNegativeHoods);
  yield put(addHoods(layers));
  const hoodUIPropsMap = getHoodUIPropsMapFromHoods(layers);
  yield put(addHoodUIProps(hoodUIPropsMap));

  const features = layers.filter((feature) => {
    let foundHood = false;
    hoodGeoJSON.eachLayer((layer) => {
      if (getHoodId(layer) === getHoodId(<PolygonHood>feature)) {
        foundHood = true;
      }
    });

    return !foundHood;
  });

  data.features = features.map((feature) => {
    if (feature.geometry.type === 'MultiPolygon') {
      return transformMutiPolyToPoly(<Feature<GeoJSON.MultiPolygon>>feature);
    }

    return feature;
  });
  hoodGeoJSON.addData(data);
}

function transformMutiPolyToPoly(
  multiPolygon: Feature<GeoJSON.MultiPolygon>,
): Feature<GeoJSON.Polygon> {
  const poly = {
    ...multiPolygon,
    geometry: {
      ...multiPolygon.geometry,
      type: 'Polygon' as 'Polygon',
      coordinates: multiPolygon.geometry.coordinates[0],
    },
  };

  return poly;
}
