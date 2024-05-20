# bob.obringer.net

This is the source code for my personal website, [bob.obringer.net](https://bob.obringer.net).

## Notes

### ChromaDB

Requires some configuration to work with nextjs. This won't work with turbopack:

https://stackoverflow.com/questions/78132142/cant-integrate-nextjs-with-chromadb

```typescript
const nextConfig = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Fixes npm packages that depend on `fs` module
      config.resolve.fallback.fs = false;
    }

    config.module.rules.push({
      test: /\.node$/,
      use: "node-loader",
    });

    return config;
  },
};
```

```bash
pnpm install openai @xenova/transformers
```

## TODO

CI Runs way too much, including on ci automated prs. Need to fix this.
