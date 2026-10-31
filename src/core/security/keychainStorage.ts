import * as Keychain from 'react-native-keychain';

// Implements Supabase's SupportedStorage interface backed by the platform
// Keychain/Keystore (never AsyncStorage) — see docs/PRODUCT_SPEC.md security section.
export const keychainStorage = {
  async getItem(key: string): Promise<string | null> {
    const credentials = await Keychain.getGenericPassword({ service: key });
    return credentials ? credentials.password : null;
  },
  async setItem(key: string, value: string): Promise<void> {
    await Keychain.setGenericPassword(key, value, { service: key });
  },
  async removeItem(key: string): Promise<void> {
    await Keychain.resetGenericPassword({ service: key });
  },
};
