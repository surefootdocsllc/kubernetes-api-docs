// https://github.com/pnpm/pnpm/issues/4378#issuecomment-1074586535
// pnpm i -F ./packages/foo --virtual-store-dir packages/foo/node_modules/.pnpm
module.exports = {
  hooks: {
    readPackage (pkg) {
      pkg.dependenciesMeta = pkg.dependenciesMeta || {}
      for (const [depName, depVersion] of Object.entries(pkg.dependencies)) {
        if (depVersion.startsWith('workspace:')) {
          pkg.dependenciesMeta[depName] = {
            injected: true
          }
        }
      }
      return pkg
    }
  }
}
