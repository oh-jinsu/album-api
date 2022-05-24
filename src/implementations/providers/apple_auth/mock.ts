import { AppleClaimModel } from "src/declarations/models/apple_claim";
import { TransactionModel } from "src/declarations/models/transaction";
import { AppleAuthProvider } from "src/declarations/providers/apple_auth";

export class MockAppleAuthProvider implements AppleAuthProvider {
  verify = jest.fn<Promise<boolean>, [string]>();

  extractClaim = jest.fn<Promise<AppleClaimModel>, [string]>();

  findTransaction = jest.fn<Promise<TransactionModel>, [string]>();
}
