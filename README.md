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

The app exposes these clean routes:

- `/`
- `/whyus/`
- `/about/`
- `/medical/`
- `/opmodel/`
- `/journey/`
- `/faq/`
- `/contact/`
