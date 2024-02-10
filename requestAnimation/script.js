const $button = document.querySelector('button');
const $interval = document.querySelector('.interval');
const $animation = document.querySelector('.animation');
const $body = document.querySelector('body');

const maxWidth = $body.clientWidth;
let intervalWidth = $interval.clientWidth;
let animationWidth = $animation.clientWidth;
const settingInterval = () => {
  const result = {
    startTime: new Date().getTime(),
  };
  const intervalList = [];
  const timeList = [];
  let curTime;
  let lastTime;

  const intervalFunc = setInterval(() => {
    const { startTime } = result;
    if (intervalWidth >= maxWidth) {
      result.averageInterval =
        intervalList.reduce((pre, cur) => pre + cur) / intervalList.length;
      result.maxInterval = Math.max(...intervalList.slice(1));
      result.minInterval = Math.min(...intervalList.slice(1));
      console.log('setInterval의 결과 테이블');
      console.table(result);

      clearInterval(intervalFunc);
    }

    curTime = new Date().getTime();
    if (!lastTime) lastTime = curTime;

    intervalWidth += 1;
    $interval.style.width = `${intervalWidth}px`;

    intervalList.push(curTime - lastTime);

    timeList.push(curTime - startTime);
    lastTime = curTime;
  }, 1000 / 60);
};

const settingRequestAnimation = () => {
  const intervalList = [];
  const timeList = [];
  const result = {
    startTime: undefined,
  };
  let curTime;
  let lastTime;
  const animationFunc = (timeStamp) => {
    if (animationWidth >= maxWidth) {
      result.averageInterval =
        intervalList.reduce((pre, cur) => pre + cur) / intervalList.length;
      result.maxInterval = Math.max(...intervalList.slice(1));
      result.minInterval = Math.min(...intervalList.slice(1));
      console.log('requestAnimaionFrame의 결과 테이블');
      console.table(result);

      return;
    }

    if (!result.startTime) result.startTime = timeStamp;
    curTime = timeStamp;
    if (!lastTime) lastTime = curTime;

    animationWidth += 1;
    $animation.style.width = `${animationWidth}px`;

    intervalList.push(curTime - lastTime);
    timeList.push(curTime);
    lastTime = curTime;
    requestAnimationFrame(animationFunc);
  };

  requestAnimationFrame(animationFunc);
};

$button.addEventListener('click', () => {
  settingInterval();
  settingRequestAnimation();
});
