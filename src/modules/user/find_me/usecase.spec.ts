import { None, Some } from "src/core/enums/option";
import { ClaimModel } from "src/declarations/models/claim";
import { UserModel } from "src/declarations/models/user";
import { MockAuthProvider } from "src/implementations/providers/auth/mock";
import { MockUserRepository } from "src/implementations/repositories/user/mock";
import { FindMeUseCase } from "./usecase";

describe("Try to find me", () => {
  const authProvider = new MockAuthProvider();

  authProvider.verifyAccessToken.mockResolvedValue(true);

  authProvider.extractClaim.mockResolvedValue(new ClaimModel({ id: "an id" }));

  const userRepository = new MockUserRepository();

  userRepository.findOne.mockImplementation(
    async (id) =>
      new Some(
        new UserModel({
          id,
          email: "an email",
          from: "somewhere",
          avatar: "an avatar",
          refreshToken: "a refresh token",
          updatedAt: new Date(),
          createdAt: new Date(),
        }),
      ),
  );

  const usecase = new FindMeUseCase(authProvider, userRepository);

  it("should be defined", () => {
    expect(usecase).toBeDefined();
  });

  it("should fail for an invalid access token", async () => {
    authProvider.verifyAccessToken.mockResolvedValueOnce(false);

    const accessToken = "an access token";

    const result = await usecase.execute({ accessToken });

    if (!result.isException()) {
      fail();
    }

    expect(result.code).toBe(102);

    expect(result.message).toBe("유효하지 않은 인증정보입니다.");
  });

  it("should fail for an absent user", async () => {
    userRepository.findOne.mockResolvedValueOnce(new None());

    const accessToken = "an access token";

    const result = await usecase.execute({ accessToken });

    if (!result.isException()) {
      fail();
    }

    expect(result.code).toBe(1);

    expect(result.message).toBe("이용자를 찾지 못했습니다.");
  });

  it("should be ok", async () => {
    const accessToken = "an access token";

    const result = await usecase.execute({ accessToken });

    if (!result.isOk()) {
      fail();
    }

    const { id, email, avatar, updatedAt, createdAt } = result.value;

    expect(id).toBeDefined();
    expect(email).toBeDefined();
    expect(avatar).toBeDefined();
    expect(updatedAt).toBeDefined();
    expect(createdAt).toBeDefined();
  });
});
