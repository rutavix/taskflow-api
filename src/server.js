const http = require('http');
const { TaskStore } = require('./taskStore');

const store = new TaskStore();

function json(res, statusCode, payload) {
  res.writeHead(statusCode, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(payload));
}

function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
    });

    req.on('end', () => {
      if (!body) {
        resolve({});
        return;
      }

      try {
        resolve(JSON.parse(body));
      } catch {
        reject(new Error('Invalid JSON'));
      }
    });
  });
}

function createServer() {
  return http.createServer(async (req, res) => {
    if (req.method === 'GET' && req.url === '/health') {
      json(res, 200, { status: 'ok' });
      return;
    }

    if (req.method === 'GET' && req.url === '/tasks') {
      json(res, 200, { data: store.list() });
      return;
    }

    if (req.method === 'POST' && req.url === '/tasks') {
      try {
        const payload = await parseBody(req);
        if (!payload.title || typeof payload.title !== 'string') {
          json(res, 400, { error: 'title is required' });
          return;
        }

        const task = store.create({ title: payload.title.trim() });
        json(res, 201, { data: task });
      } catch {
        json(res, 400, { error: 'Invalid JSON payload' });
      }
      return;
    }

    if (req.method === 'PATCH' && req.url.startsWith('/tasks/')) {
      const id = Number(req.url.split('/')[2]);
      if (!Number.isInteger(id)) {
        json(res, 400, { error: 'Invalid task id' });
        return;
      }

      const task = store.markComplete(id);
      if (!task) {
        json(res, 404, { error: 'Task not found' });
        return;
      }

      json(res, 200, { data: task });
      return;
    }

    json(res, 404, { error: 'Route not found' });
  });
}

if (require.main === module) {
  const port = Number(process.env.PORT || 3000);
  createServer().listen(port, () => {
    console.log(`taskflow-api listening on http://localhost:${port}`);
  });
}

module.exports = { createServer };
