import {persistReducer} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import {profileActionTypes} from './profile.actionTypes';

const INIT_STATE = {
  avatarObj: undefined,
}

const profileReducer = persistReducer(
  {storage, key: 'op8_profile', whitelist: ['avatarObj']},
  (state=INIT_STATE, {type, payload}) => {
    switch(type) {
      case profileActionTypes.SAVE_AVATAR:
        return {
          ...state,
          avatarObj: payload
        }
      default:
        return state;
    }
  }
)

export default profileReducer