import { AppleAuthProvider } from "src/declarations/providers/apple_auth";

export class MockAppleAuthProvider implements AppleAuthProvider {
  verify = jest.fn();

  extractClaim = jest.fn();
}
