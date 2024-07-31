declare module 'virtual:n2m-routes' {
  // eslint-disable-next-line @typescript-eslint/consistent-type-imports
  const routes: import('./router.ts').RouteInfo[]
  export default routes
}

declare module 'virtual:n2m-manifest' {
  // eslint-disable-next-line @typescript-eslint/consistent-type-imports
  const ssrManifest: import('./helpers/routes.ts').SSRManifest
  export default ssrManifest
}
