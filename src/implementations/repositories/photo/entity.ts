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
  image: string;

  @Column()
  description: string;

  @Column()
  date: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @CreateDateColumn()
  createdAt: Date;
}
