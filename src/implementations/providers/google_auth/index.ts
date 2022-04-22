import { Injectable } from '@nestjs/common';
import { OAuth2Client } from 'google-auth-library';
import {
  ProviderError,
  ProviderOk,
  ProviderResult,
} from 'src/core/enums/results/provider';
import { GoogleClaim } from 'src/declarations/models/google_claim';
import { GoogleAuthProvider } from 'src/declarations/providers/google_auth';

@Injectable()
export class GoogleAuthProviderImpl implements GoogleAuthProvider {
  private clientId = process.env.GOOGLE_OAUTH_CLIENT_ID;

  private client = new OAuth2Client(this.clientId);

  async verify(idToken: string): Promise<ProviderResult<boolean>> {
    try {
      await this.client.verifyIdToken({
        idToken,
        audience: this.clientId,
      });

      return new ProviderOk(true);
    } catch (e) {
      return new ProviderOk(false);
    }
  }

  async extractClaim(idToken: string): Promise<ProviderResult<GoogleClaim>> {
    try {
      const ticket = await this.client.verifyIdToken({
        idToken,
        audience: this.clientId,
      });

      const { sub: id, email } = ticket.getPayload();

      const result = new GoogleClaim({
        id,
        email,
      });

      return new ProviderOk(result);
    } catch (e) {
      return new ProviderError('Your token is not valid');
    }
  }
}
