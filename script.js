class WeatherWidget {
    APP_ID = '58b6f7c78582bffab3936dac99c31b25';
    APP_ROOT = '//api.openweathermap.org/data/2.5';
    #weather = {};
    #forecast = [];


     // Инициализация элементов виджета

    #init() {
        const wrapper = document.querySelector('.wrapper');
        const panel = wrapper.querySelector('.panel');
        const weather = panel.querySelector('.weather');
        const temp = weather.querySelector('#temp');

        this.weatherEl = weather;
        this.cityEl = panel.querySelector('#city');
        this.dtEl = weather.querySelector('#dt');
        this.descriptionEl = weather.querySelector('#description');
        this.windEl = weather.querySelector('#wind');
        this.humidityEl = weather.querySelector('#humidity');
        this.iconEl = temp.querySelector('#condition');
        this.tempNumberEl = temp.querySelector('#num');
        this.celsiusEl = temp.querySelector('#celsius');
        this.fahrenheitEl = temp.querySelector('#fahrenheit');
        this.forecastEl = weather.querySelector('#forecast');
        this.searchEl = wrapper.querySelector('#search-form');
        this.formEl = this.searchEl.querySelector('form');
        this.buttonEl = this.formEl.querySelector('#button');
        this.buttonEl.onmouseleave = () => this.buttonEl.className = 'button transparent';

        this.formEl.addEventListener('submit', event => {
            const input = document.getElementById('search').value;
            const inputLength = input.length;
            if (inputLength) this.getWeather(input);
            event.preventDefault();
        });

        this.celsiusEl.addEventListener('click', this.toCelsius.bind(this));
        this.fahrenheitEl.addEventListener('click', this.toFahrenheit.bind(this));
    }

     // Преобразование температуры в шкалу Цельсия

    toCelsius() {
        this.celsiusEl.classList.add('active');
        this.celsiusEl.removeAttribute('href');

        this.fahrenheitEl.classList.remove('active');
        this.fahrenheitEl.setAttribute('href', '#');

        this.tempNumberEl.innerHTML = String(Math.round(this.#weather.main.temp));

        this.doForecast('celsius');
    }


     // Превращение температуры в шкалу Фаренгейта

    toFahrenheit() {
        this.fahrenheitEl.classList.add('active');
        this.fahrenheitEl.removeAttribute('href');

        this.celsiusEl.classList.remove('active');
        this.celsiusEl.setAttribute('href', '#');

        this.tempNumberEl.innerHTML = String(Math.round(this.#weather.main.temp * 9 / 5 + 32));

        this.doForecast('fahrenheit');
    }


      // Изображение прогноза погоды на несколько дней

    doForecast(unit) {
        this.forecastEl.innerHTML =
            this.#forecast.map(item => (
                `<div class="block">` +
                `<h3 class="secondary">${item.date}</h3>` +
                `<h2 class="high">${item[unit].high}</h2>` +
                `<h4 class="secondary">${item[unit].low}</h4>` +
                `</div>`
            )).join('');
    }

     // Определение иконки погоды

    drawIcon () {
        this.iconEl.className = 'wi';

        switch (this.#weather.weather[0].icon) {
            case '01d':
                this.iconEl.classList.add('wi-day-sunny');
                break;
            case '02d':
                this.iconEl.classList.add('wi-day-sunny-overcast');
                break;
            case '01n':
                this.iconEl.classList.add('wi-night-clear');
                break;
            case '02n':
                this.iconEl.classList.add('wi-night-partly-cloudy');
                break;
        }

        switch (this.#weather.weather[0].icon.substring(0, 2)) {
            case '03':
                this.iconEl.classList.add('wi-cloud');
                break;
            case '04':
                this.iconEl.classList.add('wi-cloudy');
                break;
            case '09':
                this.iconEl.classList.add('wi-showers');
                break;
            case '10':
                this.iconEl.classList.add('wi-rain');
                break;
            case '11':
                this.iconEl.classList.add('wi-thunderstorm');
                break;
            case '13':
                this.iconEl.classList.add('wi-snow');
                break;
            case '50':
                this.iconEl.classList.add('wi-fog');
                break;
        }
    }


      // Конструктор класса WeatherWidget

    constructor() {
        this.#init();
    }


     // Формирование текста описания текущей погоды

    titleCase(str) {
        return str.split(' ').map(word => word[0].toUpperCase() + word.substring(1)).join(' ');
    }


      // Превращение сокращенного написания для недели в полный формат

    fullDay(str) {
        switch (str) {
            case 'Tue':
                return 'Tuesday';
            case 'Wed':
                return 'Wednesday';
            case 'Thu':
                return 'Thursday';
            case 'Sat':
                return 'Saturday';
            default:
                return str + 'day';
        }
    }


      // Установка цвета фона в зависимости от температуры

    setBackground(background, button) {
        document.body.className = background;

        this.buttonEl.onmouseover = el => {
            el.target.classList.remove('transparent');
            el.target.classList.add(button);
        }
    }


      // Изображение на виджете информации о текущей погоде

    drawWeather(data) {
        Object.assign(this.#weather, data);

        if (this.#weather.cod === '404') {
            this.cityEl.innerHTML = 'city not found';
            this.setBackground('color404', 'button404');
            this.weatherEl.style.display = 'none';
        } else {
            this.weatherEl.style.display = '';
        }

        const dt = new Date(this.#weather.dt * 1000).toString().split(' ');

        this.cityEl.innerHTML = this.#weather.name +
            (this.#weather.sys.country ? ', ' + this.#weather.sys.country : '');

        this.tempNumberEl.innerHTML = String(Math.round(this.#weather.main.temp));
        this.descriptionEl.innerHTML = this.titleCase(this.#weather.weather[0].description);
        this.windEl.innerHTML = 'Wind: ' + this.#weather.wind.speed + ' m/s';
        this.humidityEl.innerHTML = 'Humidity ' + this.#weather.main.humidity + '%';
        this.dtEl.innerHTML = this.fullDay(dt[0]) + ' ' + dt[4].substring(0, 5);

        if (this.#weather.main.temp >= 25) {
            this.setBackground('hot', 'button-hot');
        } else if (this.#weather.main.temp >= 20) {
            this.setBackground('warm', 'button-warm');
        } else if (this.#weather.main.temp >= 15) {
            this.setBackground('cool', 'button-cool');
        } else {
            this.setBackground('cold', 'button-cold');
        }

        this.drawIcon();
        this.toCelsius()
    }


     //  Изображение на виджете информации о прогнозе погоды на несколько дней

    drawForecast(data) {
        console.log(data);

        this.#forecast = [];
        data.list.forEach(item => {
            this.#forecast.push({
                date: new Date(item.dt * 1000).toString().split(' ')[0],
                fahrenheit: {
                    high: Math.round(item.temp.max * 9 / 5 + 32),
                    low: Math.round(item.temp.min * 9 / 5 + 32),
                },
                celsius: {
                    high: Math.round(item.temp.max),
                    low: Math.round(item.temp.min)
                }
            });
        })

        this.doForecast('celsius');
    }


     //  Формирование адреса для загрузки информации о погоде


    getURL(isForecast, input, units = 'metric', cnt = 6) {
        const uri = isForecast ? 'forecast/daily' : 'weather';
        return `${this.APP_ROOT}/${uri}?q=${encodeURIComponent(input)}&units=${units}&cnt=${cnt}&appid=${this.APP_ID}`;
    }


     // Загрузка информации о погоде для заданного города

    getWeather(input) {
        Promise.all([
            fetch(this.getURL(false, input))
                .then(response => response.json())
                .then(this.drawWeather.bind(this)),

            fetch(this.getURL(true, input))
                .then(response => response.json())
                .then(this.drawForecast.bind(this))
        ]).then();
    }
}

const widget = new WeatherWidget();
widget.getWeather('Kyiv');