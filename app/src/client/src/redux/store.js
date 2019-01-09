import {createStore, applyMiddleware, compose} from 'redux';
import createSagaMiddleware from 'redux-saga';
import {persistStore, persistReducer} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import rootReducer from './reducers/rootReducer';

const initialState = {};
const enhancers = [];
const sagaMiddleware = createSagaMiddleware();

if (process.env.NODE_ENV === 'development') {
  const devToolsExtension = window.__REDUX_DEVTOOLS_EXTENSION__;

  if (typeof devToolsExtension === 'function') {
    enhancers.push(devToolsExtension());
  }
}

const composedEnhancers = compose(
  applyMiddleware(sagaMiddleware),
  ...enhancers,
);

const persistConfig = {
  key: 'root',
  whitelist: ['user'],
  storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

let store;
let persistor;

function createInstance() {
  const instance = createStore(persistedReducer, initialState, composedEnhancers);
  return instance;
}

export default function getStoreInstance() {
  store = store || createInstance();
  store.runSaga = sagaMiddleware.run;
  persistor = persistor || persistStore(store);
  return {store, persistor};
}
