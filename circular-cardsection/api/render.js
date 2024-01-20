class WeatherRender extends LocateFetch {
  constructor(api) {
    super(api);
    this.setParams();
    this.init();
    this.cards = document.querySelectorAll('.card');
    this.currentDate = new Date();
    this.weatherData = undefined;
    this.monthMap = {
      0: 'january',
      1: 'february',
      2: 'march',
      3: 'april',
      4: 'may',
      5: 'june',
      6: 'july',
      7: 'august',
      8: 'september',
      9: 'october',
      10: 'november',
      11: 'december',
    };
    this.dayMap = {
      0: 'Monday',
      1: 'Tuesday',
      2: 'Wednesday',
      3: 'Thursday',
      4: 'Friday',
      5: 'Saturday',
      6: 'Sunday',
    };
    this.PTYmap = {
      0: ['sunny', '/images/sunny.png'], // 맑음
      1: ['rainy', '/images/rainy.png'], // 비
      2: ['snow', '/images/snow.png'], // 비/눈
      3: ['snow', '/images/snow.png'], // 눈
      4: ['shower', '/images/rain-thunder.png'], // 소나기
      5: ['windy', '/images/windy.png'], // 바람 많음
    };
    this.SKYmap = {
      0: ['sunny', '/images/sunny.png'],
      3: ['cloudy', '/images/cloudy.png'],
      4: ['windy', '/images/windy.png'],
    };
    this.hours = Array.from({ length: 25 }, (_, i) => {
      const paddedHour = `0${i}`.slice(-2);
      return `${paddedHour}00`; // [0100 , 0200 ... 2400]
    });
  }

  async getWeathers() {
    // GET 요청을 보내지 않았을 때는 GET 요청을 받아오고
    // 받아온적 있을 경우엔 이미 받아온 것을 return
    if (!this.weatherData) {
      this.weatherData = await this.parseResponse();
      return this.weatherData;
    }
    return this.weatherData;
  }

  choiceSrc(ptyCode, skyCode) {
    if (!ptyCode) {
      return this.SKYMAP[skyCode];
    }
    return this.PTYmap[ptyCode];
  }

  getDate() {
    const { monthMap, dayMap } = this;

    let hour = this.currentDate.getHours();
    const meridie = hour >= 12 ? 'PM' : 'AM';
    hour = hour >= 12 ? hour - 12 : hour;
    const day = dayMap[this.currentDate.getDay()];
    const date = this.currentDate.getDate();
    const month = monthMap[this.currentDate.getMonth()];

    return [hour, meridie, day, date, month];
  }

  async renderMain(address) {
    const [hour, meridie, day, date, month] = this.getDate();

    const targetWeather = await this.getWeathers()[address][hour];
    // 특정 지역의 특정 시간의 정보를 가져옴
    const { POP, PTY, REH, SKY, TMP, WSD } = targetWeather;
    const [weatherState, src] = this.choiceSrc(PTY, SKY);
    return `<div class="weather-wrapper">
    <div class="main-weather">
      <div class="header-weather">🌍${address}</div>
      <div class="body-weather">
        <img class="weather-img" src=${src} />
        <div class="weather-text">
          <div class="temperature-text">${TMP}℃</div>
          <div class="state-text">${weatherState}</div>
          <div class="date-text">
            <span class="hour">${hour}</span>
            <span span="meridie">${meridie}</span>,${day},${date}, ${month}
          </div>
        </div>
        <hr class = 'cross-line' / >
        <div class="weather-sub">
          <div class="sub-wrapper">
            <div class="weather-icon">💨</div>
            <div class="datail-number">${WSD} km/h</div>
            <div class="datail-text">wind</div>
          </div>
          <div class="sub-wrapper">
            <div class="weather-icon">💧</div>
            <div class="datail-number">${REH}%</div>
            <div class="datail-text">Humidity</div>
          </div>
          <div class="sub-wrapper">
            <div class="weather-icon">☂️</div>
            <div class="datail-number">${POP}%</div>
            <div class="datail-text">chance of <br />rain</div>
          </div>
        </div>
      </div>
      <div class="tail-weather"></div>
    </div>`;
  }

  async renderSub() {}

  async renderAll() {
    const { locateArr } = this;
    const weatherData = await this.getWeathers();
    console.log(weatherData);

    locateArr.forEach((locate, index) => {
      const { address } = locate;

      /**
      PCP : 1시간 강수량 (1mm)
      POP : 강수 확률
      PTY : 강수 형태 (this.PTYmap 과 연동)
      REH : 습도 
      SKY : 하늘 상태 (맑음(1) , 구름많음(3) , 흐림(4)) (this.SKYmap)
      SNO : 1시간 신적설 (1cm)
      TMP : 1시간 기온
      WSD : 풍속 (m/s)
       */
    });
  }
}

const apiKey =
  'Jwxgv8BQexpONepfrXnbs1PdxJ35yKLwEEW0bTK4QpCwdpecz%2F5tqkdCYp5rjomx8BzXWmSJLwvpuYYk1msbmw%3D%3D';
const a = new WeatherRender(apiKey);
a.renderMain();
