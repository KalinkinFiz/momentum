const WEATHER_API_URL = 'https://api.openweathermap.org/data/2.5/weather';
const WEATHER_KEY = '5401f610c972674933039d294cd28ead';

const WEATHER_REFRESH_BTN = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" width="18px" height="18px"><path d="M0 0h24v24H0z" fill="none"/><path d="M19 8l-4 4h3c0 3.31-2.69 6-6 6-1.01 0-1.97-.25-2.8-.7l-1.46 1.46C8.97 19.54 10.43 20 12 20c4.42 0 8-3.58 8-8h3l-4-4zM6 12c0-3.31 2.69-6 6-6 1.01 0 1.97.25 2.8.7l1.46-1.46C15.03 4.46 13.57 4 12 4c-4.42 0-8 3.58-8 8H1l4 4 4-4H6z"/></svg>`;

class Weather {
  constructor() {
    this.city = null;

    this.icon = null;
    this.temp = null;
    this.humidit = null;
    this.windSpeed = null;

    this.error = false;
    this.refreshTimeout = null;

    this.weatherElement = null;

    this.weatherBoxElement = null;
    this.weatherToggleElement = null;

    this._refreshWeather = this._refreshWeather.bind(this);
  }

  init(city) {
    this.city = city || 'Minsk';

    this.weatherBoxElement = createElement('div', 'Loading...', { classes: 'weather__box' });
    this.weatherRefreshElement = createElement('button', WEATHER_REFRESH_BTN, {
      classes: 'weather__refresh',
      htmlAttrs: { style: 'display: none;' },
    });

    this.weatherRefreshElement.addEventListener('click', this._refreshWeather);

    this._reLoadWeather().then(() => {
      !this.error && (this.weatherRefreshElement.style.display = 'block');
    });

    return this;
  }

  async _reLoadWeather() {
    const { icon, temp, humidit, windSpeed } = await this._fetchWeather();

    this.icon = icon;
    this.temp = temp;
    this.humidit = humidit;
    this.windSpeed = windSpeed;
    this._render();

    this.refreshTimeout = setTimeout(this._reLoadWeather.bind(this), 300000);
  }

  set City(value) {
    this.city = value || 'Minsk';

    clearTimeout(this.refreshTimeout);
    this._reLoadWeather().then(() => {
      this.error && (this.weatherRefreshElement.style.display = 'none');
      !this.error && (this.weatherRefreshElement.style.display = 'block');
    });
  }

  $mount(container) {
    this.weatherElement = container;

    this.weatherElement.classList.add('weather');

    this.weatherElement.append(this.weatherBoxElement, this.weatherRefreshElement);
  }

  _render() {
    this.weatherBoxElement.innerHTML = !this.error
      ? `
      <span class="weather__city">${this.city}</span>
      <div class="weather__info">
        <i class="weather__icon owf owf-${this.icon}"></i>
        <span class="weather__temp">${this.temp}<sup>&#176;</sup></span>
      </div>
      <div class="weather__meta">
        <span class="weather__humidit"><b>Humidit:</b> ${this.humidit} %</span>
        <span class="weather__wind-speed"><b>Wind speed:</b> ${this.windSpeed} m/s</span>
      </div>
    `
      : `Сity not found`;
  }

  async _refreshWeather() {
    clearTimeout(this.refreshTimeout);
    this.weatherRefreshElement.classList.add('loading');
    await this._reLoadWeather();
    this.weatherRefreshElement.classList.remove('loading');
  }

  async _fetchWeather() {
    try {
      const response = await fetch(
        `${WEATHER_API_URL}?appid=${WEATHER_KEY}&q=${this.city}&lang=en&units=metric`,
      );

      const data = await response.json();

      this.error = false;

      return {
        icon: data.weather[0].id,
        temp: Math.round(data.main.temp),
        humidit: data.main.humidity,
        windSpeed: data.wind.speed,
      };
    } catch (e) {
      this.error = true;
      return { icon: null, temp: null, humidit: null, windSpeed: null };
    }
  }
}
