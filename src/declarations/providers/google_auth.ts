import { GoogleClaimModel } from "../models/google_claim";
import { TransactionModel } from "../models/transaction";

export abstract class GoogleAuthProvider {
  abstract verify(idToken: string): Promise<boolean>;

  abstract extractClaim(idToken: string): Promise<GoogleClaimModel>;

  abstract findTransaction(token: string): Promise<TransactionModel>;
}
