export function now(): number {
  if (typeof window === "object" && "performance" in window) {
    return Math.round(performance.now() * 1e9);
  } else {
    // Should be fine?
    return Number(process.hrtime.bigint());
  }
}
