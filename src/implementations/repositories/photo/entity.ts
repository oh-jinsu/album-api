import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity()
export class PhotoEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  userId: string;

  @Column()
  albumId: string;

  @Column()
  imageUri: string;

  @Column()
  description: string;

  @UpdateDateColumn()
  updatedAt: Date;

  @CreateDateColumn()
  createdAt: Date;
}
