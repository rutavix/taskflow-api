const test = require('node:test');
const assert = require('node:assert/strict');
const { createServer } = require('../src/server');

let server;
let baseUrl;

test.before(async () => {
  server = createServer();
  await new Promise((resolve) => server.listen(0, resolve));
  const address = server.address();
  baseUrl = `http://127.0.0.1:${address.port}`;
});

test.after(async () => {
  await new Promise((resolve) => server.close(resolve));
});

test('creates and completes a task', async () => {
  const createResponse = await fetch(`${baseUrl}/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title: 'Write docs' })
  });

  assert.equal(createResponse.status, 201);
  const created = await createResponse.json();
  assert.equal(created.data.title, 'Write docs');
  assert.equal(created.data.completed, false);

  const completeResponse = await fetch(`${baseUrl}/tasks/${created.data.id}`, {
    method: 'PATCH'
  });

  assert.equal(completeResponse.status, 200);
  const completed = await completeResponse.json();
  assert.equal(completed.data.completed, true);
});
