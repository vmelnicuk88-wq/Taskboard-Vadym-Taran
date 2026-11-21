const test = require('node:test');
const assert = require('node:assert/strict');
const { positiveId, optionalDeadline, validateTask } = require('../taskValidation');

test('walidacja identyfikatora osoby', () => {
  assert.equal(positiveId(3), 3);
  for (const value of [0, -1, 1.5, '1.0', 'abc', {}, null]) {
    assert.equal(positiveId(value), null);
  }
});

test('walidacja terminu odrzuca nieistniejące daty', () => {
  assert.equal(optionalDeadline('2026-02-28').valid, true);
  assert.equal(optionalDeadline('2026-02-30').valid, false);
  assert.equal(optionalDeadline('2026-11-31').valid, false);
  assert.equal(optionalDeadline('30-11-2026').valid, false);
  assert.equal(optionalDeadline(null).valid, true);
});

test('walidacja zadania wymaga poprawnej osoby, daty i tablicy', () => {
  assert.match(validateTask({ title: 'Zadanie', boardId: 1, assigneeId: 'abc' }).error, /osoba/);
  assert.match(validateTask({ title: 'Zadanie', boardId: 1, deadline: '2026-02-31' }).error, /termin/);
  assert.match(validateTask({ title: 'Zadanie', boardId: 'x' }).error, /dane/);
  assert.equal(validateTask({ title: 'Zadanie', assigneeId: null }, 1).task.boardId, 1);
});
