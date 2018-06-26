import { applyMiddleware, createStore } from 'redux';
import reducers from './reducers';
import { createLogger } from 'redux-logger';
import promise from 'redux-promise-middleware';

const middleware = applyMiddleware(promise(), createLogger());
const store = createStore(
  reducers,
  middleware,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

store.subscribe(() => {
  console.debug('store changed', store.getState());
})

export default store;