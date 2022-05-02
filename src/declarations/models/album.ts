export class AlbumModel {
  public readonly id: string;
  public readonly title: string;
  public readonly updatedAt: Date;
  public readonly createdAt: Date;

  constructor({
    id,
    title,
    updatedAt,
    createdAt,
  }: {
    id: string;
    title: string;
    updatedAt: Date;
    createdAt: Date;
  }) {
    this.id = id;
    this.title = title;
    this.updatedAt = updatedAt;
    this.createdAt = createdAt;
  }
}
