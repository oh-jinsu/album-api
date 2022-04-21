export class UserModel {
  public readonly id: number;
  public readonly email: string;

  constructor({ id, email }: { id: number; email: string }) {
    this.id = id;
    this.email = email;
  }
}
