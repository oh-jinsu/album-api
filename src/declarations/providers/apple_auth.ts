import { ProviderResult } from 'src/core/results/provider';

export interface AppleAuthProvider {
  verify: (idToken: string) => Promise<ProviderResult<never>>;

  extractEmail: (idToken: string) => Promise<ProviderResult<string>>;
}
