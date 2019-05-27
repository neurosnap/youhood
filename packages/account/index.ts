import robodux from 'robodux';
import { takeEvery, call, put } from 'redux-saga/effects';

import apiFetch from '@youhood/fetch';
import { ApiKeysState, WebState, ApiKey } from '@youhood/types';
import { creator } from '@youhood/shared';

const slice = 'apiKeys';
const apiKeys = robodux({
  initialState: [],
  actions: {
    setApiKeys: (state: ApiKeysState, payload: ApiKeysState) => payload,
    resetApiKeys: () => [],
  },
  slice,
});

const reducers = {
  [slice]: apiKeys.reducer,
};

const getApiKeys = (state: WebState) => state[slice];
const selectors = {
  getApiKeys,
};

const actions = {
  ...apiKeys.actions,
  fetchApiKeys: creator('FETCH_API_KEYS'),
};

interface FetchResponse {
  api_key: string;
  created_at: string;
  id: string;
  is_valid: boolean;
  label: string;
}

function transformApiKey(r: FetchResponse): ApiKey {
  return {
    apiKey: r.api_key,
    createdAt: r.created_at,
    id: r.id,
    isValid: r.is_valid,
    label: r.label,
  };
}

function* onFetchApiKeys() {
  const resp = yield call(apiFetch, '/api-keys');
  if (resp.status < 200 || resp.status >= 300) {
    return;
  }

  const body: { apiKeys: FetchResponse[] } = resp.body;
  const apiKeys = body.apiKeys.map(transformApiKey);
  yield put(actions.setApiKeys(apiKeys));
}

function* fetchApiKeysSaga() {
  yield takeEvery(`${actions.fetchApiKeys}`, onFetchApiKeys);
}

const sagas = {
  fetchApiKeysSaga,
};

export { reducers, actions, slice, selectors, sagas };
