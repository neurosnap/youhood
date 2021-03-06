import { call, put } from 'redux-saga/effects';
import { genTester, yields } from 'gen-tester';

import apiFetch from '@youhood/fetch';
import { actions } from '@youhood/hood';
const { afterSaveHood } = actions;
import { actions as voteActions } from '@youhood/vote';
const { upvote } = voteActions;

import { resetPoints, addPoints } from '../actions';

import { onFetchPointsByUser } from './fetch';

describe('onFetchPointsByUser', () => {
  it('should run tasks', () => {
    const userId = '123';
    const points = [
      { value: 1, reason: `${upvote}`, hoodId: '1' },
      { value: 10, reason: `${afterSaveHood}`, hoodId: '2' },
    ];
    const bodyPoints = [
      { neighborhood_id: '1', reason: `${upvote}` },
      { neighborhood_id: '2', reason: `${afterSaveHood}` },
    ];

    const tester = genTester(onFetchPointsByUser, { payload: userId });
    const { actual, expected } = tester(
      yields(call(apiFetch, `/point/${userId}`), {
        status: 200,
        body: { points: bodyPoints },
      }),
      put(resetPoints()),
      put(addPoints(points)),
    );

    expect(actual).toEqual(expected);
  });
});
