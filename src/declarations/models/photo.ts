export class PhotoModel {
  public readonly id: string;
  public readonly userId: string;
  public readonly albumId: string;
  public readonly imageUri: string;
  public readonly description: string;
  public readonly updatedAt: Date;
  public readonly createdAt: Date;

  constructor({
    id,
    userId,
    albumId,
    imageUri,
    description,
    updatedAt,
    createdAt,
  }: {
    id: string;
    userId: string;
    albumId: string;
    imageUri: string;
    description: string;
    updatedAt: Date;
    createdAt: Date;
  }) {
    this.id = id;
    this.userId = userId;
    this.albumId = albumId;
    this.imageUri = imageUri;
    this.description = description;
    this.updatedAt = updatedAt;
    this.createdAt = createdAt;
  }
}
