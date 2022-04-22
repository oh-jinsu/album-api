import { ProviderResult } from 'src/core/results/provider';

export abstract class GoogleAuthProvider {
  abstract verify(idToken: string): Promise<ProviderResult<never>>;

  abstract extractEmail(idToken: string): Promise<ProviderResult<string>>;
}
