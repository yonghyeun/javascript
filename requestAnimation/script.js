class Recorder {
  constructor(startTime) {
    this.startTime = startTime;
    this.intervalList = [];
    this.timeList = [];
  }

  setTimeline(curTime, lastTime) {
    const { startTime, intervalList, timeList } = this;
    intervalList.push(curTime - lastTime); // 이전 호출과의 간격
    timeList.push(curTime - startTime); // 시작부터의 간격 , 선형적일 수록 타임라인이 일정한 호출
  }

  generateResult(curTime) {
    const { startTime, intervalList } = this;
    const { length } = intervalList;

    const totalInterval = intervalList.reduce((pre, cur) => pre + cur);

    this.result = {
      maxInterval: Math.max(...intervalList.slice(1)),
      minInterval: Math.min(...intervalList.slice(1)),
      avrageInterval: totalInterval / length,
      elapseTime: curTime - startTime,
      averageFrame: Math.round(1000 / (totalInterval / length)),
    };
    return this.result;
  }
}

const repaintNode = (nodeInfo) => {
  const needStop = nodeInfo.size >= nodeInfo.maxWidth;
  nodeInfo.node.style.width = `${nodeInfo.size}px`;
  nodeInfo.size += 1;

  return needStop;
};

const setIntervalFunc = (nodeInfo) => {
  const DELAY = 1000 / 60;
  const startTime = new Date().getTime();
  const params = {
    startTime,
    lastTime: startTime,
    recorder: new Recorder(startTime),
  };

  const timer = setInterval(() => {
    const { recorder, lastTime } = params;
    const curTime = new Date().getTime();

    recorder.setTimeline(curTime, lastTime); // 타임라인 기록
    const needStop = repaintNode(nodeInfo);
    if (needStop) {
      const result = recorder.generateResult(curTime);
      console.log('setInterval 의 애니메이션 테이블');
      console.table(result);

      clearInterval(timer);
    }

    params.lastTime = curTime;
  }, DELAY);
};

const setAnimationFunc = (nodeInfo) => {
  const startTime = new Date().getTime();
  const params = {
    startTime,
    lastTime: startTime,
    recorder: new Recorder(startTime),
  };

  const callbackFn = (timeStamp) => {
    const { recorder, lastTime } = params;
    const curTime = startTime + timeStamp;

    recorder.setTimeline(curTime, lastTime);
    const needStop = repaintNode(nodeInfo);
    if (needStop) {
      const result = recorder.generateResult(curTime);
      console.log('requestAnimation 의 애니메이션 테이블');
      console.table(result);

      return;
    }
    params.lastTime = curTime;
    requestAnimationFrame(callbackFn);
  };
  requestAnimationFrame(callbackFn);
};

const $button = document.querySelector('button');
const $interval = document.querySelector('.interval');
const $animation = document.querySelector('.animation');
const $body = document.querySelector('body');
const maxWidth = $body.clientWidth;

const intervalInfo = {
  size: $interval.clientWidth,
  node: $interval,
  maxWidth,
};

const animationInfo = {
  size: $animation.clientWidth,
  node: $animation,
  maxWidth,
};

$button.addEventListener('click', () => {
  setIntervalFunc(intervalInfo);
  setAnimationFunc(animationInfo);
});
