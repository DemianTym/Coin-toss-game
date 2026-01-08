export type CoinResult = "heads" | "tails"

export function tossCoin(): Promise<{ result: CoinResult }> {
  return new Promise((resolve) => {
    const result: CoinResult = Math.random() < 0.5 ? "heads" : "tails"

    const delay = 500 + Math.random() * 1000

    setTimeout(() => {
      resolve({ result })
    }, delay)
  })
}