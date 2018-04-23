import { call, put } from 'redux-saga/effects';
import * as expectGen from 'expect-gen';

import apiFetch from '@youhood/fetch';
import { actionTypes } from '@youhood/hood';
const { AFTER_SAVE_HOOD } = actionTypes;
import { actionTypes as voteActionTypes } from '@youhood/vote';
const { VOTE } = voteActionTypes;

import { resetPoints, addPoints } from '../action-creators';

import { onFetchPointsByUser } from './fetch';

describe('onFetchPointsByUser', () => {
  it('should run tasks', () => {
    const userId = '123';
    const points = [
      { value: 1, reason: VOTE, hoodId: '1' },
      { value: 10, reason: AFTER_SAVE_HOOD, hoodId: '2' },
    ];
    const bodyPoints = [
      { neighborhood_id: '1', reason: VOTE },
      { neighborhood_id: '2', reason: AFTER_SAVE_HOOD },
    ];

    expectGen(onFetchPointsByUser, { payload: userId })
      .yields(
        call(apiFetch, `/point/${userId}`),
        { status: 200, body: { points: bodyPoints } },
      )
      .yields(put(resetPoints()))
      .yields(put(addPoints(points)))
      .finishes()
      .run();
  });
});
