
const INIT_STATE = {
  currentRoute: '/',
  pageLoading: true,
  popupInit: false,
  popupContent: '',
  popupFunc: undefined,
  popupReload: false,
  notifyMe: false,
  pageSection: 'loader',
  puzzleSection: 'registration', // registration || welcome || puzzle
  puzzleState: undefined,
}

const AppReducer = (state = INIT_STATE, {type, payload}) => {
  switch(type) {
    case 'ROUTE_CHANGE':
    return {
      ...state,
      currentRoute: payload.route,
      pageLoading: true
    }
    case 'LOADING_START': {
      return {
        ...state,
        pageLoading: true
      }
    } 
    case 'LOADING_COMPLETE':
      return {
        ...state,
        pageLoading: false
      }
    case 'SHOW_POPUP': 
      return {
        ...state,
        popupInit: true,
        popupContent: payload.content,
        popupReload: payload.reload ? payload.reload : false 
      }
    case 'CLOSE_POPUP':
      return {
        ...state,
        popupInit: false,
        popupContent: '',
        popupReload: false
      }
    case 'NOTIFY_ME_DONE':
      return {
        ...state,
        notifyMe: true,
      }
    case 'CHANGE_PAGE':
      return {
        ...state,
        pageSection: payload.pageSection
      }
    case 'CHANGE_PUZZLESECTION':
      return {
        ...state,
        puzzleSection: payload.puzzleSection
      }
    case 'SAVE_PUZZLESTATE':
      return {
        ...state,
        puzzleState: payload.puzzleState
      }
    default:
      return state
  }
}

export default AppReducer