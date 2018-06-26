import { applyMiddleware, createStore } from 'redux';
import { persistStore, persistReducer } from 'redux-persist'
import { createLogger } from 'redux-logger';
import promise from 'redux-promise-middleware';

import storage from 'redux-persist/lib/storage' // defaults to localStorage for web and AsyncStorage for react-native
import hardSet from 'redux-persist/lib/stateReconciler/hardSet'

import reducers from './reducers'

const persistConfig = {
  key: 'root',
  storage,
  stateReconciler: hardSet,
}



const persistedReducer = persistReducer(persistConfig, reducers)
const middleware = applyMiddleware(promise(), createLogger());

const store = createStore(
  persistedReducer,
  middleware,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
)

const persistor = persistStore(store)



export {
  store, 
  persistor
}