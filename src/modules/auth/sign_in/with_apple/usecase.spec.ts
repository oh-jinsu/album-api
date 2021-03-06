import { None, Some } from "src/core/types/option";
import { AppleClaimModel } from "src/declarations/models/apple_claim";
import { AuthModel } from "src/declarations/models/auth";
import { MockAppleAuthProvider } from "src/implementations/providers/apple_auth/mock";
import { MockAuthProvider } from "src/implementations/providers/auth/mock";
import { MockHashProvider } from "src/implementations/providers/hash/mock";
import { MockAuthRepository } from "src/implementations/repositories/auth/mock";
import { SignInWithAppleUseCase } from "./usecase";

describe("test the sign in with google usecase", () => {
  const authProvider = new MockAuthProvider();

  authProvider.issueAccessToken.mockResolvedValue("new access token");

  authProvider.issueRefreshToken.mockResolvedValue("new refresh token");

  const appleAuthProvider = new MockAppleAuthProvider();

  appleAuthProvider.verify.mockResolvedValue(true);

  appleAuthProvider.extractClaim.mockResolvedValue(
    new AppleClaimModel({ id: "an id", email: "an email" }),
  );

  const hashProvider = new MockHashProvider();

  hashProvider.encode.mockImplementation(async (value) => value);

  const authRepository = new MockAuthRepository();

  authRepository.findOneByKey.mockImplementation(
    async (key) =>
      new Some(
        new AuthModel({
          id: "an id",
          key,
          from: "somewhere",
          accessToken: "an access token",
          refreshToken: "an refresh token",
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

  const usecase = new SignInWithAppleUseCase(
    authProvider,
    appleAuthProvider,
    hashProvider,
    authRepository,
  );

  it("should be defined", () => {
    expect(usecase).toBeDefined();
  });

  it("should fail for an invalid id token", async () => {
    appleAuthProvider.verify.mockResolvedValueOnce(false);

    const idToken = "an id token";

    const result = await usecase.execute({ idToken });

    if (!result.isException()) {
      fail();
    }

    expect(result.code).toBe(1);

    expect(result.message).toBe("???????????? ?????? ?????????????????????.");
  });

  it("should fail for an absent user", async () => {
    authRepository.findOneByKey.mockResolvedValueOnce(new None());

    const idToken = "an id token";

    const result = await usecase.execute({ idToken });

    if (!result.isException()) {
      fail();
    }

    expect(result.code).toBe(2);

    expect(result.message).toBe("???????????? ?????? ???????????????.");
  });

  it("should be ok", async () => {
    const idToken = "an id token";

    const result = await usecase.execute({ idToken });

    if (!result.isOk()) {
      fail();
    }

    expect(result.value.accessToken).toBeDefined();

    expect(result.value.refreshToken).toBeDefined();
  });
});
