import { put, select, take, call, spawn } from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';
import debug from 'debug';

import { HoodMap } from '@youhood/map/types';

const log = debug('hood:effects');

import {
  afterSaveHood,
} from './action-creators';
import {
  getHoodPropsById,
  getHoodIdSelected,
} from './selectors';
import {
  getHoodId,
  findHood,
  bindTooltip,
} from './utils';
import { SaveHoodAction, PolygonLeaflet, HoodId } from './types';
import styleFn from './style';

const HOOD_MOUSE_OVER = 'mouseover';
const HOOD_MOUSE_OUT = 'mouseout';

export function* onSaveHood(
  { hoodGeoJSON }: HoodMap,
  action: SaveHoodAction,
) {
  const hoodId = action.payload;
  const hood = <PolygonLeaflet>findHood(hoodGeoJSON, hoodId);
  if (!hood) return;

  const props = yield select(getHoodPropsById, { id: hoodId });
  if (!props) {
    log(`Could not find props for ${hoodId}`);
    return;
  }
  const name = props.name;

  bindTooltip(hood, name);

  const hoodGeo = hood.toGeoJSON();
  hoodGeo.properties = props;

  const res = yield fetch('/hood/save', {
    method: 'POST',
    body: JSON.stringify([hoodGeo]),
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const data = yield res.json();
  yield put(afterSaveHood(data.hoods));
}

export function* prepareHoods(layers: PolygonLeaflet[]) {
  for (let i = 0; i < layers.length; i += 1) {
    const hood = <PolygonLeaflet>layers[i];
    yield spawn(startHoodEvents, hood);
  }
}

export function* startHoodEvents(hood: PolygonLeaflet, id: HoodId = '') {
  hood.setStyle(styleFn());
  const hoodId = getHoodId(hood) || id;
  const props = yield select(getHoodPropsById, { id: hoodId });
  if (!props) {
    log(`Could not find props for ${hoodId}`);
    return;
  }
  const name = props.name || '{NEW HOOD}';
  const channel = yield call(createHoodChannel, hood, name);

  while (true) {
    const event = yield take(channel);
    const { type } = event;
    const hoodIdSelected = yield select(getHoodIdSelected);
    if (hoodIdSelected === hoodId) {
      continue;
    }

    switch (type) {
      case HOOD_MOUSE_OVER:
        hood.setStyle(styleFn({ hover: true }));
        break;
      case HOOD_MOUSE_OUT:
        hood.setStyle(styleFn());
        break;
      default:
        break;
    }
  }
}

const createHoodChannel = (hood: PolygonLeaflet, name: string = '') => eventChannel((emit) => {
  const onMouseOver = () => {
    emit({ type: HOOD_MOUSE_OVER });
  };

  const onMouseOut = () => {
    emit({ type: HOOD_MOUSE_OUT });
  };

  hood.on('mouseover', onMouseOver);
  hood.on('mouseout', onMouseOut);
  bindTooltip(hood, name);

  return () => {
    hood.off(HOOD_MOUSE_OVER, onMouseOver);
    hood.off(HOOD_MOUSE_OUT, onMouseOut);
    hood.unbindTooltip();
  };
});
