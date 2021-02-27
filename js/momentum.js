class Momentum {
  constructor() {
    this.momentum = null;
    this.momentumDate = null;
    this.momentumTime = null;

    this.momentumGreetingText = null;
    this.momentumName = null;

    this.momentumFocus = null;

    this.momentumCityControl = null;

    this.momentumQuotes = null;
    this.momentumWeather = null;
    this.momentumBackgrounds = null;

    this.imageIndex = -1;

    this.oldName = '';
    this.oldFocus = '';

    this.timeDay = '';
    this.oldCity = '';

    this.currentDate = new Date();

    this.hours = null;
    this.minutes = null;
    this.seconds = null;

    this.day = null;
    this.date = null;
    this.month = null;

    this.backgrounds = new Backgrounds();
    this.quotes = new Quotes();
    this.weather = new Weather();

    this._renderTime = this._renderTime.bind(this);
    this._setCity = this._setCity.bind(this);
    this._setName = this._setName.bind(this);
    this._setFocus = this._setFocus.bind(this);
  }

  init() {
    // Init Date & Time Elements
    this.momentumDate = createElement('span', null, { classes: 'momentum-date' });
    this.momentumTime = createElement('time', null, { classes: 'momentum-time' });

    // Init Greeting & Name Elements
    this.momentumGreetingText = createElement('span', null, { classes: 'momentum-greeting__text' });
    this.momentumName = createElement('span', null, {
      classes: 'momentum-greeting__name',
      htmlAttrs: {
        contenteditable: true,
      },
    });

    // city
    this.momentumCityControl = createElement('span', null, {
      classes: 'momentum-city__control',
      htmlAttrs: { contenteditable: true },
    });

    // Focus
    this.momentumFocus = createElement('span', null, {
      classes: 'momentum-focus__control',
      htmlAttrs: { contenteditable: true },
    });

    // Backgrounds
    this.momentumBackgrounds = createElement('div', null, { classes: 'momentum-backgrounds' });

    // Quotes
    this.momentumQuotes = createElement('div', null, { classes: 'momentum-quotes' });

    // Weather
    this.momentumWeather = createElement('div', null, { classes: 'momentum-weather' });

    this.momentum = createElement(
      'div',
      [
        createElement('div', null, { classes: 'momentum-overlay' }),
        createElement(
          'div',
          [
            this.momentumDate,
            this.momentumTime,
            createElement('div', [this.momentumGreetingText, this.momentumName], {
              classes: 'momentum-greeting',
            }),
            createElement('div', this.momentumCityControl, {
              classes: 'momentum-city',
            }),
            createElement(
              'div',
              [createElement('span', 'What Is Your Focus For Today?'), this.momentumFocus],
              {
                classes: 'momentum-focus',
              },
            ),
          ],
          { classes: 'momentum-content' },
        ),
        this.momentumQuotes,
        this.momentumWeather,
        this.momentumBackgrounds,
      ],
      {
        id: 'momentum',
        classes: 'mommentum',
      },
    );

    this.backgrounds.init(this.momentum).$mount(this.momentumBackgrounds);

    this._setImages();
    localStorage.setItem('date', this.currentDate);

    this._renderDate();
    this._renderTime();
    this._initEvents();

    this._getName();
    this._getFocus();

    this.quotes.init().$mount(this.momentumQuotes);

    const city = this._getCity();
    this.weather.init(city).$mount(this.momentumWeather);
    return this;
  }

  _initEvents() {
    this.momentumCityControl.addEventListener('click', this._setCity);
    this.momentumCityControl.addEventListener('keypress', this._setCity);
    this.momentumCityControl.addEventListener('blur', this._setCity);

    this.momentumName.addEventListener('click', this._setName);
    this.momentumName.addEventListener('keypress', this._setName);
    this.momentumName.addEventListener('blur', this._setName);

    this.momentumFocus.addEventListener('click', this._setFocus);
    this.momentumFocus.addEventListener('keypress', this._setFocus);
    this.momentumFocus.addEventListener('blur', this._setFocus);
  }

  _getFocus() {
    const focus = localStorage.getItem('focus');

    if (focus === null) {
      this.momentumFocus.textContent = '';
    } else {
      this.momentumFocus.textContent = localStorage.getItem('focus');
    }

    return focus;
  }

  _setFocus(e) {
    if (e.type === 'click') {
      this.oldFocus = e.target.innerText;
      e.target.innerText = '';
    }
    if (e.type === 'keypress') {
      if (e.which == 13 || e.keyCode == 13) this.momentumFocus.blur();
    }
    if (e.type === 'blur') {
      if (this.oldFocus && !e.target.innerText) e.target.innerText = this.oldFocus;
      localStorage.setItem('focus', e.target.innerText);
      this.oldFocus = '';
    }
  }

  _getName() {
    const name = localStorage.getItem('name');

    if (name === null) {
      this.momentumName.textContent = '[Your Name]';
    } else {
      this.momentumName.textContent = localStorage.getItem('name');
    }

    return name;
  }

  _setName(e) {
    if (e.type === 'click') {
      this.oldName = e.target.innerText;
      e.target.innerText = '';
    }
    if (e.type === 'keypress') {
      if (e.which == 13 || e.keyCode == 13) this.momentumName.blur();
    }
    if (e.type === 'blur') {
      if (this.oldName && !e.target.innerText) e.target.innerText = this.oldName;
      e.target.innerText !== '[Your Name]' && localStorage.setItem('name', e.target.innerText);
      this.oldName = '';
    }
  }

  _getCity() {
    const city = localStorage.getItem('city');

    if (city === null) {
      this.momentumCityControl.textContent = '[Your City]';
    } else {
      this.momentumCityControl.textContent = localStorage.getItem('city');
    }

    return city;
  }

  _setCity(e) {
    if (e.type === 'click') {
      this.oldCity = e.target.innerText;
      e.target.innerText = '';
    }
    if (e.type === 'keypress') {
      if (e.which == 13 || e.keyCode == 13) this.momentumCityControl.blur();
    }
    if (e.type === 'blur') {
      if (this.oldCity && !e.target.innerText) e.target.innerText = this.oldCity;

      if (e.target.innerText !== '[Your City]') {
        localStorage.setItem('city', e.target.innerText);
        this.weather.City = e.target.innerText;
      }

      this.oldCity = '';
    }
  }

  _setImages() {
    // const date = localStorage.getItem('date');
    // const images = localStorage.getItem('images');

    // if (!images || (images && this.currentDate.getDate() > new Date(date).getDate())) {
    //   this.backgrounds.Images = Backgrounds.generateImages();
    //   localStorage.setItem('images', JSON.stringify(this.backgrounds.Images));
    //   return;
    // }

    // this.backgrounds.Images = JSON.parse(images);

    this.backgrounds.Images = Backgrounds.generateImages();
  }

  _renderDate() {
    this.day = this.currentDate.getDay();
    this.date = this.currentDate.getDate();
    this.month = this.currentDate.getMonth();

    this.momentumDate.innerHTML = `
      ${visibilityDay(this.day)}, 
      ${this.date} 
      ${visibilityMonth(this.month)}
    `;
  }

  _renderTime() {
    this.currentDate = new Date();

    this.hours = this.currentDate.getHours();
    this.minutes = this.currentDate.getMinutes();
    this.seconds = this.currentDate.getSeconds();

    this.momentumTime.innerHTML = `
      ${withZero(this.hours)}
      <span>:</span>
      ${withZero(this.minutes)}
      <span>:</span>
      ${withZero(this.seconds)}
    `;

    if (this.timeDay !== getTimeDay(this.hours)) {
      this.momentumGreetingText.innerText = `Good ${visibilityTimeDay(this.hours)},`;
    }

    if (this.imageIndex !== this.hours) {
      this.timeDay = getTimeDay(this.hours);
      this.imageIndex = this.hours;

      this.backgrounds.ImageIndex = this.imageIndex;
      this.backgrounds.changeImage(this.imageIndex);
    }

    setTimeout(this._renderTime, 1000);
  }

  $mount(root) {
    root.append(this.momentum);
  }
}
