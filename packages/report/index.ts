import { takeEvery, call } from 'redux-saga/effects';
import { createAction } from 'robodux';

import apiFetch from '@youhood/fetch';
import { HoodId } from '@youhood/hood/types';

export interface ReportHoodPayload {
  hoodId: HoodId;
  reason: string;
}

interface Action {
  type: string;
  payload: ReportHoodPayload;
}

const reportHood = createAction<ReportHoodPayload>('REPORT_HOOD');
const actions = {
  reportHood,
};

function* onReportHood(action: Action) {
  const { hoodId, reason } = action.payload;
  yield call(apiFetch, `/report/${hoodId}`, {
    method: 'POST',
    body: JSON.stringify({ reason }),
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

function* reportHoodSaga() {
  yield takeEvery(`${reportHood}`, onReportHood);
}

const sagas = {
  reportHoodSaga,
};

export { actions, sagas };
