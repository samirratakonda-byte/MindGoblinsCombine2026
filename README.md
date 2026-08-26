# Mind Goblins Combine — deploy guide

This is a small real backend: a static page (`index.html`) plus one server
function (`api/state.js`) that reads/writes the shared league data to a
Vercel KV database. No "initialize/join" step — once it's deployed, everyone
just opens the same URL.

## One-time setup (about 10 minutes)

1. **Push this folder to a new GitHub repo.**
   - Create a new, empty repository on GitHub (no README/license needed).
   - From this folder: `git init`, `git add .`, `git commit -m "Mind Goblins Combine"`,
     then follow GitHub's instructions to add the remote and push (`git remote add origin <your-repo-url>`, `git push -u origin main`).

2. **Sign up for Vercel with your GitHub account** at vercel.com — click
   "Continue with GitHub," no separate password needed. Free (Hobby) plan is
   all you need.

3. **Import the project**: in the Vercel dashboard, "Add New" → "Project" →
   pick the GitHub repo you just pushed → Deploy. It'll build fine even
   before the database is connected — the site just won't load data yet.

4. **Add a KV database**: in your new project, go to the **Storage** tab →
   "Create Database" → choose **KV** → follow the prompts (free tier) →
   when asked, **connect it to this project**. Vercel automatically adds
   the connection details as environment variables — you don't need to
   copy/paste anything.

5. **Redeploy**: go to the **Deployments** tab → the three-dot menu on the
   latest deployment → "Redeploy" (so it picks up the new database
   connection).

6. **Share the URL**: your project's `https://<something>.vercel.app`
   address is the live site. Send that link to your 14 teams — no code,
   no file to distribute, they just open it and pick their team name.

## After that

- Every `git push` to your main branch auto-redeploys the site with your
  latest changes.
- The roster, roles, and events are the same ones we set up together
  (baked into `api/state.js` as the starting data — it only gets used the
  very first time the database is empty). Team names, roles, and PINs can
  all still be managed live from inside the app (Owner → Settings), so you
  don't need to touch this file again unless you want to change the
  starting defaults before first deploy.
- If `/api/state` ever fails (a Vercel or database hiccup), the app falls
  back to showing the last data it saw locally and shows "Offline (local
  only)" in the header until it reconnects — nothing gets lost.
