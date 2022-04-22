import { ProviderResult } from 'src/core/enums/results/provider';

export abstract class AppleAuthProvider {
  abstract verify(idToken: string): Promise<ProviderResult<never>>;

  abstract extractEmail(idToken: string): Promise<ProviderResult<string>>;
}
