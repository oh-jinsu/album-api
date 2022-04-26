export class FriendModel {
  public readonly id: string;
  public readonly userId: string;
  public readonly albumId: string;
  public readonly createdAt: Date;

  constructor({
    id,
    userId,
    albumId,
    createdAt,
  }: {
    id: string;
    userId: string;
    albumId: string;
    createdAt: Date;
  }) {
    this.id = id;
    this.userId = userId;
    this.albumId = albumId;
    this.createdAt = createdAt;
  }
}
