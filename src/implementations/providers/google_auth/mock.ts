import { GoogleClaimModel } from "src/declarations/models/google_claim";
import { TransactionModel } from "src/declarations/models/transaction";
import { GoogleAuthProvider } from "src/declarations/providers/google_auth";

export class MockGoogleAuthProvider implements GoogleAuthProvider {
  verify = jest.fn<Promise<boolean>, [string]>();

  extractClaim = jest.fn<Promise<GoogleClaimModel>, [string]>();

  findTransaction = jest.fn<Promise<TransactionModel>, [string]>();
}
