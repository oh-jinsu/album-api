export class AlbumModel {
  public readonly id: string;
  public readonly userId: string;
  public readonly title: string;
  public readonly updatedAt: Date;
  public readonly createdAt: Date;

  constructor({
    id,
    userId,
    title,
    updatedAt,
    createdAt,
  }: {
    id: string;
    userId: string;
    title: string;
    updatedAt: Date;
    createdAt: Date;
  }) {
    this.id = id;
    this.userId = userId;
    this.title = title;
    this.updatedAt = updatedAt;
    this.createdAt = createdAt;
  }
}
