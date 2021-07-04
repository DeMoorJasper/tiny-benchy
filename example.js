const { Benchmark } = require("./");

const suite = new Benchmark();

suite.add("RegExp#test-async", async () => {
  /o/.test("Hello World!");
});

suite.add("RegExp#test", () => {
  /o/.test("Hello World!");
});

suite.run();
