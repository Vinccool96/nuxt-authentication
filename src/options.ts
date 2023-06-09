import { ModuleOptions } from "@nuxt/schema"

import type { Strategy } from "./types"

export interface AuthModuleOptions extends ModuleOptions {
  plugins?: Array<string | { src: string; ssr: boolean }>
  ignoreExceptions?: boolean
  resetOnError?: boolean | ((...args: unknown[]) => boolean)
  defaultStrategy?: string
  watchLoggedIn?: boolean
  rewriteRedirects?: boolean
  fullPathRedirect?: boolean
  scopeKey?: string
  redirect: {
    login?: string
    logout?: string
    callback?: string
    home?: string
  }
  pinia?: {
    namespace?: string
  }
  cookie?:
    | {
        prefix?: string
        options?: {
          path?: string
          expires?: number | Date
          maxAge?: number
          domain?: string
          secure?: boolean
        }
      }
    | false
  localStorage?:
    | {
        prefix: string
      }
    | false
  strategies?: {
    [strategy: string]: Partial<Strategy>
  }
}

export const moduleDefaults: AuthModuleOptions = {
  //  -- Error handling --

  resetOnError: false,

  ignoreExceptions: false,

  // -- Authorization --

  scopeKey: "scope",

  // -- Redirects --

  rewriteRedirects: true,

  fullPathRedirect: false,

  watchLoggedIn: true,

  redirect: {
    login: "/login",
    logout: "/",
    home: "/",
    callback: "/login",
  },

  //  -- Vuex Store --

  pinia: {
    namespace: "auth",
  },

  // -- Cookie Store --

  cookie: {
    prefix: "auth.",
    options: {
      path: "/",
    },
  },

  // -- localStorage Store --

  localStorage: {
    prefix: "auth.",
  },

  // -- Strategies --

  defaultStrategy: "",

  strategies: {},
}

export interface FilledAuthModuleOptions extends AuthModuleOptions {
  ignoreExceptions: boolean
  resetOnError: boolean | ((...args: unknown[]) => boolean)
  defaultStrategy: string
  watchLoggedIn: boolean
  rewriteRedirects: boolean
  fullPathRedirect: boolean
  scopeKey: string
  redirect: {
    login?: string
    logout?: string
    callback?: string
    home?: string
  }
  pinia: {
    namespace: string
  }
  cookie:
    | {
        prefix: string
        options: {
          path: string
          expires?: number | Date
          maxAge?: number
          domain?: string
          secure?: boolean
        }
      }
    | false
  localStorage:
    | {
        prefix: string
      }
    | false
  strategies: {
    [strategy: string]: Strategy
  }
}
