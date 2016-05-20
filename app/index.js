import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import logger from 'redux-logger';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';

import Actions from './actions';
import { router, decks } from './reducers';
import FlashApp from './components/FlashApp';		

const app = combineReducers({
	router,
	decks
});

const autoSaver = store => next => action => {
	const DIRTY_ACTIONS = ['ADD_DECK', 'ADD_CARD', 'REMOVE_DECK', 'DIFFICULTY_LEVEL'];
	const state = next(action);
	if (DIRTY_ACTIONS.indexOf(action.type) !== -1) {
		const { decks } = store.getState();
		localStorage.setItem('react-flashcards-v1', JSON.stringify(decks));
		console.info(`Saved ${decks.length} decks`);
	}  
  	return state;
};

const store = createStore(
	app, 
	applyMiddleware(thunk, autoSaver, logger())
);

ReactDOM.render(
	<Provider store={store}>
		<FlashApp />
	</Provider>,
	document.getElementById('app')
);		
