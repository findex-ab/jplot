
import { clamp } from '../math/clamp';

export const range = (n: number): number[] => Array.from(Array(n).keys())

type RoundingFunction = (n: number) => number;

export const remapToIndex = (n: number, nMin: number, nMax: number, arrLength: number, rounding: RoundingFunction = Math.round) => {
  return clamp(rounding((n / nMax) * (arrLength-1)), 0, arrLength-1)
}


export const uniqueBy = <T, KV = string>(arr: T[], key: string | ((item: T) => KV)): T[] => {
  const nextArr: T[] = []

  try {
    const getId = (item: T, k: string | ((item: T) => KV)): any => {
      return typeof k === 'string' ? item[k as keyof T] : k(item)
    }
    for (const item of arr) {
      const id = getId(item, key)
      const count = nextArr.filter((it) => getId(it, key) === id).length
      if (count > 0) continue
      nextArr.push(item)
    }
  } catch (e) {
    console.error('uniqueBy() failed.')
    console.error(e)
  }

  return nextArr
}

export const unique = <T>(arr: T[]): T[] => [...Array.from(new Set(arr))] as T[]
