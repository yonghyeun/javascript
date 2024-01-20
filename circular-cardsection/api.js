class WeatherFetch {
  constructor(apikey) {
    this.locateArr = [
      {
        address: 'Seoul',
        longitude: 126.9816417,
        latitude: 37.57037778,
      },
      {
        address: 'Busan',
        longitude: 129.0729675,
        latitude: 35.1795543,
      },
      {
        address: 'Incheon',
        longitude: 126.625,
        latitude: 37.4562555,
      },
      {
        address: 'Daegu',
        longitude: 128.601445,
        latitude: 35.8714354,
      },
      {
        address: 'Daejeon',
        longitude: 127.3849729,
        latitude: 36.3510038,
      },
      {
        address: 'Gwangju',
        longitude: 126.8513898,
        latitude: 35.1768206,
      },
    ];
    this.params = {
      dateType: 'JSON',
      APIKEY: apikey,
    };
    this.updateArr = [
      '0200',
      '0500',
      '0800',
      '1100',
      '1400',
      '1700',
      '2000',
      '2300',
    ];
    this.options = {
      timeZone: 'Asia/Seoul',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    };
  }

  setParams() {
    // basedate, basetime 설정하기
    const currentDate = new Date();
    let koreanTime;
    // 오전 12시 ~ 02시 사이에는 전일 23시 데이터를 가져와야 함
    if (currentDate.getHours() < 2) {
      koreanTime = currentDate.setDate(currentDate.getDate() - 1);
    }

    koreanTime = new Intl.DateTimeFormat('en-US', this.options)
      .format(currentDate)
      .split(','); // 예시 [01/19/2024, 17:59:33]

    const [month, day, year] = koreanTime[0].trim().split('/');
    const [hour, minute] = koreanTime[1].trim().split(':');

    const fullBaseDate = `${year}${month}${day}`;
    const fullBaseTime = `${hour}${minute}`;

    // 기상청API 는 02시부터 23시까지 3시간 간격으로 업데이트 되며
    // 매 정각이 아닌 10분 후에 업데이트 되기 때문에
    // basetime 을 계산해줘야함

    const timeIndex = Math.max(Math.floor((fullBaseTime - 210) / 300), 0);
    this.params.baseDate = fullBaseDate;
    this.params.baseTime = this.updateArr[timeIndex];
  }

  init() {
    this.setParams();
    // 위도 경도 데이터를 nx , ny 데이터로 변경하기
    this.locateArr.map((locate) => {
      const _locate = locate;
      const { latitude, longitude } = _locate;
      const { x, y } = dfs_xy_conv('toXY', latitude, longitude);
      _locate.nx = x;
      _locate.ny = y;
    });
  }

  createUrl() {
    const { locateArr, params } = this;

    return locateArr.map((locate) => {
      const { nx, ny } = locate;
      const { dateType, APIKEY, baseDate, baseTime } = params;

      return `https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst?serviceKey=${APIKEY}&pageNo=1&numOfRows=1000&dataType=${dateType}&base_date=${baseDate}&base_time=${baseTime}&nx=${nx}&ny=${ny}`;
    });
  }

  async getAllData() {
    const urlArray = this.createUrl();
    const results = [];

    await Promise.all(
      urlArray.map((url) => fetch(url).then((res) => res.json())),
    )
      .then((allResponse) => allResponse.forEach((res) => results.push(res)))
      .catch(console.error);

    return results;
  }

  async parseResponse() {
    const { locateArr } = this;
    const allResponse = await this.getAllData();
    const parseResult = {};

    locateArr.forEach((loc, index) => {
      const { address } = loc;
      const preParse = {};

      const {
        response: {
          body: { items: item },
        },
      } = allResponse[index];

      item.item.forEach((data) => {
        const { fcstTime, category, fcstValue } = data;

        if (preParse[fcstTime]) {
          preParse[fcstTime][category] = fcstValue;
        } else {
          preParse[fcstTime] = { [category]: fcstValue };
        }
      });
      parseResult[address] = preParse;
    });
    return parseResult;
  }
}
