import { Injectable } from "@nestjs/common";
import { OAuth2Client } from "google-auth-library";
import { GoogleClaimModel } from "src/declarations/models/google_claim";
import { GoogleAuthProvider } from "src/declarations/providers/google_auth";

@Injectable()
export class GoogleAuthProviderImpl implements GoogleAuthProvider {
  private clientId = process.env.GOOGLE_OAUTH_CLIENT_ID;

  private client = new OAuth2Client(this.clientId);

  async verify(idToken: string): Promise<boolean> {
    try {
      await this.client.verifyIdToken({
        idToken,
        audience: this.clientId,
      });

      return true;
    } catch (e) {
      return false;
    }
  }

  async extractClaim(idToken: string): Promise<GoogleClaimModel> {
    const ticket = await this.client.verifyIdToken({
      idToken,
      audience: this.clientId,
    });

    const { sub: id, email } = ticket.getPayload();

    const result = new GoogleClaimModel({
      id,
      email,
    });

    return result;
  }
}
