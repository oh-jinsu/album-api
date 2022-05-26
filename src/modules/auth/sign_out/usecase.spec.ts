import { None, Some } from "src/core/types/option";
import { AuthModel } from "src/declarations/models/auth";
import { ClaimModel } from "src/declarations/models/claim";
import { MockAuthProvider } from "src/implementations/providers/auth/mock";
import { MockAuthRepository } from "src/implementations/repositories/auth/mock";
import { SignOutUseCase } from "./usecase";

describe("test a sign out usecase", () => {
  const authProvider = new MockAuthProvider();

  authProvider.verifyAccessToken.mockResolvedValue(true);

  authProvider.extractClaim.mockResolvedValue(
    new ClaimModel({ id: "an id", grade: "member" }),
  );

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

  authRepository.update.mockImplementation(
    async (id, { key, from, accessToken, refreshToken }) =>
      new AuthModel({
        id,
        key: key ?? "a key",
        from: from ?? "somewhere",
        accessToken: accessToken ?? "an access token",
        refreshToken: refreshToken ?? "a refresh token",
        updatedAt: new Date(),
        createdAt: new Date(),
      }),
  );

  const usecase = new SignOutUseCase(authProvider, authRepository);

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

    expect(result.code).toBe(102);

    expect(result.message).toBe("유효하지 않은 인증정보입니다.");
  });

  it("should fail for an invalid token", async () => {
    authRepository.findOne.mockResolvedValueOnce(new None());

    const accessToken = "an access token";

    const result = await usecase.execute({ accessToken });

    if (!result.isException()) {
      fail();
    }

    expect(result.code).toBe(1);

    expect(result.message).toBe("가입자를 찾지 못했습니다.");
  });

  it("should fail for a conflict", async () => {
    authRepository.findOne.mockImplementationOnce(
      async (id: string) =>
        new Some(
          new AuthModel({
            id,
            key: "a key",
            from: "somewhere",
            accessToken: null,
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

    expect(result.code).toBe(2);

    expect(result.message).toBe("이미 로그아웃했습니다.");
  });

  it("should be ok", async () => {
    const accessToken = "an access token";

    const result = await usecase.execute({ accessToken });

    if (!result.isOk()) {
      fail();
    }

    expect(result.value).toBeNull();
  });
});
