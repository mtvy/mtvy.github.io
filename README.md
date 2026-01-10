# Mtvy github page.

## Local development

```bash
npm install
npm run dev
```

The server listens on `http://localhost:4173` by default. Override the port with `PORT=XXXX npm run dev`.

## Docker usage

Build and run the container with Docker Compose:

```bash
docker compose up --build
```

Or use the provided convenience targets:

```bash
make server        # foreground
make server-detach # detached
make server-stop   # stop and remove containers
```

The `web` service is exposed on `localhost:4173`, which you can change via the `PORT` environment variable (e.g. `PORT=8080 docker compose up`).

