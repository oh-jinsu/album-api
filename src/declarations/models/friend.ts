export class FriendModel {
  public readonly id: string;
  public readonly userId: string;
  public readonly albumId: string;

  constructor({
    id,
    userId,
    albumId,
  }: {
    id: string;
    userId: string;
    albumId: string;
  }) {
    this.id = id;
    this.userId = userId;
    this.albumId = albumId;
  }
}
