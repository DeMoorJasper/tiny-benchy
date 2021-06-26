# Benchy

A tiny benchmarking utility that helps run benchmarks quickly.

Supports callback functions which return a promise.

## Usage

```js
const Benchmark = require("tiny-benchy");
const suite = new Benchmark();

suite.add("RegExp#test-async", async () => {
  /o/.test("Hello World!");
});

suite.add("RegExp#test", () => {
  /o/.test("Hello World!");
});

suite.run();
```

## Output

```
rank 1:  RegExp#test-async 1,033,057.85 opts/sec (mean: 968ns, stddev: 0.002ms, 50 samples)
rank 2:  RegExp#test 552,486.19 opts/sec (mean: 0.002ms, stddev: 0.005ms, 50 samples)
```

## API

```ts
declare class Benchmark {
  constructor(iterations?: number)
  add(title: string, callback: () => void | Promise<void>, iterations?: number): void
  run(): Promise<void>
}

export = Benchmark
```
