export class PhotoModel {
  public readonly id: string;
  public readonly userId: string;
  public readonly albumId: string;
  public readonly image: string;
  public readonly date: Date;
  public readonly description?: string;
  public readonly updatedAt: Date;
  public readonly createdAt: Date;

  constructor({
    id,
    userId,
    albumId,
    image,
    date,
    description,
    updatedAt,
    createdAt,
  }: {
    id: string;
    userId: string;
    albumId: string;
    image: string;
    date: Date;
    description?: string;
    updatedAt: Date;
    createdAt: Date;
  }) {
    this.id = id;
    this.userId = userId;
    this.albumId = albumId;
    this.image = image;
    this.description = description;
    this.date = date;
    this.updatedAt = updatedAt;
    this.createdAt = createdAt;
  }
}
