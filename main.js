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
    if (!this.tests.length) {
      throw new Error("No tests have been defined!");
    }

    for (let test of this.tests) {
      let testResults = await runTest(test.callback, test.iterations);
      console.log(test.title, testResults.toString());
    }
  }
};
