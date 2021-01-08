import {createStore, applyMiddleware, compose} from 'redux';
import createSagaMiddleware from 'redux-saga';
import {persistStore} from 'redux-persist';
import RootReducer from './root.reducer';
import HTTPService from '../service/http.service';
import authService from '../service/auth.service';
import history from '../history';
// import storage from 'redux-persist/lib/storage';

const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const middleware = [];
const store = createStore(
  RootReducer,
  composeEnhancer(applyMiddleware(...middleware))
);


const getPuzzleState = async () => {
  try {
    const response = await authService.getPuzzelState();
    store.dispatch({type: 'SAVE_PUZZLESTATE', payload: {puzzleState: response}});
    store.dispatch({type: 'CHANGE_PUZZLESECTION', payload: {puzzleSection: 'welcome'}})
    store.dispatch({type: 'CHANGE_PAGE', payload: {pageSection: 'puzzle'}});
    
  }catch(e) {
    console.log(e);
  }
}
export const persistor = persistStore(store, {}, () => {
  const {auth} = store.getState();
  if(auth.authToken) {
    HTTPService.saveHeader({key: 'Authorization', value: `Bearer ${auth.authToken}`});
    getPuzzleState()
    
  } else {
    // for user who is not logged in
    store.dispatch({type: 'CHANGE_PAGE', payload: {pageSection: 'intro'}});
  }
});

export default store;