import { ProviderResult } from 'src/core/results/provider';

export interface GoogleAuthProvider {
  verify: (idToken: string) => Promise<ProviderResult<never>>;

  extractEmail: (idToken: string) => Promise<ProviderResult<string>>;
}
