# Kacavas

A portfolio for three brothers: Nicholas, Elias, and Alexander Kacavas. Nicholas goes by Niko. Alexander goes by Alec. The pages stay at `/niko`, `/eli`, and `/alec`. It is a Next.js app meant for Vercel’s free Hobby plan, on [kacavas.com](https://kacavas.com).

Nicholas is a U.S. Army captain, West Point class of 2022. Elias is an actor. Alexander is GTM lead at Lance. The copy on the site comes from public sources gathered for this project. Do not add credits, roles, or places that are not confirmed.

## Local development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
npm test        # unit tests
npm run lint
npm run build
```

Optional password file:

```bash
cp .env.example .env.local
```

## Editing content

| What | Where |
| --- | --- |
| Menu, page titles, sitemap | `data/nav.ts` |
| Short bios on the home page | `data/brothers.ts` |
| Eli’s credits and The Vanity | `data/eli.ts` and `components/brothers/eli-view.tsx` |
| Niko’s service record | `data/niko.ts` and `components/brothers/niko-view.tsx` |
| Alec’s roles | `data/alec.ts` and `components/brothers/alec-view.tsx` |
| Photographs | `data/images.ts` and files in `public/` |
| Shop cards | `data/products.ts` |
| Map pins | `data/places.ts` |

### Adding a page

1. Create `app/(site)/your-page/page.tsx`.
2. Add one object to the `pages` array in `data/nav.ts`.

The side menu and the sitemap both read that array. Set `enabled: false` to keep a route in the repo without publishing it (Shop and Creative are off this way). Set `index: false` for a page that should stay out of search engines.

### Photographs

All image paths live in `data/images.ts`. Elias’s portrait is a photograph from his own public Instagram. Nicholas’s portrait is a field photograph. Alexander’s portrait is him on a balcony under the northern lights.

Drop a photograph the brother owns into `public/`, point `src` at it, and rewrite `alt` so it describes that picture. Set `width` and `height` to the file’s pixel size. Do not commit magazine or press photos.

### Niko

He is on active duty. The public page keeps general role titles, West Point, and the rank of captain. Do not add his unit, his base, or a deployment. That includes Fort Stewart and any overseas rotation. A West Point pin on the map is school, class of 2022, and the note should say so.

The small note about Nicholas G. Kacavas (1927–2012) is their grandfather, a World War II Navy veteran. He is not Nicholas.

## Password

The whole site is private. The password is checked on the server.

- `proxy.ts` is the Next.js 16 middleware (the file was renamed from `middleware.ts`). It does not see the password. It checks a signed httpOnly cookie. If that cookie is missing or bad, the request is rewritten to the password screen, and the address bar stays on the page they asked for.
- `app/api/unlock/route.ts` compares the submitted password with `SITE_PASSWORD` and sets a session cookie for the whole site. The cookie has no `Max-Age` and no `Expires`, so the browser keeps it for the current session, including while someone moves from page to page, and drops it when that session ends. A later visit has to enter the password again. `DELETE` clears the cookie immediately. Lock, in the menu and on the map, calls that.
- The password screen, the static files it needs, `robots.txt`, and a health check are the only routes that answer without the cookie.

### `SITE_PASSWORD` and the placeholder

The password comes from the environment variable `SITE_PASSWORD`.

If `SITE_PASSWORD` is missing or empty, the site falls back to the placeholder password:

```text
kacavas-local
```

That string is public. It is here so `npm run dev` works before anyone sets a secret. It is not a protection. The lock screen mentions it only in local development, not on the production site.

Set a real value before sharing the deployment:

1. In the Vercel project, open **Settings → Environment Variables**.
2. Add `SITE_PASSWORD` for Production and Preview. Pick a long password that is not `kacavas-local`.
3. Redeploy. Vercel reads the variable at build and at runtime. A change does not apply until the next deployment.

Hobby includes this custom gate. Vercel’s own password-protection feature is not required, and it is not part of Hobby.

Pins live in `data/places.ts`. The map groups nearby visits into a count badge until you zoom or tap it, and the Table tab filters the same list.

## Shop and Stripe

Shop and Creative stay in the repo with `enabled: false` in `data/nav.ts`, so those URLs 404 until you flip the flag. The shop cards are examples. Buttons are disabled. Nothing is charged.

`app/api/checkout/route.ts` is the place Stripe Checkout will go. The steps are in that file:

1. `npm install stripe`
2. Set `STRIPE_SECRET_KEY` in Vercel.
3. Put a `price_...` id on the product in `data/products.ts`.
4. Set `example` to `false`.
5. Replace the final `501` response with a Checkout Session, using the snippet in the route.

## Deploying on Vercel Hobby

1. Push this repository to GitHub.
2. In Vercel, **Add New → Project** and import it. Framework preset: Next.js. No extra build command. The default `npm run build` is correct.
3. Add `SITE_PASSWORD` before the first production deployment you share.
4. Deploy. Hobby is enough: one Next.js app, server routes, and the proxy.

### Pointing kacavas.com at Vercel

In the project, open **Settings → Domains** and add both `kacavas.com` and `www.kacavas.com`. Vercel shows a domain card with the records for this project. Use those values. They are often:

| Type | Host | Value |
| --- | --- | --- |
| A | `@` | The IPv4 address on the domain card. For many projects this is `76.76.21.21`. Newer projects can show a different anycast address. Copy the card. |
| CNAME | `www` | The CNAME target on the domain card. It is specific to the project. Do not reuse a target from another site. |

Add those records at the registrar or DNS host that already serves kacavas.com. Remove any old A, AAAA, or CNAME records on the same host names first.

Prefer keeping DNS where it is if the domain also has email. Changing only the website records leaves MX and TXT records alone. If you switch the domain to Vercel’s nameservers instead, copy every existing record, including mail, into Vercel before the switch.

After the records propagate, the domain card should read **Valid Configuration**, and Vercel issues the certificate. In the domain settings, redirect the host you do not want (`kacavas.com` or `www`) to the one you do.

Check from a terminal:

```bash
dig a kacavas.com +short
dig cname www.kacavas.com +short
```

The answers should match the domain card.

## Stack

Next.js (App Router, TypeScript), Tailwind CSS, Framer Motion, and Three.js through React Three Fiber and drei. The map is drawn with d3-geo from a Natural Earth world file in `public/maps/`.
