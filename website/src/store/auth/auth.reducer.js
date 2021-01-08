import {persistReducer} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import {authActionTypes} from './auth.actionType';

const INIT_STATE = {
  authToken: undefined,
  janustoken: undefined,
  user: undefined
}

const authReducer = persistReducer(
  {storage, key: 'op8_auth', whitelist: ['authToken', 'janustoken', 'user']},
  (state = INIT_STATE, {type, payload}) => {
    console.log(payload)
    switch(type) {
      case authActionTypes.LOGIN_INIT :
        return {
          ...state,
          authToken: payload.authToken,
          user: payload.user
        }
        case 'LOGOUT': 
          return INIT_STATE
        default:
          return state
    }
  }
);

export default authReducer;