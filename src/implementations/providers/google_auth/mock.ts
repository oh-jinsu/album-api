import { ProviderResult } from 'src/core/enums/results/provider';
import { GoogleClaim } from 'src/declarations/models/google_claim';
import { GoogleAuthProvider } from 'src/declarations/providers/google_auth';
import { GoogleAuthProviderImpl } from '.';

export class MockGoogleAuthProvider implements GoogleAuthProvider {
  private forProduction: GoogleAuthProviderImpl = new GoogleAuthProviderImpl();

  async verify(idToken: string): Promise<ProviderResult<boolean>> {
    return this.forProduction.verify(idToken);
  }

  async extractClaim(idToken: string): Promise<ProviderResult<GoogleClaim>> {
    return this.forProduction.extractClaim(idToken);
  }
}
