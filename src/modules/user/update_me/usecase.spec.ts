import { None, Some } from "src/core/types/option";
import { ClaimModel } from "src/declarations/models/claim";
import { UserModel } from "src/declarations/models/user";
import { MockAuthProvider } from "src/implementations/providers/auth/mock";
import { MockImageProvider } from "src/implementations/providers/image/mock";
import { MockUserRepository } from "src/implementations/repositories/user/mock";
import { UpdateMeUseCase } from "./usecase";

describe("Try to update me", () => {
  const authProvider = new MockAuthProvider();

  authProvider.verifyAccessToken.mockResolvedValue(true);

  authProvider.extractClaim.mockResolvedValue(
    new ClaimModel({ id: "an id", grade: "member" }),
  );

  const imageProvider = new MockImageProvider();

  imageProvider.getPublicImageUri.mockResolvedValue("a public image");

  const userRepository = new MockUserRepository();

  userRepository.findOne.mockImplementation(
    async (id) =>
      new Some(
        new UserModel({
          id,
          name: "the name",
          email: "an email",
          avatar: "an avatar",
          updatedAt: new Date(),
          createdAt: new Date(),
        }),
      ),
  );

  userRepository.update.mockImplementation(
    async (id, { name, email, avatar }) =>
      new UserModel({
        id,
        name: name || "a name",
        email,
        avatar,
        updatedAt: new Date(),
        createdAt: new Date(),
      }),
  );

  const usecase = new UpdateMeUseCase(
    authProvider,
    userRepository,
    imageProvider,
  );

  it("should be defined", () => {
    expect(usecase).toBeDefined();
  });

  it("should fail for an invalid access token", async () => {
    authProvider.verifyAccessToken.mockResolvedValueOnce(false);

    const accessToken = "an access token";

    const result = await usecase.execute({ accessToken, dtos: [] });

    if (!result.isException()) {
      fail();
    }

    expect(result.code).toBe(102);

    expect(result.message).toBe("유효하지 않은 인증정보입니다.");
  });

  it("should fail for a forbidden user", async () => {
    authProvider.extractClaim.mockResolvedValueOnce(
      new ClaimModel({
        id: "an id",
        grade: "guest",
      }),
    );

    const accessToken = "an access token";

    const result = await usecase.execute({ accessToken, dtos: [] });

    if (!result.isException()) {
      fail();
    }

    expect(result.code).toBe(104);

    expect(result.message).toBe("권한이 없습니다.");
  });

  it("should fail for an absent user", async () => {
    userRepository.findOne.mockResolvedValueOnce(new None());

    const accessToken = "an access token";

    const result = await usecase.execute({ accessToken, dtos: [] });

    if (!result.isException()) {
      fail();
    }

    expect(result.code).toBe(1);

    expect(result.message).toBe("이용자를 찾지 못했습니다.");
  });

  it("should be ok", async () => {
    const accessToken = "an access token";

    const result = await usecase.execute({
      accessToken,
      dtos: [],
    });

    if (!result.isOk()) {
      fail();
    }

    const { id, email, name, avatarImageUri, updatedAt, createdAt } =
      result.value;

    expect(id).toBeDefined();
    expect(email).toBeDefined();
    expect(name).toBeDefined();
    expect(avatarImageUri).toBeDefined();
    expect(updatedAt).toBeDefined();
    expect(createdAt).toBeDefined();
  });
});
