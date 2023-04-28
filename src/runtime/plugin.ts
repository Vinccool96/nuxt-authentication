import { defineNuxtPlugin } from "#app"

import Middleware from "./middleware"
import { Auth, authMiddleware, ExpiredAuthSessionError } from "~auth/runtime"
import { ImportOptions } from "~auth/resolve"

const a = ``

// Active schemes
<%= options.schemeImports
  .map((i: ImportOptions) => `import { ${i.name}${i.name !== i.as ? " as " + i.as : ""} } from "${i.from}"`)
  .join("\n")%>

declare module "#app" {
  interface NuxtApp {
    $auth: Auth
  }
}
declare module "vue" {
  interface ComponentCustomProperties {
    $auth: Auth
  }
}
declare module "@vue/runtime-core" {
  interface ComponentCustomProperties {
    $auth: Auth
  }
}

export default defineNuxtPlugin((nuxtApp) => {
  const options = <%= JSON.stringify(options.options, null, 2) %>
  const options = {}

  // Create a new Auth instance
  const $auth = new Auth(nuxtApp, options)

  // Register strategies
  <%= options.strategies
    .map((strategy) => {
      const scheme = options.strategyScheme[strategy.name]
      const schemeOptions = JSON.stringify(strategy, null, 2)
      return `// ${strategy.name}\n  $auth.registerStrategy('${strategy.name}', new ${scheme.as}($auth, ${schemeOptions}))`
    })
    .join("\n\n  ") %>

  nuxtApp.provide("auth", $auth)

  return $auth.init().catch((error: Error) => {
    if (process.client) {
      // Don't console log expired auth session errors. This error is common, and expected to happen.
      // The error happens whenever the user does an ssr request (reload/initial navigation) with an expired refresh
      // token. We don't want to log this as an error.
      if (error instanceof ExpiredAuthSessionError) {
        return
      }

      console.error("[ERROR] [AUTH]", error)
    }
  })
})
