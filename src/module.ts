import { addPlugin, addPluginTemplate, createResolver, defineNuxtModule, addImports } from "@nuxt/kit"

import { Nuxt } from "@nuxt/schema"

import { AuthModuleOptions, FilledAuthModuleOptions, moduleDefaults } from "./options"
import { resolveStrategies } from "./resolve"
import { resolve } from "path"

export default defineNuxtModule<AuthModuleOptions>({
  meta: {
    name: "nuxt-authentication",
    configKey: "authentication",
  },
  // Default configuration options of the Nuxt module
  defaults: moduleDefaults,
  setup(options, nuxt: Nuxt) {
    const realOptions = options as FilledAuthModuleOptions
    const resolver = createResolver(import.meta.url)
    // Resolve strategies
    const { strategies, strategyScheme } = resolveStrategies(nuxt, realOptions, resolver)
    // @ts-ignore
    delete options.strategies

    const _uniqueImports = new Set<string>()
    const schemeImports = Object.values(strategyScheme).filter((i) => {
      if (_uniqueImports.has(i.as)) return false
      _uniqueImports.add(i.as)
      return true
    })

    options.defaultStrategy = options.defaultStrategy || strategies.length ? strategies[0].name : ""

    addPluginTemplate({
      src: resolver.resolve("./added/templates/plugin.ts"),
      filename: "auth.ts",
      options: {
        options,
        strategies,
        strategyScheme,
        schemeImports,
      },
    })

    // Extend auth with plugins
    if (options.plugins) {
      for (const plugin of options.plugins) {
        addPlugin(plugin)
      }
      delete options.plugins
    }

    const runtime = resolve(__dirname, "runtime")
    nuxt.options.alias["~auth/runtime"] = runtime
    nuxt.options.build.transpile.push(__dirname)

    // Transpile nanoid (used for oauth2) for IE11 support (#472)
    nuxt.options.build.transpile.push(/^nanoid/)
  },
})
