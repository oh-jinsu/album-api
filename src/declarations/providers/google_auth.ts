import { ProviderResult } from 'src/core/enums/results/provider';
import { GoogleClaim } from '../models/google_claim';

export abstract class GoogleAuthProvider {
  abstract verify(idToken: string): Promise<ProviderResult<boolean>>;

  abstract extractClaim(idToken: string): Promise<ProviderResult<GoogleClaim>>;
}
