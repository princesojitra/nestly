import { signInSchema, signUpSchema } from '../authSchemas';

test('signInSchema rejects an invalid email and empty password', () => {
  const result = signInSchema.safeParse({ email: 'not-an-email', password: '' });
  expect(result.success).toBe(false);
});

test('signInSchema accepts a valid email/password', () => {
  const result = signInSchema.safeParse({ email: 'a@b.com', password: 'secret' });
  expect(result.success).toBe(true);
});

test('signUpSchema rejects a short password', () => {
  const result = signUpSchema.safeParse({ email: 'a@b.com', password: 'short', confirmPassword: 'short' });
  expect(result.success).toBe(false);
});

test('signUpSchema rejects mismatched passwords', () => {
  const result = signUpSchema.safeParse({ email: 'a@b.com', password: 'longenough', confirmPassword: 'different' });
  expect(result.success).toBe(false);
});

test('signUpSchema accepts matching, long-enough passwords', () => {
  const result = signUpSchema.safeParse({ email: 'a@b.com', password: 'longenough', confirmPassword: 'longenough' });
  expect(result.success).toBe(true);
});
