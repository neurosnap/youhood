import { takeEvery, call, put } from 'redux-saga/effects';
import { LatLngExpression } from 'leaflet';
import * as debug from 'debug';

import { creator } from '@youhood/shared';
import { HoodMap } from '@youhood/map/types';
import apiFetch from '@youhood/fetch';
import { actions as hoodActions } from '@youhood/hood';
const { addHoodsAndProps } = hoodActions;
import { actions as hoodWinnerActions } from '@youhood/hood-winners';
const { setHoodWinners } = hoodWinnerActions;
import { GeoJsonFeatures, HoodIds } from '@youhood/hood/types';

import { Address, SearchAction } from './types';

const log = debug('app:search');
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY || '';

const search = creator<Address>('SEARCH');

interface AddressComponent {
  long_name: string;
  short_name: string;
  types: string[];
}

const cityType = 'locality';
const stateType = 'administrative_area_level_1';

function getCityAndState(components: AddressComponent[]) {
  let city = '';
  let state = '';
  components.forEach((component) => {
    if (component.types.indexOf(cityType) >= 0) {
      city = component.short_name;
    }

    if (component.types.indexOf(stateType) >= 0) {
      state = component.short_name;
    }
  });

  return {
    city,
    state,
  };
}

interface FetchHoodsByCity {
  payload: { city: string; state: string };
}

interface FetchHoodsResp {
  hoods: GeoJsonFeatures;
  winners: HoodIds;
}

export function* onFetchHoodsByCity({
  payload: { city, state },
}: FetchHoodsByCity) {
  const resp = yield call(
    apiFetch,
    `/hood/${state.toLowerCase()}/${city.toLowerCase()}/all`,
  );

  if (resp.status < 200 || resp.status > 300) {
    return;
  }

  const body: FetchHoodsResp = resp.body;
  yield put(addHoodsAndProps(body.hoods));
  yield put(setHoodWinners(body.winners));
}

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

    const info = getCityAndState(data.results[0].address_components);
    yield call(onFetchHoodsByCity, { payload: info });

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
const effects = { onSearch, onFetchHoodsByCity };
const sagas = { searchSaga };

export { actions, sagas, effects };
