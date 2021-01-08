import {authActionTypes} from './auth.actionType';

export const loginStart = (payload) => ({
  type: authActionTypes.LOGIN_INIT,
  payload
});
