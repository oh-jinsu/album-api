import { AppleClaimModel } from "../models/apple_claim";
import { TransactionModel } from "../models/transaction";

export abstract class AppleAuthProvider {
  abstract verify(idToken: string): Promise<boolean>;

  abstract extractClaim(idToken: string): Promise<AppleClaimModel>;

  abstract findTransaction(token: string): Promise<TransactionModel>;
}
