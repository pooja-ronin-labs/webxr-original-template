import React from 'react';
import ReactDOM from 'react-dom';
import {Router} from 'react-router';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import  history from './history';
import App from './App';
import store, {persistor} from './store/store';
import './index.css';
import './assets/style/main.scss';

if (process.env.REACT_APP_HIDE_LOGS === 'true') {
  console.log = function () {};
}
ReactDOM.render(
  <React.StrictMode>
    <Router history={history}>
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          <App />
        </PersistGate>
      </Provider>
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.unregister();
