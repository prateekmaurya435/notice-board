# Notice Board

A small CRUD app for posting and managing notices, built for the Reno Platforms web development internship assignment.

- **Framework:** Next.js (Pages Router)
- **Database access:** Prisma
- **Database:** MongoDB Atlas (free M0 tier)
- **Styling:** Tailwind CSS

## Features

- List all notices as responsive cards, with Urgent notices always sorted above Normal ones (sorted in the database via Prisma `orderBy`, not in the browser).
- One shared form for creating and editing a notice, including an optional image.
- Create / update / delete go through API routes under `pages/api/notices`, with proper HTTP methods and status codes.
- Server-side validation on every write (required fields, valid category/priority, valid date), independent of the browser-side checks.
- Delete requires an explicit confirmation step.

## Running locally

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Set up a database**

   Create a free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) cluster (the free **M0** tier is enough):
   - Create a cluster → Database Access: add a DB user with a password → Network Access: allow access from anywhere (`0.0.0.0/0`), since Vercel's IPs aren't fixed.
   - Click **Connect → Drivers**, copy the connection string, and add your database name before the `?`.

3. **Configure the environment**

   Copy `.env.example` to `.env` and paste in your connection string:

   ```bash
   cp .env.example .env
   ```

4. **Create the collection / sync the schema**

   MongoDB doesn't use Prisma Migrate (that's a SQL-only feature) — instead, push the schema directly:

   ```bash
   npx prisma db push
   ```

5. **Run the dev server**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000).

## Deploying

1. Push this repo to a public GitHub repository.
2. Import it on [Vercel](https://vercel.com) (free Hobby tier).
3. Add the `DATABASE_URL` environment variable in the Vercel project settings.
4. Deploy. Vercel runs `prisma generate` automatically via the `postinstall` script in `package.json`.

## Project structure

```
pages/
  index.js                 # Notices list (server-rendered, urgent-first)
  notices/new.js            # Create notice
  notices/[id]/edit.js      # Edit notice (pre-filled)
  api/notices/index.js      # GET (list) / POST (create)
  api/notices/[id].js       # GET / PUT / DELETE one notice
lib/
  prisma.js                 # Prisma client singleton
  validateNotice.js         # Shared server-side validation
components/
  NoticeCard.js
  NoticeForm.js
  ConfirmDialog.js
prisma/
  schema.prisma
```

## Design notes / decisions

A few things the brief left open, and the choices made here:

- **Image storage:** rather than wiring up a third-party file host, the optional image is read in the browser, converted to a base64 data URL, validated and size-capped (~3MB) on the server, and stored directly in the `image` field. This keeps the stack to exactly what's required (Next.js + Prisma + hosted DB) with no extra paid or free third-party services to configure.
- **Urgent-first ordering:** MongoDB stores Prisma enums as plain strings and has no concept of enum ordinals, so `orderBy: [{ priority: "desc" }, { publishDate: "desc" }]` sorts `priority` lexicographically. That still gives the right result here, since `"Urgent"` comes after `"Normal"` alphabetically — so `desc` reliably puts every Urgent notice above every Normal one, then sorts each group by date, all inside the Prisma query.
- **Ids:** MongoDB's primary key is an `ObjectId` (a 24-character hex string), not an auto-incrementing integer, so the `id` field and the API routes that read `req.query.id` work with strings rather than numbers.
- **Normal-notice ordering:** not specified by the brief, so Normal notices are sorted newest-`publishDate`-first, same as Urgent ones.
- **Delete confirmation:** a small custom modal (`ConfirmDialog`) rather than the native `confirm()`, so it matches the rest of the UI and is easier to test.

## Future Improvements

With more time, I would improve this project by adding:

- User authentication and authorization
- Image upload and management system
- Search and filter functionality for notices
- Better UI/UX with animations
- Pagination for handling large numbers of notices
- Admin dashboard for managing notices


## AI Usage

AI tools were used during development for:

- Understanding Next.js, Prisma and API concepts
- Generating initial code structure and components
- Debugging errors and improving implementation
- Getting suggestions for better code organization

I used AI assistants such as Claude AI and GitHub Copilot to help write and improve parts of the code. All generated code was reviewed, modified, tested, and integrated into the final project.