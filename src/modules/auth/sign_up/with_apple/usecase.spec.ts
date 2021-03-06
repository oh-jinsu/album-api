import { None, Some } from "src/core/types/option";
import { AppleClaimModel } from "src/declarations/models/apple_claim";
import { AuthModel } from "src/declarations/models/auth";
import { ClaimModel } from "src/declarations/models/claim";
import { MockAppleAuthProvider } from "src/implementations/providers/apple_auth/mock";
import { MockAuthProvider } from "src/implementations/providers/auth/mock";
import { MockHashProvider } from "src/implementations/providers/hash/mock";
import { MockAuthRepository } from "src/implementations/repositories/auth/mock";
import { MockUserRepository } from "src/implementations/repositories/user/mock";
import { SignUpWithAppleUseCase } from "./usecase";

describe("Try to sign up with apple", () => {
  const authProvider = new MockAuthProvider();

  authProvider.verifyAccessToken.mockResolvedValue(true);

  authProvider.extractClaim.mockResolvedValue(
    new ClaimModel({
      id: "an id",
      grade: "guest",
    }),
  );

  authProvider.issueAccessToken.mockResolvedValue("an access token");

  authProvider.issueRefreshToken.mockResolvedValue("an refresh token");

  const authRepository = new MockAuthRepository();

  authRepository.findOneByKey.mockResolvedValue(new None());

  authRepository.save.mockImplementation(
    async ({ key, from }) =>
      new AuthModel({
        id: "an id",
        key,
        from,
        accessToken: null,
        refreshToken: null,
        updatedAt: new Date(),
        createdAt: new Date(),
      }),
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

  const appleAuthProvider = new MockAppleAuthProvider();

  appleAuthProvider.verify.mockResolvedValue(true);

  appleAuthProvider.extractClaim.mockResolvedValue(
    new AppleClaimModel({
      id: "an id",
      email: "an email",
    }),
  );

  const hashProvider = new MockHashProvider();

  hashProvider.encode.mockResolvedValue("a hashed value");

  const userRepository = new MockUserRepository();

  userRepository.delete.mockResolvedValue(null);

  const usecase = new SignUpWithAppleUseCase(
    authProvider,
    appleAuthProvider,
    hashProvider,
    authRepository,
    userRepository,
  );

  it("should be defined", () => {
    expect(usecase).toBeDefined();
  });

  it("should fail for a invalid id token", async () => {
    appleAuthProvider.verify.mockResolvedValueOnce(false);

    const accessToken = "an access token";

    const idToken = "an id token";

    const result = await usecase.execute({ accessToken, idToken });

    if (!result.isException()) {
      fail();
    }

    expect(result.code).toBe(1);

    expect(result.message).toBe("???????????? ?????? ?????????????????????.");
  });

  it("should fail for a existing user", async () => {
    authRepository.findOneByKey.mockResolvedValueOnce(new Some(null));

    const accessToken = "an access token";

    const idToken = "an id token";

    const result = await usecase.execute({ accessToken, idToken });

    if (!result.isException()) {
      fail();
    }

    expect(result.code).toBe(2);

    expect(result.message).toBe("?????? ????????? ??????????????????.");
  });

  it("should be ok", async () => {
    const accessToken = "an access token";

    const idToken = "an id token";

    const result = await usecase.execute({ accessToken, idToken });

    if (!result.isOk()) {
      fail();
    }

    expect(result.value.accessToken).toBeDefined();

    expect(result.value.refreshToken).toBeDefined();
  });
});
