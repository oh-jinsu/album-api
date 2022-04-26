import { None, Some } from "src/core/enums/option";
import { AppleClaimModel } from "src/declarations/models/apple_claim";
import { UserModel } from "src/declarations/models/user";
import { MockAppleAuthProvider } from "src/implementations/providers/apple_auth/mock";
import { MockAuthProvider } from "src/implementations/providers/auth/mock";
import { MockHashProvider } from "src/implementations/providers/hash/mock";
import { MockUserRepository } from "src/implementations/repositories/user/mock";
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

  const userRepository = new MockUserRepository();

  userRepository.findById.mockImplementation(
    async (id) =>
      new Some(
        new UserModel({
          id,
          email: "an email",
          refreshToken: "a refreshToken",
          updatedAt: new Date(),
          createdAt: new Date(),
        }),
      ),
  );

  userRepository.update.mockImplementation(
    async (id, { refreshToken }) =>
      new UserModel({
        id,
        email: "an email",
        refreshToken,
        updatedAt: new Date(),
        createdAt: new Date(),
      }),
  );

  const usecase = new SignInWithAppleUseCase(
    authProvider,
    appleAuthProvider,
    hashProvider,
    userRepository,
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

    expect(result.message).toBe("유효하지 않은 인증정보입니다.");
  });

  it("should fail for an absent user", async () => {
    userRepository.findById.mockResolvedValueOnce(new None());

    const idToken = "an id token";

    const result = await usecase.execute({ idToken });

    if (!result.isException()) {
      fail();
    }

    expect(result.code).toBe(2);

    expect(result.message).toBe("가입하지 않은 이용자입니다.");
  });

  it("should return an access token and a refresh token", async () => {
    const idToken = "an id token";

    const result = await usecase.execute({ idToken });

    if (!result.isOk()) {
      fail();
    }

    expect(result.value.accessToken).toBeDefined();

    expect(result.value.refreshToken).toBeDefined();
  });
});
