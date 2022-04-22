import { ProviderResult } from 'src/core/results/provider';
import { GoogleAuthProvider } from 'src/declarations/providers/google_auth';
import { GoogleAuthProviderImpl } from '.';

export class MockGoogleAuthProvider implements GoogleAuthProvider {
  private forProduction: GoogleAuthProviderImpl = new GoogleAuthProviderImpl();

  async verify(idToken: string): Promise<ProviderResult<never>> {
    return this.forProduction.verify(idToken);
  }

  async extractEmail(idToken: string): Promise<ProviderResult<string>> {
    return this.forProduction.extractEmail(idToken);
  }
}
