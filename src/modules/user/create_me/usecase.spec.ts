import { None, Some } from "src/core/enums/option";
import { ClaimModel } from "src/declarations/models/claim";
import { FilmModel } from "src/declarations/models/film";
import { UserModel } from "src/declarations/models/user";
import { MockAuthProvider } from "src/implementations/providers/auth/mock";
import { MockFilmRepository } from "src/implementations/repositories/flim/mock";
import { MockImageRepository } from "src/implementations/repositories/image/mock";
import { MockUserRepository } from "src/implementations/repositories/user/mock";
import { CreateMeUseCase } from "./usecase";

describe("Try to create me", () => {
  const authProvider = new MockAuthProvider();

  authProvider.verifyAccessToken.mockResolvedValue(true);

  authProvider.extractClaim.mockResolvedValue(new ClaimModel({ id: "an id" }));

  const userRepository = new MockUserRepository();

  userRepository.findOne.mockResolvedValue(new None());

  userRepository.save.mockImplementation(
    async ({ id, name, email, avatar }) =>
      new UserModel({
        id,
        email,
        name,
        avatar,
        updatedAt: new Date(),
        createdAt: new Date(),
      }),
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

  const imageRepository = new MockImageRepository();

  imageRepository.getPublicImageUri.mockResolvedValue(new Some("an image uri"));

  const usecase = new CreateMeUseCase(
    authProvider,
    userRepository,
    filmRepository,
    imageRepository,
  );

  it("should be defined", () => {
    expect(usecase).toBeDefined();
  });

  it("should fail for an invalid access token", async () => {
    authProvider.verifyAccessToken.mockResolvedValueOnce(false);

    const params = {
      accessToken: "an access token",
      name: "a name",
      email: "an email",
      avatar: "an avatar",
    };

    const result = await usecase.execute(params);

    if (!result.isException()) {
      fail();
    }

    expect(result.code).toBe(102);

    expect(result.message).toBe("유효하지 않은 인증정보입니다.");
  });

  it("should fail for a conflict", async () => {
    userRepository.findOne.mockResolvedValueOnce(new Some(null));

    const params = {
      accessToken: "an access token",
      name: "a name",
      email: "an email",
      avatar: "an avatar",
    };

    const result = await usecase.execute(params);

    if (!result.isException()) {
      fail();
    }

    expect(result.code).toBe(1);

    expect(result.message).toBe("이미 등록된 이용자입니다.");
  });

  it("should fail for a too short name", async () => {
    const params = {
      accessToken: "an access token",
      name: "a",
      email: "an email",
      avatar: "an avatar",
    };

    const result = await usecase.execute(params);

    if (!result.isException()) {
      fail();
    }

    expect(result.code).toBe(2);

    expect(result.message).toBe("이름이 너무 짧습니다.");
  });

  it("should fail for a too long name", async () => {
    const params = {
      accessToken: "an access token",
      name: "namenamenamenamenamenamename",
      email: "an email",
      avatar: "an avatar",
    };

    const result = await usecase.execute(params);

    if (!result.isException()) {
      fail();
    }

    expect(result.code).toBe(3);

    expect(result.message).toBe("이름이 너무 깁니다.");
  });

  it("should fail for an unsaved image", async () => {
    imageRepository.getPublicImageUri.mockResolvedValueOnce(new None());

    const params = {
      accessToken: "an access token",
      name: "a name",
      email: "an email",
      avatar: "an avatar",
    };

    const result = await usecase.execute(params);

    if (!result.isException()) {
      fail();
    }

    expect(result.code).toBe(4);

    expect(result.message).toBe("저장된 이미지를 찾지 못했습니다.");
  });

  it("should be ok", async () => {
    const params = {
      accessToken: "an access token",
      name: "a name",
      email: "an email",
      avatar: "an avatar",
    };

    const result = await usecase.execute(params);

    if (!result.isOk()) {
      fail();
    }

    const { id, name, email, avatarImageUri, updatedAt, createdAt } =
      result.value;

    expect(id).toBeDefined();
    expect(name).toBeDefined();
    expect(email).toBeDefined();
    expect(avatarImageUri).toBeDefined();
    expect(updatedAt).toBeDefined();
    expect(createdAt).toBeDefined();
  });
});
