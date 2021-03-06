import React, { Component } from 'react';

import CardItem from './CardItem';

const byNextTime = (a, b) => a.nextTime - b.nextTime;

export default class BrowseCards extends Component {

  constructor(props) {
    super(props);
    this.handleRemoveCard = this.handleRemoveCard.bind(this);
  }

  getDeck() {
    const { router, decks } = this.props;
    return decks.byId[router.deckId];
  }

  handleRemoveCard(cardId) {
    const deck = this.getDeck();
    this.props.removeCard(deck.id, cardId);
  }

  render() {
    const deck = this.getDeck();

    return (
      <div>
        <header className="overlay__title">
          <h1>{deck.name}</h1>
        </header>
        <ul>
          {
            deck.cards.sort(byNextTime).map((card, i) =>
              <CardItem {...card} key={i} onRemove={this.handleRemoveCard} />)
          }
        </ul>
      </div>
    );
  }
}

BrowseCards.propTypes = {
  router: React.PropTypes.object,
  decks: React.PropTypes.object,
  removeCard: React.PropTypes.func,
};
