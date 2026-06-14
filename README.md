# l2assessment
some changes to (https://github.com/jimenezatmit/l2assessment

## GitHub Pages Deployment

This project is built with Vite. When deploying to GitHub Pages the `base` path must match the repository name so assets load correctly. The repo is configured with `base: '/l2assessment/'` in `vite.config.js`.

To publish to GitHub Pages from this repository root, build and push the `dist` output to a `gh-pages` branch or use a deployment action. Example (locally):

```bash
npm run build
# deploy using the gh-pages package (install first: npm i -D gh-pages)
npx gh-pages -d dist
```

Or enable GitHub Pages in the repository settings and set the source to the `gh-pages` branch after pushing.
