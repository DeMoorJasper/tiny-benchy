const round = (val, points = 3) => {
  return Math.round(val * 10 ** points) / 10 ** points;
};

const formatTime = val => {
  let res = val * 1e6;

  if (res < 1000) {
    return `${round(res)}ns`;
  }
  res = res / 1e6;

  if (res < 1000) {
    return `${round(res)}ms`;
  }
  res = res / 1000;

  return `${round(res)}secs`;
};

module.exports = class Stats {
  constructor() {
    this.xs = [];
    this.x0 = this.x1 = this.x2 = 0;
  }

  add(x) {
    this.xs.push(x);
    this.x0 += 1;
    this.x1 += x;
    this.x2 += x * x;
  }

  samples() {
    return this.x0;
  }

  total() {
    return this.x1;
  }

  mean() {
    return this.x1 / this.x0;
  }

  stddev() {
    return Math.sqrt(this.x0 * this.x2 - this.x1 * this.x1) / (this.x0 - 1);
  }

  opsPerSec() {
    return 1e3 / this.mean();
  }

  toString() {
    return `${round(this.opsPerSec(), 2).toLocaleString()} opts/sec (mean: ${formatTime(
      this.mean()
    )}, stddev: ${formatTime(this.stddev())}, ${this.samples().toLocaleString()} samples)`;
  }
};
