import { existsSync } from "fs"
import { ProviderFunction, Resolver } from "./types"

import { Nuxt } from "@nuxt/schema"
import hash from "hasha"

import AUTH_PROVIDERS, { ProviderAliases } from "./providers"
import type { AuthModuleOptions } from "./options"
import type { Strategy } from "./types"

const BuiltinSchemes = {
  local: "LocalScheme",
  cookie: "CookieScheme",
  oauth2: "Oauth2Scheme",
  openIDConnect: "OpenIDConnectScheme",
  refresh: "RefreshScheme",
  laravelJWT: "LaravelJWTScheme",
  auth0: "Auth0Scheme",
}

export interface ImportOptions {
  name: string
  as: string
  from: string
}

export function resolveStrategies(
  nuxt: Nuxt,
  options: AuthModuleOptions,
  resolver: Resolver
): { strategies: Strategy[]; strategyScheme: Record<string, ImportOptions> } {
  const strategies: Strategy[] = []
  const strategyScheme = {} as Record<string, ImportOptions>

  for (const name of Object.keys(options.strategies)) {
    if (!options.strategies[name] || !options.strategies[name].enabled) {
      continue
    }

    // Clone strategy
    const strategy: Strategy = Object.assign({}, options.strategies[name])

    // Default name
    if (!strategy.name) {
      strategy.name = name
    }

    // Default provider (same as name)
    if (!strategy.provider) {
      strategy.provider = strategy.name
    }

    // Try to resolve provider
    const provider: ProviderFunction = resolveProvider(nuxt, strategy.provider)
    delete strategy.provider

    if (typeof provider === "function") {
      provider(nuxt, strategy)
    }

    // Default scheme (same as name)
    if (!strategy.scheme) {
      strategy.scheme = strategy.name
    }

    // Resolve and keep scheme needed for strategy
    const schemeImport = resolveScheme(nuxt, strategy.scheme, resolver)
    // @ts-ignore
    delete strategy.scheme
    strategyScheme[strategy.name] = schemeImport

    // Add strategy to array
    strategies.push(strategy)
  }

  return {
    strategies,
    strategyScheme,
  }
}

type builtinSchemesStrings = keyof typeof BuiltinSchemes

const builtinSchemes = Object.keys(BuiltinSchemes)

function isBuiltinScheme(scheme: string): scheme is builtinSchemesStrings {
  return builtinSchemes.includes(scheme)
}

export function resolveScheme(nuxt: Nuxt, scheme: string, resolver: Resolver): ImportOptions {
  if (isBuiltinScheme(scheme)) {
    const bs = BuiltinSchemes[scheme]

    return {
      name: bs,
      as: bs,
      from: "~auth/runtime",
    }
  }

  const path = resolver.resolve(scheme)
  if (existsSync(path)) {
    const _path = path.replace(/\\/g, "/")
    return {
      name: "default",
      as: "Scheme$" + hash(_path).substring(0, 4),
      from: _path,
    }
  }

  throw ReferenceError("scheme doesn't exist")
}

type providerAliasStrings = keyof typeof ProviderAliases

const providerAliases = Object.keys(ProviderAliases)

function isProviderAlias(provider: string): provider is providerAliasStrings {
  return providerAliases.includes(provider)
}

type authProviderStrings = keyof typeof AUTH_PROVIDERS

const authProviders = Object.keys(AUTH_PROVIDERS).filter((key) => key === "ProviderAliases")

function isBuiltinAuthProvider(provider: string): provider is authProviderStrings {
  return authProviders.includes(provider)
}

export function resolveProvider(nuxt: Nuxt, provider: string | ProviderFunction): ProviderFunction {
  if (typeof provider === "function") {
    return provider
  }

  provider = isProviderAlias(provider) ? ProviderAliases[provider] : provider

  if (isBuiltinAuthProvider(provider)) {
    return AUTH_PROVIDERS[provider]
  }

  try {
    const m = nuxt.resolver.requireModule(provider, { useESM: true })
    return m.default || m
  } catch (e) {
    // TODO: Check if e.code is not file not found, throw an error (can be parse error)
    // Ignore
    throw Error()
  }
}
