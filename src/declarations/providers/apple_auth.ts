import { AppleClaim } from '../models/apple_claim';

export abstract class AppleAuthProvider {
  abstract verify(idToken: string): Promise<boolean>;

  abstract extractClaim(idToken: string): Promise<AppleClaim>;
}
