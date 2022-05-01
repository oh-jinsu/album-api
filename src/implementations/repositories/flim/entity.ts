import { Column, CreateDateColumn, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class FilmEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  userId: string;

  @CreateDateColumn()
  createdAt: Date;
}
