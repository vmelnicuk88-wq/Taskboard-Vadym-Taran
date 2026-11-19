const test = require('node:test');
const assert = require('node:assert/strict');
const { spawn } = require('node:child_process');

test('API TaskBoard: sesja, tablice, zadania, filtry i usuwanie', {
  skip: !process.env.TB_RUN_INTEGRATION
}, async t => {
  const child = spawn(process.execPath, ['server.js'], {
    cwd: require('node:path').join(__dirname, '..'),
    env: process.env,
    stdio: ['ignore', 'pipe', 'pipe']
  });
  let logs = '';
  child.stdout.on('data', chunk => { logs += chunk.toString(); });
  child.stderr.on('data', chunk => { logs += chunk.toString(); });
  t.after(() => child.kill());

  const base = 'http://127.0.0.1:3000';
  let healthy = false;
  for (let attempt = 0; attempt < 60; attempt++) {
    try {
      const response = await fetch(base + '/api/health');
      if (response.ok) { healthy = true; break; }
    } catch (_) { /* serwer jeszcze startuje */ }
    await new Promise(resolve => setTimeout(resolve, 250));
  }
  assert.ok(healthy, 'Serwer nie wystartował: ' + logs);

  async function request(route, method = 'GET', body, cookie = '') {
    const response = await fetch(base + '/api' + route, {
      method,
      headers: {
        ...(body ? { 'Content-Type': 'application/json' } : {}),
        ...(cookie ? { Cookie: cookie } : {})
      },
      body: body ? JSON.stringify(body) : undefined
    });
    const data = response.status === 204 ? null : await response.json();
    return { response, data };
  }

  let result = await request('/boards');
  assert.equal(result.response.status, 401);

  const credentials = { login: 'api.integration', password: 'Test1234!', firstName: 'API', lastName: 'Test' };
  result = await request('/auth/register', 'POST', credentials);
  assert.equal(result.response.status, 201, logs);
  assert.ok(result.data.id > 0);
  assert.equal(result.data.passwordHash, undefined);
  const userId = result.data.id;
  const cookie = (result.response.headers.get('set-cookie') || '').split(';')[0];
  assert.ok(cookie.includes('connect.sid'));

  result = await request('/auth/register', 'POST', credentials);
  assert.equal(result.response.status, 409);
  result = await request('/auth/login', 'POST', { login: credentials.login, password: 'zle-haslo' });
  assert.equal(result.response.status, 401);
  result = await request('/auth/login', 'POST', { login: credentials.login, password: credentials.password });
  assert.equal(result.response.status, 200);

  result = await request('/boards', 'POST', { name: 'Tablica testowa', description: 'Do testowania' }, cookie);
  assert.equal(result.response.status, 201);
  const boardId = result.data.id;
  result = await request('/boards', 'GET', null, cookie);
  assert.equal(result.response.status, 200);
  assert.ok(result.data.some(board => board.id === boardId));

  result = await request('/tasks', 'POST', {
    boardId, title: 'Przetestować API', priority: 'high', status: 'todo', assigneeId: userId
  }, cookie);
  assert.equal(result.response.status, 201, logs);
  const taskId = result.data.id;

  result = await request('/boards/' + boardId + '/tasks?priority=high&assigneeId=' +
    userId + '&q=API', 'GET', null, cookie);
  assert.equal(result.response.status, 200);
  assert.equal(result.data.length, 1);
  assert.equal(result.data[0].id, taskId);

  result = await request('/boards/' + boardId + '/tasks?assigneeId=abc', 'GET', null, cookie);
  assert.equal(result.response.status, 400);
  result = await request('/boards/' + boardId + '/tasks?priority=pilne', 'GET', null, cookie);
  assert.equal(result.response.status, 400);

  result = await request('/tasks/' + taskId, 'GET', null, cookie);
  assert.equal(result.response.status, 200);
  const task = result.data;
  result = await request('/tasks/' + taskId, 'PUT', { ...task, status: 'in_progress' }, cookie);
  assert.equal(result.response.status, 200);
  result = await request('/tasks/' + taskId, 'DELETE', null, cookie);
  assert.equal(result.response.status, 204);
  result = await request('/boards/' + boardId, 'DELETE', null, cookie);
  assert.equal(result.response.status, 204);

  result = await request('/auth/logout', 'POST', null, cookie);
  assert.equal(result.response.status, 204);
  result = await request('/auth/me', 'GET', null, cookie);
  assert.equal(result.response.status, 401);
});
