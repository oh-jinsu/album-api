import { GoogleClaimModel } from "../models/google_claim";

export abstract class GoogleAuthProvider {
  abstract verify(idToken: string): Promise<boolean>;

  abstract extractClaim(idToken: string): Promise<GoogleClaimModel>;
}
