import { None, Some } from "src/core/enums/option";
import { AuthModel } from "src/declarations/models/auth";
import { GoogleClaimModel } from "src/declarations/models/google_claim";
import { MockAuthProvider } from "src/implementations/providers/auth/mock";
import { MockGoogleAuthProvider } from "src/implementations/providers/google_auth/mock";
import { MockHashProvider } from "src/implementations/providers/hash/mock";
import { MockAuthRepository } from "src/implementations/repositories/auth/mock";
import { SignUpWithGoogleUseCase } from "src/modules/auth/sign_up_with_google/usecase";

describe("Try to sign up with google", () => {
  const authProvider = new MockAuthProvider();

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

  authRepository.updateAccessToken.mockImplementation(
    async (id, accessToken) =>
      new AuthModel({
        id,
        key: "a key",
        from: "somewhere",
        accessToken,
        refreshToken: "a refresh token",
        updatedAt: new Date(),
        createdAt: new Date(),
      }),
  );

  authRepository.updateRefreshToken.mockImplementation(
    async (id, refreshToken) =>
      new AuthModel({
        id,
        key: "a key",
        from: "somewhere",
        accessToken: "an access token",
        refreshToken: refreshToken,
        updatedAt: new Date(),
        createdAt: new Date(),
      }),
  );

  const googleAuthProvider = new MockGoogleAuthProvider();

  googleAuthProvider.verify.mockResolvedValue(true);

  googleAuthProvider.extractClaim.mockResolvedValue(
    new GoogleClaimModel({
      id: "an id",
      email: "an email",
    }),
  );

  const hashProvider = new MockHashProvider();

  hashProvider.encode.mockResolvedValue("a hashed value");

  const usecase = new SignUpWithGoogleUseCase(
    authProvider,
    googleAuthProvider,
    hashProvider,
    authRepository,
  );

  it("should be defined", () => {
    expect(usecase).toBeDefined();
  });

  it("should fail for a invalid id token", async () => {
    googleAuthProvider.verify.mockResolvedValueOnce(false);

    const idToken = "an id token";

    const result = await usecase.execute({ idToken });

    if (!result.isException()) {
      fail();
    }

    expect(result.code).toBe(1);

    expect(result.message).toBe("유효하지 않은 인증정보입니다.");
  });

  it("should fail for a existing user", async () => {
    authRepository.findOneByKey.mockResolvedValueOnce(new Some(null));

    const idToken = "an id token";

    const result = await usecase.execute({ idToken });

    if (!result.isException()) {
      fail();
    }

    expect(result.code).toBe(2);

    expect(result.message).toBe("이미 가입한 이용자입니다.");
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
