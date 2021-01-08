import {worldActions} from './world.actionType';
export const setPvtroomStatus = (bool) => ({
  type: worldActions.SET_PVTROOM_STATUS,
  payload: bool
});
export const setPvtroomLink = (link) => ({
  type: worldActions.SET_PVTROOM_LINK,
  payload: link
});
export const updatePvtroomUsers = (user) => ({
  type: worldActions.UPDATE_PVTROOM_USERS,
  payload: user
});
export const removePvtroomUsers = (user) => ({
  type: worldActions.REMOVE_PVTROOM_USERS,
  payload: user
})
export const updatePvtroomChat = (chatObj) => ({
  type: worldActions.UPDATE_PVTROOM_CHAT,
  payload: chatObj
});
export const savePvtroomId = (id) => ({
  type: worldActions.SAVE_PVTROOM_ID,
  payload: id
});
export const exitPvtroom = () => ({
  type: worldActions.EXIT_PVTROOM
});
export const setSocketObj = (id) => ({
  type: worldActions.SET_SOCKET,
  payload: id
});
export const openPvtMenu = () => ({
  type: worldActions.PVT_MENU_ON
})
export const closePvtMenu = () => ({
  type: worldActions.PVT_MENU_OFF
})