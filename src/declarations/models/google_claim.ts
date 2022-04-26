export class GoogleClaimModel {
  public readonly id: string;
  public readonly email?: string;

  constructor({ id, email }: { id: string; email?: string }) {
    this.id = id;
    this.email = email;
  }
}
