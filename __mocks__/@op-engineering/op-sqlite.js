// The native SQLite module isn't available under Jest — a no-op in-memory
// stand-in so anything that touches the database can run in smoke tests.
// Feature-level logic (row mapping, SQL shape) is tested against a mocked
// `db.execute` directly instead — see sqliteAssetRepository.test.ts.
module.exports = {
  open: jest.fn(() => ({
    execute: jest.fn().mockResolvedValue({ rows: [], rowsAffected: 0 }),
  })),
};
