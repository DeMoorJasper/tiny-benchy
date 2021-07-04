// Based on https://github.com/bestiejs/benchmark.js

/**
 * T-Distribution two-tailed critical values for 95% confidence.
 * For more info see http://www.itl.nist.gov/div898/handbook/eda/section3/eda3672.htm.
 */
const tTable = {
  "1": 12.706,
  "2": 4.303,
  "3": 3.182,
  "4": 2.776,
  "5": 2.571,
  "6": 2.447,
  "7": 2.365,
  "8": 2.306,
  "9": 2.262,
  "10": 2.228,
  "11": 2.201,
  "12": 2.179,
  "13": 2.16,
  "14": 2.145,
  "15": 2.131,
  "16": 2.12,
  "17": 2.11,
  "18": 2.101,
  "19": 2.093,
  "20": 2.086,
  "21": 2.08,
  "22": 2.074,
  "23": 2.069,
  "24": 2.064,
  "25": 2.06,
  "26": 2.056,
  "27": 2.052,
  "28": 2.048,
  "29": 2.045,
  "30": 2.042,
  infinity: 1.96,
};

export const round = (val, points = 3) => {
  return Math.round(val * 10 ** points) / 10 ** points;
};

export const formatTime = (val) => {
  let res = val;

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

export class Stats {
  timings: Array<number>;
  sampleCount: number;
  totalDuration: number;
  x2: number;

  constructor() {
    this.timings = [];
    this.sampleCount = 0;
    this.totalDuration = 0;
    this.x2 = 0;
  }

  add(timing: number) {
    this.timings.push(timing);
    this.sampleCount += 1;
    this.totalDuration += timing;
    this.x2 += timing * timing;
  }

  samples() {
    return this.sampleCount;
  }

  total() {
    return this.totalDuration;
  }

  // Compute the sample mean (estimate of the population mean).
  mean() {
    return this.totalDuration / this.sampleCount;
  }

  // Compute the sample variance (estimate of the population variance).
  variance() {
    const mean = this.mean();
    const sqDiff = this.timings.reduce((acc, timing) => {
      return acc + (timing - mean) * (timing - mean);
    }, 0);
    return sqDiff / this.sampleCount;
  }

  // Compute the sample standard deviation (estimate of the population standard deviation).
  stddev() {
    return Math.sqrt(this.variance());
  }

  // Compute the standard error of the mean (a.k.a. the standard deviation of the sampling distribution of the sample mean).
  stdErrorMean() {
    return this.stddev() / Math.sqrt(this.sampleCount);
  }

  // Compute the degrees of freedom.
  degreeFreedom() {
    return this.sampleCount - 1;
  }

  // Compute the critical value.
  critical() {
    return tTable[Math.round(this.degreeFreedom()) || 1] || tTable.infinity;
  }

  // Compute the margin of error.
  marginOfError() {
    return this.stdErrorMean() * this.critical();
  }

  // Compute the relative margin of error.
  relativeMarginOfError() {
    return (this.marginOfError() / this.mean()) * 100 || 0;
  }

  // Compute operations per second based on mean
  opsPerSec() {
    return 1e9 / this.mean();
  }

  toString() {
    return `${Math.round(
      this.opsPerSec()
    ).toLocaleString()} opts/sec, ±${this.relativeMarginOfError().toPrecision(
      2
    )}% (mean: ${formatTime(this.mean())}, stddev: ${formatTime(
      this.stddev()
    )}, ${this.samples().toLocaleString()} samples)`;
  }
}
