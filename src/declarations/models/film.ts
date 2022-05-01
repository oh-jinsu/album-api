export class FilmModel {
  public readonly id: string;
  public readonly userId: string;
  public readonly createdAt: Date;

  constructor({
    id,
    userId,
    createdAt,
  }: {
    id: string;
    userId: string;
    createdAt: Date;
  }) {
    this.id = id;
    this.userId = userId;
    this.createdAt = createdAt;
  }
}
