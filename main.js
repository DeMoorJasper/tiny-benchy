const Stats = require("./stats");

async function runTest(callback, iterations) {
  let stats = new Stats();

  for (let i = 0; i < iterations; i++) {
    let start = process.hrtime();
    await callback();
    let took = process.hrtime(start);
    stats.add(took[0] * 1e9 + took[1]);
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
