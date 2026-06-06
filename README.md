# Ekamra Medical Concierge Node Website

Modern Node.js rebuild of the public WordPress site at `https://ekamra.life`.

The page content is preserved from the WordPress REST API snapshot in `source-cache/wp-pages.json`. The Express app renders that content in a modern responsive layout with local cached media, SEO metadata, a mobile navigation menu, FAQ accordions, and working contact form posts.

## Run

```bash
npm install
npm start
```

Open `http://localhost:3000`.

## Verify

```bash
npm test
```

## Deploy on Hostinger

This project is compatible with Hostinger Node.js Web Apps on Business and Cloud hosting plans.

In hPanel:

1. Go to **Websites** → **Add Website** → **Node.js Apps**.
2. Import the GitHub repository and select the branch to deploy.
3. Use these deployment settings:
   - Framework: `Express.js`
   - Node.js version: `22.x` recommended (`20.x` and `24.x` are also supported)
   - Package manager: `npm`
   - Build command: `npm run build`
   - Start command: `npm start`
   - Entry file: `server.js`
4. Add `NODE_ENV=production` as an environment variable.
5. Leave `PORT` unset because Hostinger assigns it automatically.

The contact form stores submissions in `data/submissions.jsonl` by default. For durable production storage, configure a database, email service, or set `SUBMISSIONS_FILE` to a writable persistent path supplied by the hosting environment.

The app exposes these clean routes:

- `/`
- `/whyus/`
- `/about/`
- `/medical/`
- `/opmodel/`
- `/journey/`
- `/faq/`
- `/contact/`
