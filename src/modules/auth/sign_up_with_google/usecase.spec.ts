import { None, Some } from "src/core/enums/option";
import { UserModel } from "src/declarations/models/user";
import { SignUpWithGoogleUseCase } from "src/modules/auth/sign_up_with_google/usecase";

describe("sign_up_usecase_test", () => {
  const userRepository = {
    find: jest.fn(),
    findById: jest.fn(),
    save: jest.fn(),
  };

  const googleAuthProvider = {
    verify: jest.fn(),
    extractClaim: jest.fn(),
  };

  const usecase = new SignUpWithGoogleUseCase(
    userRepository,
    googleAuthProvider,
  );

  it("should be defined", () => {
    googleAuthProvider.verify.mockResolvedValue(true);

    googleAuthProvider.extractClaim.mockResolvedValue("email");

    userRepository.findById.mockResolvedValue(new None());

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
    userRepository.findById.mockResolvedValueOnce(new Some(null));

    const idToken = "an id token";

    const result = await usecase.execute({ idToken });

    if (!result.isException()) {
      fail();
    }

    expect(result.code).toBe(2);

    expect(result.message).toBe("이미 가입한 이용자입니다.");
  });

  it("should sccess", async () => {
    userRepository.save.mockResolvedValueOnce(
      new UserModel({
        id: "1",
        email: "email",
        refreshToken: null,
        updatedAt: new Date(),
        createdAt: new Date(),
      }),
    );

    const idToken = "an id token";

    const result = await usecase.execute({ idToken });

    if (!result.isOk()) {
      fail();
    }

    expect(result.value.id).toBeDefined();

    expect(result.value.email).toBe("email");
  });
});
