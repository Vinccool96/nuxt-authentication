import { defineNuxtPlugin } from "#app"

import Middleware from "./middleware"
import { Auth, authMiddleware, ExpiredAuthSessionError } from "~auth/runtime"
import { ImportOptions } from "../resolve"

// Active schemes
// options.schemeImports
//   .map((i: ImportOptions) => `import { ${i.name}${i.name !== i.as ? " as " + i.as : ""} } from "${i.from}"`)
//   .join("\n")

export default defineNuxtPlugin((nuxtApp) => {
  // const options = <%= JSON.stringify(options.options, null, 2) %>
  const options = {}

  // Create a new Auth instance
  const $auth = new Auth(nuxtApp, options)
})
