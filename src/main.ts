import { Stats } from "./stats";
import { now } from "./performance";

async function runTest(callback, iterations) {
  let stats = new Stats();

  for (let i = 0; i < iterations; i++) {
    const start = now();
    await callback();
    stats.add(now() - start);
  }

  return stats;
}

type TestCallback = (setupValues: any) => Promise<any> | any;
type SetupFn = () => Promise<any> | any;

interface ITest {
  title: string;
  callback: TestCallback;
  setup?: SetupFn | null;
  iterations: number;
}

export class Benchmark {
  iterations: number;
  tests: Array<ITest>;

  constructor(iterations = 50) {
    this.tests = [];
    this.iterations = iterations;
  }

  add(
    title: string,
    callback: TestCallback,
    iterations?: number | null,
    setup?: SetupFn | null
  ) {
    this.tests.push({
      title,
      callback,
      setup,
      iterations: iterations ?? this.iterations,
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

    const sortedTestResultsArray = testResultsArray.sort(
      (test1, test2) => test2.opsPerSec() - test1.opsPerSec()
    );

    for (let iRank = 0; iRank < testNum; ++iRank) {
      const iTest = sortedTestResultsArray.indexOf(testResultsArray[iRank]);
      console.log(
        `rank ${iRank + 1}: `,
        this.tests[iTest].title,
        sortedTestResultsArray[iTest].toString()
      );
    }
  }
}

export default Benchmark;
