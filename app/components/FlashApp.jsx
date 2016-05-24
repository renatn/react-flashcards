import React, { Component } from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';

import Actions from '../actions';
import Player from './Player';
import AddCard from './AddCard';
import BrowseCards from './BrowseCards';
import AddDeck from './AddDeck';
import DeckGrid from './DeckGrid';

const renderScene = (router) => {
	switch (router.route) {
		case '/STUDY':
			return <Player />;
		case '/ADD_CARD':
			return <AddCard />;
		case '/BROWSE':
			return <BrowseCards />;
		case '/ADD_DECK':
			return <AddDeck deck={router.deck} />;
		default:
			return null;
	}
};

class FlashApp extends Component {

	constructor(props) {
		super(props);
		this.handleSave = this.handleSave.bind(this);
	}

	componentDidMount() {
 		this.props.onLoad();
	}

	handleSave(e) {
		e.preventDefault();
		const { decks } = this.props;
		localStorage.setItem('react-flashcards', JSON.stringify(decks));
		alert(`Saved: ${decks.length} decks`);
	}

	render() {
		const { decks, router, spa } = this.props;
		
		const isOverlayOpen = router.route !== '/';
		return (
			<div>
				<header className="app-header">
					<h1 className="app-header__title">FlashCards!</h1>
				</header>
				<main className="main">
					<div className="main__content">
						<div className={classnames({ hidden: decks.length > 0, 'container': true })}>
							<p className="app_header__description">
								Интервальные повторения — техника удержания в памяти, заключающаяся в повторении запомненного учебного материала по определённым, постоянно возрастающим интервалам
							</p>

							<div className="call-to-action">
								<button 
									className="btn btn--accent" 
									onClick={this.props.onAddDeck}
								>
									Добавить колоду
								</button>
							</div>
						</div>
						<DeckGrid />
					</div>
				</main>
				<div className={classnames({ overlay: true, 'overlay--open': isOverlayOpen })}>
					<button 
						className="overlay__button-close" 
						onClick={this.props.onCloseOverlay}
					>
					</button>
					<div className="overlay__content">
						{renderScene(router)}
					</div>
				</div>
				<div className={classnames({ undo: true, 'undo--open': spa.showUndo })}>
					<div className="container">
						<button className="btn btn--base" onClick={this.props.onUndo}>
							Отменить
						</button>
						<a href="" className="link" onClick={this.props.onCloseUndo}>
							Закрыть
						</a>
					</div>
				</div>
			</div>
		);
	}
}

export default connect(
	state => {
		return {
			decks: state.decks,
			router: state.router,
			spa: state.spa
		}
	},
	dispatch => {
		return {
			onAddDeck: () => dispatch(Actions.route('/ADD_DECK')),
			onCloseOverlay: () => dispatch(Actions.route('/')),
			onLoad: () => dispatch(Actions.load()),
			onUndo: () => dispatch(Actions.undo()),
			onCloseUndo: (e) => {
				e.preventDefault();
				dispatch(Actions.closeUndo());
			}
		}
	}
)(FlashApp);