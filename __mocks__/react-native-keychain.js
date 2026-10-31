// The native Keychain module isn't available under Jest — this in-memory
// stand-in lets anything that touches auth/session storage run in tests.
const store = new Map();

module.exports = {
  getGenericPassword: jest.fn(async (options = {}) => {
    const value = store.get(options.service);
    return value ? { username: options.service, password: value, service: options.service, storage: 'memory' } : false;
  }),
  setGenericPassword: jest.fn(async (_username, password, options = {}) => {
    store.set(options.service, password);
    return { service: options.service, storage: 'memory' };
  }),
  resetGenericPassword: jest.fn(async (options = {}) => {
    store.delete(options.service);
    return true;
  }),
};
