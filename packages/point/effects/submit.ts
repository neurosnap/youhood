import { call } from 'redux-saga/effects';

import apiFetch from '@youhood/fetch';
import { HoodId } from '@youhood/hood/types';

interface SubmitPoints {
  userId: string;
  hoodId: HoodId;
  reason: string;
}

export function* submitPoints({ userId, hoodId, reason }: SubmitPoints) {
  const result = yield call(apiFetch, `/point/${userId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      hoodId,
      reason,
    }),
  });

  console.log(result.body);
}
