import { ProviderOk, ProviderResult } from 'src/core/results/provider';
import { GoogleAuthProvider } from 'src/declarations/providers/google_auth';

export class MockGoogleAuthProvider implements GoogleAuthProvider {
  async verify(idToken: string): Promise<ProviderResult<never>> {
    return new ProviderOk(null);
  }

  async extractEmail(idToken: string): Promise<ProviderResult<string>> {
    return new ProviderOk('email');
  }
}
