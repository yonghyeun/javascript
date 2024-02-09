let start, timeDiff;
let startTime;

const step = (timeStamp) => {
  if (!start) {
    start = timeStamp;
    startTime = new Date();
  }
  timeDiff = timeStamp - start;
  console.log(start, timeStamp, timeDiff);

  if (timeDiff > 5000) {
    const endTime = new Date();
    window.cancelAnimationFrame(step);
    console.log(endTime - startTime);
  } else window.requestAnimationFrame(step);
};

window.requestAnimationFrame(step);
