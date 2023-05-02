import { ResolvePathOptions } from "@nuxt/kit"

import { Plugin } from "nuxt/app"

export type RecursivePartial<T> = {
  [P in keyof T]?: T[P] extends (infer U)[] ? RecursivePartial<U>[] : RecursivePartial<T[P]>
}

export type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K]
}

export type PartialExcept<T, K extends keyof T> = RecursivePartial<T> & Pick<T, K>

export interface Resolver {
  resolve(...path: string[]): string
  resolvePath(path: string, opts?: ResolvePathOptions): Promise<string>
}

export type ElementOf<T extends Array<unknown>> = T extends Array<infer E> ? E : never

export function isArray<T>(obj: Array<T> | T): obj is Array<T> {
  return Array.isArray(obj)
}

export type RealNuxtApp = Parameters<Plugin>[0]
