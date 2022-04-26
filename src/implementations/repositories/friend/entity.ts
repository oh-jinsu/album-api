import { Column, CreateDateColumn, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class FriendEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  userId: string;

  @Column()
  albumId: string;

  @CreateDateColumn()
  createdAt: Date;
}
