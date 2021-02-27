const MAX_NUMBER_IMAGE = 20;
const ARRAY_FOR_RANDOMIZE = [...new Array(MAX_NUMBER_IMAGE)].map((_, idx) => idx + 1);

const BACKGROUND_ARROW_ICON = `
<svg height="512" viewBox="0 0 64 64" width="512" xmlns="http://www.w3.org/2000/svg"><path d="m54 30h-39.899l15.278-14.552c.8-.762.831-2.028.069-2.828-.761-.799-2.027-.831-2.828-.069l-17.448 16.62c-.755.756-1.172 1.76-1.172 2.829 0 1.068.417 2.073 1.207 2.862l17.414 16.586c.387.369.883.552 1.379.552.528 0 1.056-.208 1.449-.621.762-.8.731-2.065-.069-2.827l-15.342-14.552h39.962c1.104 0 2-.896 2-2s-.896-2-2-2z"/></svg>`;

const BACKGROUND_REFRESH_ICON = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" width="18px" height="18px"><path d="M0 0h24v24H0z" fill="none"/><path d="M19 8l-4 4h3c0 3.31-2.69 6-6 6-1.01 0-1.97-.25-2.8-.7l-1.46 1.46C8.97 19.54 10.43 20 12 20c4.42 0 8-3.58 8-8h3l-4-4zM6 12c0-3.31 2.69-6 6-6 1.01 0 1.97.25 2.8.7l1.46-1.46C15.03 4.46 13.57 4 12 4c-4.42 0-8 3.58-8 8H1l4 4 4-4H6z"/></svg>`;

class Backgrounds {
  constructor() {
    this.images = [];
    this.imageIndex = -1;
    this.sliderImageIndex = this.imageIndex;

    this.prevImageIndex = -1;
    this.nextImageIndex = -1;

    this.container = null;

    this.backgroundsElement = null;
    this.backgroundsPrevElement = null;
    this.backgroundsNextElement = null;
    this.backgroundsRefreshElement = null;
    this.backgroundsCountElement = null;

    this._goToPrev = this._goToPrev.bind(this);
    this._goToNext = this._goToNext.bind(this);
    this._refresh = this._refresh.bind(this);
  }

  set ImageIndex(value) {
    this.imageIndex = value;
    this.sliderImageIndex = value;
  }

  init(container) {
    this.container = container;

    this.backgroundsPrevElement = createElement('button', BACKGROUND_ARROW_ICON, {
      classes: 'backgrounds-button backgrounds-button--prev',
    });

    this.backgroundsNextElement = createElement('button', BACKGROUND_ARROW_ICON, {
      classes: 'backgrounds-button backgrounds-button--next',
    });

    this.backgroundsRefreshElement = createElement('button', BACKGROUND_REFRESH_ICON, {
      classes: 'backgrounds-button backgrounds-button--refresh',
    });

    this.backgroundsCountElement = createElement('span', null, {
      classes: 'backgrounds-count',
    });

    this.backgroundsPrevElement.addEventListener('click', this._goToPrev);
    this.backgroundsNextElement.addEventListener('click', this._goToNext);
    this.backgroundsRefreshElement.addEventListener('click', this._refresh);

    return this;
  }

  $mount(container) {
    this.backgroundsElement = container;

    this.backgroundsElement.classList.add('backgrounds');

    this.backgroundsElement.append(
      this.backgroundsPrevElement,
      this.backgroundsRefreshElement,
      this.backgroundsNextElement,
      this.backgroundsCountElement,
    );
  }

  set Images(value) {
    this.images = value;
  }

  get Images() {
    return this.images;
  }

  static generateImages() {
    let urls = [];
    return ['night', 'morning', 'day', 'evening'].reduce((acc, type) => {
      urls = [...shuffle(ARRAY_FOR_RANDOMIZE).slice(0, 6)].map((number) => ({
        type,
        src: `${type}/${number}.jpg`,
      }));
      return acc.concat(urls);
    }, []);
  }

  changeImage(idx) {
    this.prevImageIndex =
      this.sliderImageIndex - 1 < 0 ? this.images.length - 1 : this.sliderImageIndex - 1;
    this.nextImageIndex =
      this.sliderImageIndex + 1 === this.images.length ? 0 : this.sliderImageIndex + 1;

    this.backgroundsCountElement.innerText = `${idx + 1} / ${this.images.length}`;

    this.backgroundsPrevElement.disabled = true;
    this.backgroundsNextElement.disabled = true;
    this.backgroundsRefreshElement.disabled = true;

    this.backgroundsRefreshElement.style.visibility =
      idx === this.imageIndex ? 'hidden' : 'visible';

    const src = `assets/images/${this.images[idx].src}`;

    const img = createElement('img');
    img.src = src;
    img.onload = () => (this.container.style.backgroundImage = `url(${src})`);

    setTimeout(() => {
      this.backgroundsPrevElement.disabled = false;
      this.backgroundsNextElement.disabled = false;
      this.backgroundsRefreshElement.disabled = false;
    }, 1200);

    this.backgroundsPrevElement.dataset.prevImage = `assets/images/${
      this.images[this.prevImageIndex].src
    }`;
    this.backgroundsNextElement.dataset.nextImage = `assets/images/${
      this.images[this.nextImageIndex].src
    }`;
  }

  _goToPrev() {
    this.sliderImageIndex = this.prevImageIndex;
    this.changeImage(this.prevImageIndex);
  }

  _goToNext() {
    this.sliderImageIndex = this.nextImageIndex;
    this.changeImage(this.nextImageIndex);
  }

  _refresh() {
    this.changeImage(this.imageIndex);

    this.sliderImageIndex = this.imageIndex;
  }
}

window.Backgrounds = Backgrounds;
