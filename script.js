/* HDD 스케줄링 */

const test = (algorithm) => {
  const req = [99, 184, 36, 123, 15, 125, 66, 68];
  const current = 54;
  const totalDistance = algorithm(req, current);
  console.log(`${algorithm.name}의 전체 이동 거리는 ${totalDistance}`);
};

/* First Come First Serve */
const FCFS = (req, current) => {
  let _current = current;
  let distance = 0;
  for (let idx = 0; idx < req.length; idx += 1) {
    const target = req[idx];
    distance += Math.abs(target - _current);
    _current = target;
  }
  return distance;
};

/* Shortest Seek Time First */

const SSTF = (req, current) => {
  let _current = current;
  let distance = 0;

  while (req.length !== 0) {
    let short = { idx: 0, dist: Infinity };
    req.forEach((target, idx) => {
      const dist = Math.abs(_current - target);
      if (dist < short.dist) {
        short = { idx, dist };
      }
    });
    console.log(_current, req[short.idx]);
    _current = req[short.idx];
    distance += short.dist;
    req.splice(short.idx, 1);
  }

  return distance;
};

test(FCFS);
test(SSTF);
