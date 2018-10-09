import { select, take, call, spawn, put } from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';
import * as debug from 'debug';

import { HoodGeoJSON } from '@youhood/map/types';

const log = debug('hood:effects');

import { getHoodPropsById, getHoodIdSelected } from '../selectors';
import { getHoodId, bindTooltip } from '../utils';
import { PolygonLeaflet, HoodId } from '../types';
import styleFn from '../style';
import { hoverHood } from '../actions';

const HOOD_MOUSE_OVER = 'mouseover';
const HOOD_MOUSE_OUT = 'mouseout';

export const LAYER_ADD = 'layeradd';

/* interface LayerEvent {
  type: string;
  payload: L.LeafletEvent;
} */

export const createLayerChannel = (layerGroup: HoodGeoJSON) =>
  eventChannel((emit: any) => {
    const onLayerAdd = (layer: L.LeafletEvent) => {
      emit({ type: LAYER_ADD, payload: layer });
    };

    layerGroup.on('layeradd', onLayerAdd);

    return () => {
      layerGroup.off('layeradd', onLayerAdd);
    };
  });

export function* onLayerEvent(event: any) {
  const { type, payload } = event;
  const layer = payload;

  switch (type) {
    case LAYER_ADD: {
      console.log('LAYER ADDED: ', layer);
      yield spawn(prepareHoods, [layer.layer]);
    }

    default:
      break;
  }
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
        yield put(hoverHood({ hoodId, hover: true }));
        break;
      case HOOD_MOUSE_OUT:
        yield put(hoverHood({ hoodId, hover: false }));
        break;
      default:
        break;
    }
  }
}

const createHoodChannel = (hood: PolygonLeaflet, name: string = '') =>
  eventChannel((emit) => {
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
