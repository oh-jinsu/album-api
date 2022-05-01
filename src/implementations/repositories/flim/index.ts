import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { randomUUID } from "crypto";
import { FilmModel } from "src/declarations/models/film";
import { FilmRepository } from "src/declarations/repositories/film";
import { Repository } from "typeorm";
import { FilmEntity } from "./entity";
import { FilmMapper } from "./mapper";

@Injectable()
export class FilmRepositoryImpl implements FilmRepository {
  constructor(
    @InjectRepository(FilmEntity)
    private readonly adaptee: Repository<FilmEntity>,
  ) {}

  async countByUserId(userId: string): Promise<number> {
    return this.adaptee.count({
      userId,
    });
  }

  async findEalistByUserId(userId: string, take: number): Promise<FilmModel[]> {
    const entities = await this.adaptee.find({
      where: {
        userId,
      },
      order: {
        createdAt: "ASC",
      },
      take,
    });

    return entities.map(FilmMapper.toModel);
  }

  async save(userId: string): Promise<FilmModel> {
    const newone = this.adaptee.create({
      id: randomUUID(),
      userId,
    });

    const entity = await this.adaptee.save(newone);

    return FilmMapper.toModel(entity);
  }

  async delete(id: string): Promise<void> {
    await this.adaptee.delete({ id });
  }
}
