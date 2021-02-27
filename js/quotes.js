const API_URL = 'https://quote-garden.herokuapp.com/api/v2/quotes/random';

const REFRESH_BTN = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" width="18px" height="18px"><path d="M0 0h24v24H0z" fill="none"/><path d="M19 8l-4 4h3c0 3.31-2.69 6-6 6-1.01 0-1.97-.25-2.8-.7l-1.46 1.46C8.97 19.54 10.43 20 12 20c4.42 0 8-3.58 8-8h3l-4-4zM6 12c0-3.31 2.69-6 6-6 1.01 0 1.97.25 2.8.7l1.46-1.46C15.03 4.46 13.57 4 12 4c-4.42 0-8 3.58-8 8H1l4 4 4-4H6z"/></svg>`;

class Quotes {
  constructor() {
    this.quote = '';
    this.author = '';

    this.quotesElement = null;

    this.quotesBoxElement = null;
    this.quotesToggleElement = null;

    this._refreshQuote = this._refreshQuote.bind(this);
  }

  init() {
    this.quotesBoxElement = createElement('div', 'Loading...', { classes: 'quotes__box' });
    this.quotesToggleElement = createElement('button', REFRESH_BTN, {
      classes: 'quotes__toggle',
      htmlAttrs: {
        disabled: true,
      },
    });

    this.quotesToggleElement.addEventListener('click', this._refreshQuote);

    this._fetchQuote().then(({ quote, author }) => {
      this.quote = quote;
      this.author = author;
      this._render();

      this.quotesToggleElement.disabled = false;
    });

    return this;
  }

  _render() {
    this.quotesBoxElement.innerHTML = `
        <span class="quotes__text">"${this.quote}"</span>
        <span class="quotes__author">— ${this.author}</span>
      `;
  }

  $mount(container) {
    this.quotesElement = container;

    this.quotesElement.classList.add('quotes');

    this.quotesElement.append(this.quotesBoxElement, this.quotesToggleElement);
  }

  _refreshQuote() {
    this.quotesToggleElement.disabled = true;
    this.quotesBoxElement.innerText = 'Loading...';

    this._fetchQuote().then(({ quote, author }) => {
      this.quote = quote;
      this.author = author;
      this._render();

      this.quotesToggleElement.disabled = false;
    });
  }

  async _fetchQuote() {
    const response = await fetch(API_URL);

    const { quote, statusCode } = await response.json();

    return { quote: quote.quoteText, author: quote.quoteAuthor };
  }
}
