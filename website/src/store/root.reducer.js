import {combineReducers} from 'redux';

import authReducer from './auth/auth.reducer';
import profileReducer from './profile/profile.reducer';
import appReducer from './app/app.reducer';
import WorldReducer from './world/world.reducer';

const RootReducer = combineReducers({
  auth: authReducer,
  profile: profileReducer,
  app: appReducer,
  world: WorldReducer
});

export default RootReducer;