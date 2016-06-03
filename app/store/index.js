import { createStore, applyMiddleware } from 'redux';
import logger from 'redux-logger';
import thunk from 'redux-thunk';

import app from '../reducers';
import { saveState, loadState } from '../utils';
import { DIRTY_ACTIONS } from '../constants';

const autoSaver = store => next => action => {
  let state = next(action);
  if (DIRTY_ACTIONS.indexOf(action.type) !== -1) {
    saveState(store.getState());
    if (['REMOVE_DECK', 'REMOVE_CARD'].indexOf(action.type) !== -1) {
      state = next({ type: 'SHOW_UNDO' });
    }
  }
  return state;
};

const configureStore = () => {
  const persistedState = loadState();

  const middleware = [thunk, autoSaver];
  if (process.env.NODE_ENV !== 'production') {
    middleware.push(logger());
  }

  const store = createStore(
    app,
    persistedState,
    applyMiddleware(...middleware)
  );

  return store;
};


export default configureStore;