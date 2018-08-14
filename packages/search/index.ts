import { takeEvery, call } from 'redux-saga/effects';
import { LatLngExpression } from 'leaflet';
import * as debug from 'debug';

import { creator } from '@youhood/shared';
import { HoodMap } from '@youhood/map/types';

import { Address, SearchAction } from './types';

const log = debug('app:search');
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY || '';

const search = creator<Address>('SEARCH');

function* onSearch(
  { map }: HoodMap,
  action: SearchAction,
  googleApiKey = GOOGLE_API_KEY,
) {
  try {
    const address = action.payload.replace(' ', '+');
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${googleApiKey}`;
    const resp = yield call(fetch, url);
    const data = yield call([resp, 'json']);

    if (data.status !== 'OK') {
      log(data);
      return;
    }

    if (data.results.length === 0) {
      log(data);
      return;
    }

    const latlng: LatLngExpression = [
      data.results[0].geometry.location.lat,
      data.results[0].geometry.location.lng,
    ];

    yield call([map, 'setView'], latlng, 13);
  } catch (err) {
    console.log(err);
  }
}

function* searchSaga(hoodMap: HoodMap) {
  yield takeEvery(`${search}`, onSearch, hoodMap);
}

const actions = { search };
const effects = { onSearch };
const sagas = { searchSaga };

export { actions, sagas, effects };
