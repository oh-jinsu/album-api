import { GoogleAuthProvider } from "src/declarations/providers/google_auth";

export class MockGoogleAuthProvider implements GoogleAuthProvider {
  verify = jest.fn();

  extractClaim = jest.fn();
}
