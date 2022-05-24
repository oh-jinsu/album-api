export class TransactionModel {
  public readonly id: string;
  public readonly productId: string;
  public readonly purchasedAt: Date;

  constructor({
    id,
    productId,
    purchasedAt,
  }: {
    id: string;
    productId: string;
    purchasedAt: Date;
  }) {
    this.id = id;
    this.productId = productId;
    this.purchasedAt = purchasedAt;
  }
}
