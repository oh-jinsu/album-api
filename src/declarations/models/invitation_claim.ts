export class InvitationClaimModel {
  public readonly id: string;
  public readonly title: string;
  public readonly owner: string;

  constructor({
    id,
    title,
    owner,
  }: {
    id: string;
    title: string;
    owner: string;
  }) {
    this.id = id;
    this.title = title;
    this.owner = owner;
  }
}
