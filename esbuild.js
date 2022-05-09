"use strict";

// see: https://github.com/evanw/esbuild/issues/566


const externalCjsToEsmPlugin = external => ({
  name: 'external',
  setup(build) {
    let escape = text => `^${text.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')}$`
    let filter = new RegExp(external.map(escape).join('|'))
    build.onResolve({filter: /.*/, namespace: 'external'}, args => ({
      path: args.path, external: true
    }))
    build.onResolve({filter}, args => ({
      path: args.path, namespace: 'external'
    }))
    build.onLoad({filter: /.*/, namespace: 'external'}, args => ({
      contents: `export * from ${JSON.stringify(args.path)}`
    }))
  },
})


require('esbuild').build({
  bundle: true,
  outdir: 'bundle',
  format: 'esm',
  target: 'es2017',
  entryPoints: ['./src/velocity.js'],
  plugins: [externalCjsToEsmPlugin(["whatever-quux"])],
})
