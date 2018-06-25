import { applyMiddleware, createStore } from 'redux';
import reducers from './reducers';
import { createLogger } from 'redux-logger';
import promise from 'redux-promise-middleware';

const middleware = applyMiddleware(promise(), createLogger());
const store = createStore(reducers, middleware);

store.subscribe(() => {
  console.debug('store changed', store.getState());
})

export default store;