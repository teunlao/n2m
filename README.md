# 👋N2M
GOODBYE NEXT, HELLO MESS :)

# Introduction

**N2M** is a modular meta-framework designed to be flexible and versatile, reducing the amount of "magic" and limitations present in other meta-frameworks like Next.js or Nuxt.js. It is framework-agnostic and can be used with various libraries such as React, Vue, and Solid. Currently, implementations for Vue and Solid are under active development.

The primary goal of N2M is to provide a high-level tool for creating complex modular and universal applications with server-side rendering (SSR), requiring a high degree of abstraction and control over complexity.

This meta-framework includes:

- SSR (Server-Side Rendering) implementation based on Vite.
- - Support for Server-Side Generation (pre-rendering).
- A modular system for managing complexity, with customization options and a simplified testing process.
- A plugin system for extending functionality.
- Direct integration with Effector.js for state management.
- A dependency injection framework.
- A custom routing system base on Effector.
- And many other useful tools and utilities.


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

## TODO