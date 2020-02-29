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
    if (!this.tests.length) {
      throw new Error("No tests have been defined!");
    }

    for (let test of this.tests) {
      let testResults = await runTest(test.callback, test.iterations);
      console.log(test.title, testResults.toString());
    }
  }
};
