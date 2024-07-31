# Blog app example

## Features
- Typesafe router based on effector
- HMR on the server and the client
- Fast SSR server based on hono.js using Stream API
- Data pre-fetching to minimize request waterfalls
- Custom Dependency Injection framework
- Server-side generation


## Stack
- package manager: `pnpm`
- client framework: `React`
- component library: `chakra-ui (v3 alpha)`
- client routing: custom implementation`@n2m/@router`
- SSR framework: custom implementation `@n2m/renderer`
- server runtime: `node`
- server framework: main server on`hono.js` and `express` for `PayloadCMS`
- CMS system: `PayloadCMS`
- state management: `effector`
- data fetching: `farfetched` - effector based data fetching library
- metatag management - custom wrapper over `unhead` `@n2m/plugin-unhead`

---
## Job Test Assignment (31.06.2024)
This example app is also used as a test assignment for me, the interview candidate.

### This example meets the requirements of the task; however, it uses some custom tools instead of the recommended ones to fulfill the goals of the current repository.

Comments on the task:
According to the assignment, it was necessary to use Next.js and implement the following key requirements:

1. Server-Side Rendering - if we had used Next.js, the task would have been completed instantly, as SSR is built into Next.js out of the box; here, we are using a custom SSR server based on Vite and Hono.js.

2. Routing - Next.js already includes a file-based router out of the box; for this task, a custom router is used.

3. API for Articles - PayloadCMS is used as recommended in the assignment.

4. Comment Functionality - implemented based on PayloadCMS.

5. Styling - Using Chakra UI v3, an alpha version, for experimentation.

6. Image Handling - since we are not using Next.js, we have to implement this ourselves:
   - image compression is handled on the server side using Hono.js
   - .webp format - not implemented (TODO)
7. SEO Optimization - for managing meta tags, we use our own implementation on top of unhead.js.

8. Headless CMS - using PayloadCMS.



## Usage

All of these commands are expecting you to be in the root of this repo

### Install dependencies
```bash
pnpm install
```

### build dependent packages
```bash
pnpm run packages:build
```

### run example blog-app in development mode
```bash
pnpm run blog:dev
```

### build
```bash
pnpm run blog:build
```
