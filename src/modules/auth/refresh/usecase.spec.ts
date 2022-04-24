import { None, Some } from "src/core/enums/option";
import { Claim } from "src/declarations/models/claim";
import { UserModel } from "src/declarations/models/user";
import { MockAuthProvider } from "src/implementations/providers/auth/mock";
import { MockHashProvider } from "src/implementations/providers/hash/mock";
import { MockUserRepository } from "src/implementations/repositories/user/mock";
import { RefreshAuthUseCase } from "./usecase";

describe("test the refresh auth usecase", () => {
  const authProvider = new MockAuthProvider();

  authProvider.verifyRefreshToken.mockResolvedValue(true);

  authProvider.extractClaim.mockResolvedValue(new Claim({ id: "an id" }));

  const hashProvider = new MockHashProvider();

  hashProvider.compare.mockResolvedValue(true);

  const userRepository = new MockUserRepository();

  userRepository.findById.mockImplementation(
    async (key: string) =>
      new Some(
        new UserModel({
          id: key,
          email: "an email",
          refreshToken: "a refresh token",
          updatedAt: new Date(),
          createdAt: new Date(),
        }),
      ),
  );

  const usecase = new RefreshAuthUseCase(
    authProvider,
    hashProvider,
    userRepository,
  );

  it("should be defined", () => {
    expect(usecase).toBeDefined();
  });

  it("should fail for an invalid refresh token", async () => {
    authProvider.verifyRefreshToken.mockResolvedValueOnce(false);

    const refreshToken = "a refresh token";

    const result = await usecase.execute({ refreshToken });

    if (!result.isException()) {
      fail();
    }

    expect(result.code).toBe(1);

    expect(result.message).toBe("유효하지 않은 인증정보입니다.");
  });

  it("should fail for an absent user", async () => {
    userRepository.findById.mockResolvedValueOnce(new None());

    const refreshToken = "a refresh token";

    const result = await usecase.execute({ refreshToken });

    if (!result.isException()) {
      fail();
    }

    expect(result.code).toBe(2);

    expect(result.message).toBe("탈퇴한 이용자입니다.");
  });

  it("should fail for a discarded refresh token", async () => {
    hashProvider.compare.mockResolvedValueOnce(false);

    const refreshToken = "a refresh token";

    const result = await usecase.execute({ refreshToken });

    if (!result.isException()) {
      fail();
    }

    expect(result.code).toBe(3);

    expect(result.message).toBe("폐기된 인증정보입니다.");
  });
});
