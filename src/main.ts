import { Stats } from "./stats";
import { now } from "./performance";

type TestCallback = (setupValues: any) => Promise<any> | any;
type SetupFn = () => Promise<any> | any;

async function runTest(
  callback,
  opts: { iterations: number; setup?: SetupFn | null }
) {
  const { iterations, setup } = opts;
  const stats = new Stats();
  for (let i = 0; i < iterations; i++) {
    const input = setup ? await setup() : null;
    const start = now();
    await callback(input);
    stats.add(now() - start);
  }
  return stats;
}

interface ITest {
  title: string;
  callback: TestCallback;
  setup?: SetupFn | null;
  iterations: number;
}

interface IResult {
  title: string;
  stats: Stats;
}

export class Benchmark {
  iterations: number;
  tests: Array<ITest>;

  constructor(opts: { iterations: number }) {
    const { iterations = 50 } = opts;
    this.tests = [];
    this.iterations = iterations;
  }

  add(
    title: string,
    callback: TestCallback,
    opts: {
      iterations?: number | null;
      setup?: SetupFn | null;
    } = {}
  ) {
    const { setup, iterations } = opts;
    this.tests.push({
      title,
      callback,
      setup,
      iterations: iterations ?? this.iterations,
    });
  }

  async run(): Promise<Array<IResult>> {
    const testNum = this.tests.length;
    if (!testNum) {
      throw new Error("No tests defined");
    }

    const testResultsArray = new Array(testNum);
    for (let iTest = 0; iTest < testNum; ++iTest) {
      const test = this.tests[iTest];
      const testResult = await runTest(test.callback, {
        setup: test.setup,
        iterations: test.iterations,
      });
      testResultsArray[iTest] = testResult;
    }

    const mappedResults: Array<IResult> = testResultsArray.map(
      (value, index) => {
        return {
          title: this.tests[index].title,
          stats: value,
        };
      }
    );

    for (let result of mappedResults) {
      console.log(`${result.title}: ${result.stats.toString()}`);
    }

    return;
  }
}
