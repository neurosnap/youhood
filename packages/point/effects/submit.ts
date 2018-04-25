import { call } from 'redux-saga/effects';

import { HoodId } from '@youhood/hood/types';
import { UserId } from '@youhood/user/types';

interface SubmitPoints {
  userId: UserId;
  hoodId: HoodId;
  reason: string;
}

export function* submitPoints({ userId, hoodId, reason }: SubmitPoints) {
  const result = yield call(fetch, `/point/${userId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      hoodId,
      reason,
    }),
  });

  const body = yield result.json();
  console.log(body);
}
