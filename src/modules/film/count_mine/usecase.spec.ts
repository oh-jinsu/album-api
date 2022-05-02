import { ClaimModel } from "src/declarations/models/claim";
import { MockAuthProvider } from "src/implementations/providers/auth/mock";
import { MockFilmRepository } from "src/implementations/repositories/flim/mock";
import { CountMyFilmUseCase } from "./usecase";

describe("Try to count my film", () => {
  const authProvider = new MockAuthProvider();

  authProvider.verifyAccessToken.mockResolvedValue(true);

  authProvider.extractClaim.mockResolvedValue(new ClaimModel({ id: "an id" }));

  const filmRepository = new MockFilmRepository();

  filmRepository.countByUserId.mockResolvedValue(10);

  const usecase = new CountMyFilmUseCase(authProvider, filmRepository);

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

  it("should be ok", async () => {
    const accessToken = "an access token";

    const result = await usecase.execute({ accessToken });

    if (!result.isOk()) {
      fail();
    }

    expect(result.value.count).toBe(10);
  });
});
