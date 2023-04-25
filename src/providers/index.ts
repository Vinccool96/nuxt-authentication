import { auth0, Auth0ProviderOptions } from "./auth0"
import { discord, DiscordProviderOptions } from "./discord"
import { facebook, FacebookProviderOptions } from "./facebook"
import { github, GithubProviderOptions } from "./github"
import { google, GoogleProviderOptions } from "./google"
import { laravelJWT, LaravelJWTProviderOptions } from "./laravel-jwt"
import {
  laravelPassport,
  LaravelPassportPasswordProviderOptions,
  LaravelPassportProviderOptions,
  PartialPassportOptions,
  PartialPassportPasswordOptions,
} from "./laravel-passport"
import { laravelSanctum, LaravelSanctumProviderOptions } from "./laravel-sanctum"

const exported = {
  auth0,
  discord,
  github,
  google,
  laravelJWT,
  laravelPassport,
  laravelSanctum,
}

export type {
  Auth0ProviderOptions,
  DiscordProviderOptions,
  FacebookProviderOptions,
  GithubProviderOptions,
  GoogleProviderOptions,
  LaravelJWTProviderOptions,
  LaravelPassportPasswordProviderOptions,
  LaravelPassportProviderOptions,
  PartialPassportOptions,
  PartialPassportPasswordOptions,
  LaravelSanctumProviderOptions,
}

export { auth0, discord, facebook, github, google, laravelJWT, laravelPassport, laravelSanctum }

export default exported

export const ProviderAliases = {
  "laravel/jwt": "laravelJWT",
  "laravel/passport": "laravelPassport",
  "laravel/sanctum": "laravelSanctum",
}
