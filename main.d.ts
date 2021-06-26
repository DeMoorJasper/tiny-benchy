declare class Benchmark {
  constructor(iterations?: number)
  add(title: string, callback: () => void | Promise<void>, iterations?: number): void
  run(): Promise<void>
}

export = Benchmark
