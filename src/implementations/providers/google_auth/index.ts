import { ProviderResult } from 'src/core/results/provider';
import { GoogleAuthProvider } from 'src/declarations/providers/google_auth';

export class GoogleAuthProviderImpl implements GoogleAuthProvider {
  async verify(idToken: string): Promise<ProviderResult<never>> {
    throw Error('Unimplemented');
  }

  async extractEmail(idToken: string): Promise<ProviderResult<string>> {
    throw Error('Unimplemented');
  }
}
