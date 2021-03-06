import React, { Component } from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';
import { bindActionCreators } from 'redux';

import Actions from '../actions';
import Player from './Player';
import AddCard from './AddCard';
import BrowseCards from './BrowseCards';
import AddDeck from './AddDeck';
import DeckGrid from './DeckGrid';
import Landing from './Landing';
import AppBar from './AppBar';

const renderScene = (route, props) => {
  switch (route) {
    case '/STUDY':
      return <Player {...props} />;
    case '/ADD_CARD':
      return <AddCard {...props} />;
    case '/BROWSE':
      return <BrowseCards {...props} />;
    case '/ADD_DECK':
      return <AddDeck {...props} />;
    case '/EDIT_DECK':
      return <AddDeck {...props} isEdit={true}/>;
    default:
      return null;
  }
};

const Disclaimer = ({ isVisible, onClose }) => (
  <div className={classnames({ disclaimer: true, 'disclaimer--open': isVisible })}>
    <a href="" className="disclaimer__close" onClick={onClose}>&times;</a>
    <p className="container">
      Приложение работает полностью оффлайн, все введённые данные
      сохраняются только в вашем браузере. Если вы хотите, чтобы данные
      синхронизировались между устройствами - войдите с помощью Facebook.
    </p>
  </div>
);

Disclaimer.propTypes = {
  isVisible: React.PropTypes.bool,
  onClose: React.PropTypes.func,
};

const UndoBar = ({ isVisible, onUndo, onClose }) => (
  <div className={classnames({ undo: true, 'undo--open': isVisible })}>
    <div className="container">
      <button className="btn btn--base" onClick={onUndo}>
        Отменить
      </button>
      <a href="" className="link" onClick={onClose}>
        Закрыть
      </a>
    </div>
  </div>
);

UndoBar.propTypes = {
  isVisible: React.PropTypes.bool,
  onClose: React.PropTypes.func,
  onUndo: React.PropTypes.func,
};

class AppShell extends Component {

  constructor(props) {
    super(props);

    this.handleCloseUndo = this.handleCloseUndo.bind(this);
    this.handleCloseDisclaimer = this.handleCloseDisclaimer.bind(this);
  }

  componentDidMount() {
    this.props.connectToFirebase();
  }

  handleCloseDisclaimer(e) {
    e.preventDefault();
    this.props.hideDisclaimer();
  }

  handleCloseUndo(e) {
    e.preventDefault();
    this.props.closeUndo();
  }

  render() {
    const { decks, router, settings } = this.props;
    const isOverlayVisible = router.route !== '/';
    const isDisclaimerVisible = settings.isDisclaimerOpen;
    const hasDecks = decks.allIds.length > 0;

    if (settings.isLoading) {
      return <div className="loader">Загрузка...</div>;
    }

    return (
      <div className="root">
        <Disclaimer
          isVisible={isDisclaimerVisible}
          onClose={this.handleCloseDisclaimer}
        />

        <AppBar {...this.props} />

        <header className="app-header">
          <h1 className="app-header__title">Just Repeat!</h1>
        </header>

        { hasDecks ? 
          <main className="main">
            <div className="main__content">
              <DeckGrid {...this.props} />
            </div>
          </main> :
          <Landing onClick={this.props.routeAddDeck} />
        }

        <div className={classnames({ overlay: true, 'overlay--open': isOverlayVisible })}>
          <button
            className="overlay__button-close"
            onClick={this.props.routeRoot}
          >
          </button>
          <div className="overlay__content">
            {renderScene(router.route, this.props)}
          </div>
        </div>

        <UndoBar
          isVisible={settings.showUndo}
          onClose={this.handleCloseUndo}
          onUndo={this.props.undo}
        />

      </div>
    );
  }
}

AppShell.propTypes = {
  user: React.PropTypes.object,
  decks: React.PropTypes.object,
  router: React.PropTypes.object,
  settings: React.PropTypes.object,
  undo: React.PropTypes.func,
  closeUndo: React.PropTypes.func,
  hideDisclaimer: React.PropTypes.func,
  routeRoot: React.PropTypes.func,
  routeAddDeck: React.PropTypes.func,
  connectToFirebase: React.PropTypes.func,
};

export default connect(
  state => ({
    decks: state.decks,
    router: state.router,
    player: state.player,
    settings: state.settings,
    user: state.user,
    decksFilter: state.decksFilter,
  }),
  dispatch => bindActionCreators(Actions, dispatch)
)(AppShell);
