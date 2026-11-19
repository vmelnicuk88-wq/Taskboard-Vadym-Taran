const test = require('node:test');
const assert = require('node:assert/strict');
const { buildTaskFilters } = require('../taskFilters');

test('brak filtrów: tylko aktywne zadania tablicy', () => {
  assert.deepEqual(buildTaskFilters({}, 7), { where: 'boardId = ? AND isDeleted = 0', params: [7] });
});
test('priorytet', () => {
  assert.deepEqual(buildTaskFilters({ priority: 'high' }, 7).params, [7, 'high']);
});
test('osoba', () => {
  assert.deepEqual(buildTaskFilters({ assigneeId: '4' }, 7).params, [7, 4]);
});
test('wyszukiwanie fragmentu', () => {
  assert.deepEqual(buildTaskFilters({ q: 'api' }, 7).params, [7, '%api%']);
});
test('filtry łączą się jednocześnie', () => {
  const result = buildTaskFilters({ priority: 'medium', assigneeId: '8', q: 'test' }, 7);
  assert.deepEqual(result.params, [7, 'medium', 8, '%test%']);
  assert.match(result.where, /priority = \? AND assigneeId = \? AND title LIKE \?/);
});
test('niepoprawny priorytet', () => {
  assert.throws(() => buildTaskFilters({ priority: 'pilne' }, 7), /Nieprawidłowy priorytet/);
});
for (const invalid of ['0', '-1', '1.5', 'abc', '1 OR 1=1', '9999999999999999999999']) {
  test('niepoprawny assigneeId: ' + invalid, () => {
    assert.throws(() => buildTaskFilters({ assigneeId: invalid }, 7), /Nieprawidłowa osoba/);
  });
}
test('pusty tytuł i wyszukiwanie po spacjach', () => {
  assert.deepEqual(buildTaskFilters({ q: '   ' }, 7).params, [7]);
});
test('zbyt długie wyszukiwanie', () => {
  assert.throws(() => buildTaskFilters({ q: 'x'.repeat(101) }, 7));
});
