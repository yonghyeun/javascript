const APIKEY =
  'Jwxgv8BQexpONepfrXnbs1PdxJ35yKLwEEW0bTK4QpCwdpecz/5tqkdCYp5rjomx8BzXWmSJLwvpuYYk1msbmw==';

fetch(`http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtNcst
?serviceKey=${APIKEY}&numOfRows=10&pageNo=1&dataType=JSON
&base_date=20240115&base_time=0600&nx=55&ny=127
`)
  .then((res) => {
    console.log(res);
    return res;
  })
  .then((res) => res.json())
  .then(console.log)
  .catch(console.error);
