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

## Local AI API Server

This project includes a local backend API for AI analysis. It exposes `/api/analyze` and handles classification, urgency, sentiment, routing, and support recommendations.

### Run locally

1. Install dependencies:
```bash
npm install
```
2. Start the API server:
```bash
npm run api
```
3. In another terminal, start the frontend:
```bash
npm run dev
```

### Optional single command

If you want both frontend and API in one terminal, run:
```bash
npm run dev:all
```

### API usage

Send a POST request to `/api/analyze` with JSON:
```json
{ "message": "Your customer support text" }
```

The response includes classification, urgency, sentiment, recommended action, department, and a solution reference.
