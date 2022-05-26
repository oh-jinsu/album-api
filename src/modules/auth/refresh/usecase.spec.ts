import { None, Some } from "src/core/types/option";
import { AuthModel } from "src/declarations/models/auth";
import { ClaimModel } from "src/declarations/models/claim";
import { MockAuthProvider } from "src/implementations/providers/auth/mock";
import { MockHashProvider } from "src/implementations/providers/hash/mock";
import { MockAuthRepository } from "src/implementations/repositories/auth/mock";
import { RefreshAuthUseCase } from "./usecase";

describe("test the refresh auth usecase", () => {
  const authProvider = new MockAuthProvider();

  authProvider.verifyRefreshToken.mockResolvedValue(true);

  authProvider.extractClaim.mockResolvedValue(
    new ClaimModel({ id: "an id", grade: "member" }),
  );

  const hashProvider = new MockHashProvider();

  hashProvider.compare.mockResolvedValue(true);

  const authRepository = new MockAuthRepository();

  authRepository.findOne.mockImplementation(
    async (id: string) =>
      new Some(
        new AuthModel({
          id,
          key: "a key",
          from: "somewhere",
          accessToken: "an access token",
          refreshToken: "a refresh token",
          updatedAt: new Date(),
          createdAt: new Date(),
        }),
      ),
  );

  const usecase = new RefreshAuthUseCase(
    authProvider,
    hashProvider,
    authRepository,
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
    authRepository.findOne.mockResolvedValueOnce(new None());

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

  it("should return the new one", async () => {
    authProvider.verifyAccessToken.mockResolvedValueOnce(false);

    authProvider.issueAccessToken.mockResolvedValue("a new access token");

    const refreshToken = "a refresh token";

    const result = await usecase.execute({ refreshToken });

    if (!result.isOk()) {
      fail();
    }

    expect(result.value.accessToken).toBe("a new access token");
  });

  it("should return the old one", async () => {
    authProvider.verifyAccessToken.mockResolvedValueOnce(true);

    authProvider.issueAccessToken.mockResolvedValue("a new access token");

    const refreshToken = "a refresh token";

    const result = await usecase.execute({ refreshToken });

    if (!result.isOk()) {
      fail();
    }

    expect(result.value.accessToken).toBe("an access token");
  });
});
