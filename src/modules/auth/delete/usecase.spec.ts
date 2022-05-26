import { ClaimModel } from "src/declarations/models/claim";
import { MockAuthProvider } from "src/implementations/providers/auth/mock";
import { MockAuthRepository } from "src/implementations/repositories/auth/mock";
import { MockFriendRepository } from "src/implementations/repositories/friend/mock";
import { MockUserRepository } from "src/implementations/repositories/user/mock";
import { DeleteAuthUseCase } from "./usecase";

describe("Try to delete the auth", () => {
  const authProvider = new MockAuthProvider();

  authProvider.verifyAccessToken.mockResolvedValue(true);

  authProvider.extractClaim.mockResolvedValue(
    new ClaimModel({ id: "an id", grade: "member" }),
  );

  const authRepository = new MockAuthRepository();

  authRepository.delete.mockResolvedValue(null);

  const userRepository = new MockUserRepository();

  userRepository.delete.mockResolvedValue(null);

  const friendRepository = new MockFriendRepository();

  friendRepository.findByUserId.mockImplementation(async () => ({
    next: null,
    items: [],
  }));

  friendRepository.delete.mockResolvedValue(null);

  const usecase = new DeleteAuthUseCase(
    authProvider,
    authRepository,
    userRepository,
    friendRepository,
  );

  it("should be defined", () => {
    expect(usecase).toBeDefined();
  });

  it("should be ok", async () => {
    const result = await usecase.execute({ accessToken: "an access token" });

    if (!result.isOk()) {
      console.log(result);
      fail();
    }

    expect(result).toBeDefined();
  });
});
