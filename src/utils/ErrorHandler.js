import { store } from '../store'

const ErrorHandler = {
  send: error => {
    store.dispatch({ type: 'ERROR', payload: error})
    console.error(error);
  }
}

export default ErrorHandler;