import { daysUntil, getWarrantyStatus, warrantyProgress } from '../Warranty';

const now = new Date('2026-06-15T00:00:00.000Z');

test('status is active when well before expiry', () => {
  expect(getWarrantyStatus('2026-12-31', now)).toBe('active');
});

test('status is expiringSoon within the 30-day window', () => {
  expect(getWarrantyStatus('2026-07-01', now)).toBe('expiringSoon');
});

test('status is expired once the end date has passed', () => {
  expect(getWarrantyStatus('2026-01-01', now)).toBe('expired');
});

test('daysUntil counts remaining days', () => {
  expect(daysUntil('2026-06-20', now)).toBe(5);
});

test('daysUntil is negative after expiry', () => {
  expect(daysUntil('2026-06-10', now)).toBe(-5);
});

test('warrantyProgress is 0 at the start and 1 at the end', () => {
  expect(warrantyProgress('2026-01-01', '2027-01-01', new Date('2026-01-01'))).toBe(0);
  expect(warrantyProgress('2026-01-01', '2027-01-01', new Date('2027-01-01'))).toBe(1);
});

test('warrantyProgress clamps past expiry to 1', () => {
  expect(warrantyProgress('2026-01-01', '2026-06-01', new Date('2026-12-01'))).toBe(1);
});
