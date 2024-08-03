# 👋N2M

# Introduction

**N2M** is a another one meta-framework, but designed to be modular, flexible and versatile, reducing the amount of "magic" and limitations present in other meta-frameworks like Next.js or Nuxt.js. It is framework-agnostic and can be used with various libraries such as React, Vue, and Solid.

The primary goal of N2M is to provide a high-level tool for creating modular and universal applications with server-side rendering (SSR), requiring a high degree of abstraction and control over complexity.

###  **Note:** This is a pre-alpha version and is not recommended for use in production environments.

This framework includes:

- SSR (Server-Side Rendering) implementation based on Vite.
- Support for Server-Side Generation (pre-rendering).
- A modular system for managing complexity
- A plugin system for extending functionality.
- A dependency injection framework.
- Integration with Effector.js for state management.
- A custom routing system based on Effector.


#### Install dependencies
```bash
pnpm install
```

#### build dependent packages
```bash
pnpm run packages:build
```

#### clean and reinstall all dependencies
```bash
pnpm refresh
```

#### run example blog-app
```bash
pnpm run blog:dev
```

#### run with debug
```bash
pnpm run blog:debug
```


## TODO
