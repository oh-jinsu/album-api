import { AppleClaim } from "src/declarations/models/apple_claim";
import { AppleAuthProvider } from "src/declarations/providers/apple_auth";

export class MockAppleAuthProvider implements AppleAuthProvider {
  verify = jest.fn<Promise<boolean>, [string]>();

  extractClaim = jest.fn<Promise<AppleClaim>, [string]>();
}
