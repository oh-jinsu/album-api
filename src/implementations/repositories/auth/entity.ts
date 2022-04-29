import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity()
export class AuthEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  key: string;

  @Column()
  from: string;

  @Column({
    type: "text",
    nullable: true,
  })
  accessToken: string;

  @Column({
    nullable: true,
  })
  refreshToken: string;

  @UpdateDateColumn()
  updatedAt: Date;

  @CreateDateColumn()
  createdAt: Date;
}
