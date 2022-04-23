import { GoogleClaim } from "src/declarations/models/google_claim";
import { GoogleAuthProvider } from "src/declarations/providers/google_auth";
import { GoogleAuthProviderImpl } from ".";

export class MockGoogleAuthProvider implements GoogleAuthProvider {
  private forProduction: GoogleAuthProviderImpl = new GoogleAuthProviderImpl();

  async verify(idToken: string): Promise<boolean> {
    return this.forProduction.verify(idToken);
  }

  async extractClaim(idToken: string): Promise<GoogleClaim> {
    return this.forProduction.extractClaim(idToken);
  }
}
