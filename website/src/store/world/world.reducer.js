import {worldActions} from './world.actionType';

const PVTROOM_STATE = {
  isInPvtRoom: false,
  pvtRoomLink: '',
  pvtRoomUsers: [],
  pvtRoomChat: [],
  pvtRoomId: '',
  pvtMenuFlag: false,
  pvtMsgCount: 0,
  pvtSound: true,
}
const INIT_STATE = {
  ...PVTROOM_STATE,
  socketId: '',
  socketStatus: false,
  storeActive: false
}


const WorldReducer = (state = INIT_STATE, {type, payload}) => {
  switch (type) {
    case worldActions.SET_PVTROOM_STATUS :
      return {
        ...state,
        isInPvtRoom: payload
      }
    case worldActions.SET_PVTROOM_LINK : 
      return {
        ...state,
        pvtRoomLink: payload
      }
    case worldActions.UPDATE_PVTROOM_USERS :

      return {
        ...state,
        pvtRoomUsers: [...state.pvtRoomUsers, ...(state.pvtRoomUsers.find((user) => user.userId === payload.userId)? []: [payload])]
      }
    case worldActions.REMOVE_PVTROOM_USERS :
      return {
        ...state,
        pvtRoomUsers: [...state.pvtRoomUsers.filter((user) => payload.userId !== user.userId)]
      }
    case worldActions.UPDATE_PVTROOM_CHAT :
      return {
        ...state,
        pvtRoomChat: [...state.pvtRoomChat, payload],
        pvtMsgCount: !state.pvtMenuFlag ? state.pvtMsgCount+1: 0,
      }
    case worldActions.SAVE_PVTROOM_ID :
      return {
        ...state,
        pvtRoomId: payload,
      }
    case worldActions.PVT_MENU_ON: 
      return {
        ...state,
        pvtMsgCount: 0,
        pvtMenuFlag: true,
      }
    case worldActions.PVT_MENU_OFF: 
      return {
        ...state,
        pvtMenuFlag: false,
      }
    case worldActions.EXIT_PVTROOM : 
      return {
        ...state,
        ...PVTROOM_STATE
      }
    case worldActions.SET_SOCKET : 
      return {
        ...state,
        socketId: payload
      }
    case 'SOUND_TOGGLE': 
      return {
        ...state,
        pvtSound: !state.pvtSound
      }
    case 'STORE_LIVE':
      return {
        ...state,
        storeActive: true
      }
    case 'SOCKET_STATUS': 
      return {
        ...state,
        socketStatus: payload.flag
      }
    default: 
      return state
  }
}

export default WorldReducer;