# taskflow-api

A lightweight task management API built with Node.js core `http` primitives.

## Features

- Health check endpoint
- Create/list tasks
- Mark task as completed
- Minimal dependency footprint

## API Endpoints

- `GET /health`
- `GET /tasks`
- `POST /tasks` with JSON body: `{ "title": "My task" }`
- `PATCH /tasks/:id`

## Run

```bash
npm start
```

## Test

```bash
npm test
```
