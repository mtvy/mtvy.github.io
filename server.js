#!/usr/bin/env node

/**
 * Simple Express server to expose the static site.
 * Designed to be container-friendly and require zero build tooling.
 */

const path = require('path');
const express = require('express');
const compression = require('compression');
const helmet = require('helmet');
const morgan = require('morgan');

const app = express();
const host = process.env.HOST || '0.0.0.0';
const port = Number.parseInt(process.env.PORT || '4173', 10);
const rootDir = __dirname;

const blockList = [
  /^\/node_modules/i,
  /^\/package-lock\.json/i,
  /^\/package\.json/i,
  /^\/docker-compose\.ya?ml/i,
  /^\/Dockerfile/i,
  /^\/Makefile/i,
  /^\/server\.js/i,
];

app.disable('x-powered-by');

app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
  }),
);

app.use(compression());

if (process.env.NODE_ENV !== 'test') {
  app.use(
    morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'),
  );
}

app.use((req, res, next) => {
  if (blockList.some((pattern) => pattern.test(req.path))) {
    return res.status(404).send('Not found');
  }
  return next();
});

app.use(
  express.static(rootDir, {
    dotfiles: 'ignore',
    index: false,
    extensions: ['html'],
    maxAge: process.env.NODE_ENV === 'production' ? '12h' : 0,
    fallthrough: true,
  }),
);

app.use((_, res) => {
  res.sendFile(path.join(rootDir, 'index.html'));
});

app.listen(port, host, () => {
  console.log(`[server] Listening on http://${host}:${port}`);
});

