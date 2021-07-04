const Stats = require("./stats");

const performance = (typeof window === "object" && "performance" in window) ? window.performance : require("perf_hooks").performance

async function runTest(callback, iterations) {
  let stats = new Stats();

  for (let i = 0; i < iterations; i++) {
    const start = performance.now();
    await callback();
    const end = performance.now();
    stats.add(end - start);
  }

  return stats;
}

module.exports = class Benchmark {
  constructor(iterations = 50) {
    this.tests = [];
    this.iterations = iterations;
  }

  add(title, callback, iterations = this.iterations) {
    this.tests.push({
      title,
      callback,
      iterations
    });
  }

  async run() {
    const testNum = this.tests.length;
    if (!testNum) {
      throw new Error("No tests have been defined!");
    }

    const testResultsArray = new Array(testNum);
    for (let iTest = 0; iTest < testNum; ++iTest) {
      const test = this.tests[iTest];
      const testResult = await runTest(test.callback, test.iterations);
      testResultsArray[iTest] = testResult;
    }

    const sotredTestResultsArray = testResultsArray.sort((test1, test2) => test2.opsPerSec() - test1.opsPerSec());

    for (let iRank = 0; iRank < testNum; ++iRank) {
      const iTest = sotredTestResultsArray.indexOf(testResultsArray[iRank]);
      console.log(`rank ${iRank+1}: `, this.tests[iTest].title, sotredTestResultsArray[iTest].toString());
    }
  }
};
