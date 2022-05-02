import { AuthModel } from "src/declarations/models/auth";
import { MockAuthProvider } from "src/implementations/providers/auth/mock";
import { MockHashProvider } from "src/implementations/providers/hash/mock";
import { MockAuthRepository } from "src/implementations/repositories/auth/mock";
import { IssueGuestTokenUseCase } from "./usecase";

describe("Try to issue guest tokens", () => {
  const authProvider = new MockAuthProvider();

  authProvider.issueAccessToken.mockResolvedValue("an access token");

  authProvider.issueRefreshToken.mockResolvedValue("an refresh token");

  const authRepository = new MockAuthRepository();

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

  const hashProvider = new MockHashProvider();

  hashProvider.encode.mockResolvedValue("a hashed value");

  const usecase = new IssueGuestTokenUseCase(
    authProvider,
    hashProvider,
    authRepository,
  );

  it("should be defined", () => {
    expect(usecase).toBeDefined();
  });

  it("should be ok", async () => {
    const result = await usecase.execute();

    if (!result.isOk()) {
      fail();
    }

    expect(result.value.accessToken).toBeDefined();

    expect(result.value.refreshToken).toBeDefined();
  });
});
