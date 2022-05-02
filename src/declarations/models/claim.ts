export type ClaimGrade = "guest" | "member";

export class ClaimModel {
  public readonly id: string;
  public readonly grade: ClaimGrade;

  constructor({ id, grade }: { id: string; grade: ClaimGrade }) {
    this.id = id;
    this.grade = grade;
  }
}
