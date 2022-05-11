import { Injectable } from "@nestjs/common";
import { OAuth2Client } from "google-auth-library";
import { GoogleClaimModel } from "src/declarations/models/google_claim";
import { GoogleAuthProvider } from "src/declarations/providers/google_auth";

@Injectable()
export class GoogleAuthProviderImpl implements GoogleAuthProvider {
  private client = new OAuth2Client();

  async verify(idToken: string): Promise<boolean> {
    try {
      await this.client.verifyIdToken({
        idToken,
        audience: [
          process.env.GOOGLE_OAUTH_CLIENT_ID_FOR_ANDROID,
          process.env.GOOGLE_OAUTH_CLIENT_ID_FOR_IOS,
        ],
      });

      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  }

  async extractClaim(idToken: string): Promise<GoogleClaimModel> {
    const ticket = await this.client.verifyIdToken({
      idToken,
      audience: [
        process.env.GOOGLE_OAUTH_CLIENT_ID_FOR_ANDROID,
        process.env.GOOGLE_OAUTH_CLIENT_ID_FOR_IOS,
      ],
    });

    const { sub: id, email } = ticket.getPayload();

    const result = new GoogleClaimModel({
      id,
      email,
    });

    return result;
  }
}
