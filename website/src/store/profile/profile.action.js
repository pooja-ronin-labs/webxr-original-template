import {profileActionTypes} from './profile.actionTypes';

export const saveAvatar = (payload) => ({
  type: profileActionTypes.SAVE_AVATAR,
  payload
})