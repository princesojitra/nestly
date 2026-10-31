import { addDays, isOverdue } from '../Maintenance';

test('addDays advances a date by the given number of days', () => {
  expect(addDays('2026-06-01', 30)).toBe('2026-07-01');
});

test('addDays handles month/year rollover', () => {
  expect(addDays('2026-12-20', 15)).toBe('2027-01-04');
});

test('isOverdue is true for a past due date', () => {
  expect(isOverdue('2026-01-01', new Date('2026-06-15'))).toBe(true);
});

test('isOverdue is false for a future due date', () => {
  expect(isOverdue('2026-12-31', new Date('2026-06-15'))).toBe(false);
});

test('isOverdue is false for today', () => {
  expect(isOverdue('2026-06-15', new Date('2026-06-15T18:00:00'))).toBe(false);
});
