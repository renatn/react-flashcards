import { combineReducers } from 'redux';
import decks from './decks';

export const player = (state = [], action) => {
  switch (action.type) {
    case 'START_STUDY': {
      const now = Date.now();
      return action.cards
          .filter(c => c.nextTime <= now)
          .sort((a, b) => a.level - b.level)
          .map((c) => ({ ...c, isAnswered: false }));
    }
    case 'SHOW_ANSWER':
      return state.map(c => {
        if (c.id === action.cardId) {
          return {
            ...c,
            isAnswered: true,
          };
        }
        return c;
      });
    case 'DIFFICULTY_LEVEL':
      return state.slice(1);
    default:
      return state;
  }
};

export const router = (state = { route: '/' }, action) => {
  switch (action.type) {
    case 'ROUTE':
      return action;
    default:
      return state;
  }
};

const INITIAL_SETTINGS = {
  showUndo: false,
  isDisclaimerOpen: true,
  isLoading: false
};

const settings = (state = INITIAL_SETTINGS, action) => {
  switch (action.type) {
    case 'SHOW_UNDO':
      return { ...state, showUndo: true };
    case 'HIDE_UNDO':
      return { ...state, showUndo: false };
    case 'SHOW_DISCLAIMER':
      return { ...state, isDisclaimerOpen: true };
    case 'HIDE_DISCLAIMER':
      return { ...state, isDisclaimerOpen: false };
    case 'REQUEST_DECKS':
      return { ...state, isLoading: true };
    case 'RECEIVE_DECKS':
      return { ...state, isLoading: false };
    default:
      return state;
  }
};

const user = (state = {}, action) => {
  switch (action.type) {
    case 'USER_AUTHENTICATED':
      return {
        ...state,
        userName: action.displayName,
        isAuthenticated: true,
        uid: action.uid,
      };
    case 'USER_NOT_AUTHENTICATED':
      return {
        isAuthenticated: false,
      };
    default:
      return state;
  }
};

const decksFilter = (state = 'ALL', action) => {
  switch (action.type) {
    case 'SET_FILTER':
      return action.filter;
    default:
      return state;
  }
}

const app = combineReducers({
  router,
  decks,
  player,
  settings,
  user,
  decksFilter,
});

export default app;
