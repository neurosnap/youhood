import { actions, reducers, slice } from './index';

const token = reducers[slice];

describe('token reducer', () => {
  it('should return empty by default', () => {
    expect(token(undefined as any, { type: '', payload: '' })).toEqual('');
  });

  it('should set token', () => {
    expect(token('', actions.setToken('1234'))).toEqual('1234');
  });

  it('should reset token', () => {
    expect(token('1234', actions.resetToken())).toEqual('');
  });
});
