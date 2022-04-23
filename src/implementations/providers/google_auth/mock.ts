import { GoogleClaim } from "src/declarations/models/google_claim";
import { GoogleAuthProvider } from "src/declarations/providers/google_auth";

export class MockGoogleAuthProvider implements GoogleAuthProvider {
  verify = jest.fn<Promise<boolean>, [string]>();

  extractClaim = jest.fn<Promise<GoogleClaim>, [string]>();
}
