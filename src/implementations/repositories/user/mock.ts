import { UserRepository } from "src/declarations/repositories/user";

export class MockUserRepository implements UserRepository {
  find = jest.fn();

  findById = jest.fn();

  save = jest.fn();

  update = jest.fn();
}
