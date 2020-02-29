const Stats = require("./stats");

async function runTest(callback, iterations = 50) {
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
  constructor() {
    this.tests = [];
  }

  add(title, callback) {
    this.tests.push({
      title,
      callback
    });
  }

  async run() {
    if (!this.tests.length) {
      throw new Error("No tests have been defined!");
    }
    
    for (let test of this.tests) {
      let testResults = await runTest(test.callback);
      console.log(test.title, testResults.toString());
    }
  }
};
