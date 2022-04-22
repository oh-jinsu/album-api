import { ProviderResult } from 'src/core/enums/results/provider';
import { AppleClaim } from '../models/apple_claim';

export abstract class AppleAuthProvider {
  abstract verify(idToken: string): Promise<ProviderResult<boolean>>;

  abstract extractClaim(idToken: string): Promise<ProviderResult<AppleClaim>>;
}
