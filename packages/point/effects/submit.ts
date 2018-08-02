import { call } from 'redux-saga/effects';

import apiFetch from '@youhood/fetch';
import { HoodId } from '@youhood/hood/types';
import { UserId } from '@youhood/user/types';

interface SubmitPoints {
  userId: UserId;
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
