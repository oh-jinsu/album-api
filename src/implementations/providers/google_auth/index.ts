import { Injectable } from '@nestjs/common';
import { OAuth2Client } from 'google-auth-library';
import {
  ProviderError,
  ProviderOk,
  ProviderResult,
} from 'src/core/results/provider';
import { GoogleAuthProvider } from 'src/declarations/providers/google_auth';

@Injectable()
export class GoogleAuthProviderImpl implements GoogleAuthProvider {
  private clientId = process.env.GOOGLE_OAUTH_CLIENT_ID;

  private client = new OAuth2Client(this.clientId);

  async verify(idToken: string): Promise<ProviderResult<never>> {
    try {
      await this.client.verifyIdToken({
        idToken,
        audience: this.clientId,
      });

      return new ProviderOk(null);
    } catch (e) {
      return new ProviderError('Your token is not valid');
    }
  }

  async extractEmail(idToken: string): Promise<ProviderResult<string>> {
    try {
      const ticket = await this.client.verifyIdToken({
        idToken,
        audience: this.clientId,
      });

      const { email } = ticket.getPayload();

      return new ProviderOk(email);
    } catch (e) {
      return new ProviderError('Your token is not valid');
    }
  }
}
