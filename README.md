# Portail des arts et de la culture — Région des Plateaux

French cultural portal for the Direction régionale des arts et de la culture des Plateaux (Togo).

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/6a38da73-7231-4368-ae4c-a8df66a15811).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Work locally in VS Code

You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```

Open the address the terminal prints (usually `http://localhost:5173`). VS Code needs no extra setup: the terminal inside VS Code (`Ctrl+Shift+\``) is enough.

Other useful commands:

```sh
npm run test    # checks the content sources and the pages
npm run lint    # code style
npm run build   # production build
npm start       # run the production Node.js server after building
```

## Deploy to a Node.js host

The production build uses Nitro's `node-server` preset. It generates a Node.js server at `.output/server/index.mjs` alongside the static assets in `.output/public`.

```sh
npm ci
npm run build
test -f .output/server/index.mjs
npm start
```

For Plesk, use a plan with Node.js application support, set the application root to the project, and configure the app to run `npm start` with the production Node.js version. Build the project after deploying its source and dependencies, then restart the application. Add `HYGRAPH_ENDPOINT` and any other required settings in Plesk's environment-variable settings; do not upload a local `.env` file. Confirm that your hosting plan's Node.js integration supports launching this Nitro server and listening on its assigned port.

## Deploy to Vercel

Vercel must build this app as a server-rendered Nitro app, not as a static Vite site. The included `vercel.json` selects the Vercel Build Output API and runs `npm run build:vercel`, which produces `.vercel/output` with the server function and static assets. Set `HYGRAPH_ENDPOINT` (and any model overrides you use) in Vercel's Project Settings → Environment Variables.

## Deploy to Vercel

Vercel does not run a Node.js server: it needs the build to produce its own
Build Output API artifact, which `npm run build` writes to `.vercel/output`
when it detects a Vercel build (Vercel sets `VERCEL=1` during every build).
That switch lives in `vite.config.ts`, so the same repository still builds the
plain Node.js server for Plesk.

1. Push this repository to GitHub, GitLab or Bitbucket, then in Vercel choose
   **Add New… → Project** and import it.
2. In the import screen (or later in **Settings → Build & Development**) make
   sure:
   - Build Command: `npm run build`
   - Install Command: `npm install`
   - **Output Directory: turned off / empty.** This is the setting that caused
     `STATIC_BUILD_NO_OUT_DIR`: Vercel was looking for a `dist` folder that this
     project never creates. `vercel.json` pins the build and install commands,
     and the Output Directory override has to stay off so Vercel reads
     `.vercel/output`.
3. Add these settings under **Settings → Environment Variables → Add New…**:
   `HYGRAPH_ENDPOINT` (the Content API address) and `GMAIL_APP_PASSWORD` (a
   Google App Password for `plateauxdrac@gmail.com`). Enable 2-Step
   Verification on that Google account, then create an App Password at
   [Google Account App Passwords](https://myaccount.google.com/apppasswords).
   The contact form sends validated enquiries from and to that address; keep
   the app password secret and server-side. Without `HYGRAPH_ENDPOINT` the
   deployed site falls back to its labelled demonstration content. Changes need
   a redeploy to appear.
4. Deploy. Every page is rendered on Vercel Functions, including the pages that
   read your publications.

## Connect your own content

Without any settings the portal shows clearly labelled demonstration content. To read your own publications, copy `.env.example` to `.env` and fill in the address of your content workspace:

```sh
cp .env.example .env
```

- **Hygraph** — Project settings → API Access → Content API: copy the Content Delivery API URL into `HYGRAPH_ENDPOINT`. Publish at least one item per section (only published content is read). Model API IDs: `actualites`, `evenements`, `annonces`, `galeries`, `videos`. If Hygraph is not configured or has no published content, the portal uses its labelled demonstration content.

`.env` is ignored by git and never shared. On the hosted site the same names are filled in as project secrets, so nothing needs to be written into the code.
Locally, `.env` is loaded for both `npm run dev` and `npm start`; these server-side settings are not exposed to the browser.

## Where things live

| Path | What it holds |
| --- | --- |
| `src/routes/` | one file per page address |
| `src/components/portal/` | header, footer, cards, page layouts |
| `src/lib/portal/content.ts` | demonstration editorial content |
| `src/lib/portal/source.ts` | chooses Hygraph or demonstration content |
| `src/styles.css` | colours, fonts, layout rules |
