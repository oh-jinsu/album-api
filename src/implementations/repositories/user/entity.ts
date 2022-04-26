import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity()
export class UserEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  from: string;

  @Column({
    nullable: true,
  })
  email: string;

  @Column()
  avatar: string;

  @Column({
    nullable: true,
  })
  refreshToken: string;

  @UpdateDateColumn()
  updatedAt: Date;

  @CreateDateColumn()
  createdAt: Date;
}
