import { None, Some } from "src/core/enums/option";
import { Claim } from "src/declarations/models/claim";
import { UserModel } from "src/declarations/models/user";
import { UpdateUserDto } from "src/declarations/repositories/user";
import { MockAuthProvider } from "src/implementations/providers/auth/mock";
import { MockUserRepository } from "src/implementations/repositories/user/mock";
import { SignOutUseCase } from "./usecase";

describe("test a sign out usecase", () => {
  const authProvider = new MockAuthProvider();

  authProvider.verifyAccessToken.mockResolvedValue(true);

  authProvider.extractClaim.mockResolvedValue(new Claim({ id: "an id" }));

  const userRepository = new MockUserRepository();

  userRepository.findById.mockImplementation(
    async (id: string) =>
      new Some(
        new UserModel({
          id,
          email: "an email",
          refreshToken: "a refresh token",
          updatedAt: new Date(),
          createdAt: new Date(),
        }),
      ),
  );

  userRepository.update.mockImplementation(
    async (id: string, option: UpdateUserDto) =>
      new UserModel({
        id,
        email: option.email || "an email",
        refreshToken: option.refreshToken || "a refresh token",
        updatedAt: new Date(),
        createdAt: new Date(),
      }),
  );

  const usecase = new SignOutUseCase(authProvider, userRepository);

  it("should be defined", () => {
    expect(usecase).toBeDefined();
  });

  it("should fail for an invalid token", async () => {
    authProvider.verifyAccessToken.mockResolvedValueOnce(false);

    const accessToken = "an access token";

    const result = await usecase.execute({ accessToken });

    if (!result.isException()) {
      fail();
    }

    expect(result.code).toBe(1);

    expect(result.message).toBe("유효하지 않은 인증정보입니다.");
  });

  it("should fail for an invalid token", async () => {
    userRepository.findById.mockResolvedValueOnce(new None());

    const accessToken = "an access token";

    const result = await usecase.execute({ accessToken });

    if (!result.isException()) {
      fail();
    }

    expect(result.code).toBe(2);

    expect(result.message).toBe("이용자를 찾지 못했습니다.");
  });

  it("should fail for a conflict", async () => {
    userRepository.findById.mockImplementationOnce(
      async (id: string) =>
        new Some(
          new UserModel({
            id,
            email: "an email",
            refreshToken: null,
            updatedAt: new Date(),
            createdAt: new Date(),
          }),
        ),
    );

    const accessToken = "an access token";

    const result = await usecase.execute({ accessToken });

    if (!result.isException()) {
      fail();
    }

    expect(result.code).toBe(3);

    expect(result.message).toBe("이미 로그아웃한 이용자입니다.");
  });

  it("should success", async () => {
    const accessToken = "an access token";

    const result = await usecase.execute({ accessToken });

    if (!result.isOk()) {
      fail();
    }

    expect(result.value).toBeNull();
  });
});
