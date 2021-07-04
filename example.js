const { Benchmark } = require("./");

const suite = new Benchmark({
  iterations: 500,
});

suite.add("RegExp#test-async", async () => {
  /o/.test("Hello World!");
});

suite.add("RegExp#test", () => {
  /o/.test("Hello World!");
});

suite.add(
  "RegExp#setup-test",
  (input) => {
    input.test("Hello World!");
  },
  {
    setup: async () => {
      return /o/;
    },
    iterations: 1000,
  }
);

suite.run();
