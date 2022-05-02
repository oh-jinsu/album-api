import { FilmModel } from "src/declarations/models/film";
import { UserModel } from "src/declarations/models/user";
import { MockFilmRepository } from "src/implementations/repositories/flim/mock";
import { MockUserRepository } from "src/implementations/repositories/user/mock";
import { PresentFilmsUseCase } from "./usecase";

describe("Try to present films", () => {
  const userRepository = new MockUserRepository();

  userRepository.find.mockResolvedValue(
    [...Array(10)].map(
      (_, i) =>
        new UserModel({
          id: `an id ${i}`,
          name: "a name",
          email: "an email",
          avatar: "an avatar",
          updatedAt: new Date(),
          createdAt: new Date(),
        }),
    ),
  );

  const filmRepository = new MockFilmRepository();

  filmRepository.save.mockImplementation(
    async (userId) =>
      new FilmModel({
        id: "an id",
        userId,
        createdAt: new Date(),
      }),
  );

  const usecase = new PresentFilmsUseCase(userRepository, filmRepository);

  it("should be defined", () => {
    expect(usecase).toBeDefined();
  });

  it("should be ok", async () => {
    const result = await usecase.execute();

    expect(result.isOk()).toBeTruthy();
  });
});
