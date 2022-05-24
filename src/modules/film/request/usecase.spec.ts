import { ClaimModel } from "src/declarations/models/claim";
import { TransactionModel } from "src/declarations/models/transaction";
import { MockAppleAuthProvider } from "src/implementations/providers/apple_auth/mock";
import { MockAuthProvider } from "src/implementations/providers/auth/mock";
import { MockGoogleAuthProvider } from "src/implementations/providers/google_auth/mock";
import { MockFilmRepository } from "src/implementations/repositories/flim/mock";
import { RequestFilmUseCase } from "./usecase";

describe("Try to request films", () => {
  const authProvider = new MockAuthProvider();

  authProvider.verifyAccessToken.mockResolvedValue(true);

  authProvider.extractClaim.mockResolvedValue(
    new ClaimModel({ id: "an id", grade: "member" }),
  );

  const appleAuthProvider = new MockAppleAuthProvider();

  appleAuthProvider.findTransaction.mockResolvedValue(
    new TransactionModel({
      id: "an id",
      productId: "a product id",
      purchasedAt: new Date(),
    }),
  );

  const googleAuthProvider = new MockGoogleAuthProvider();

  googleAuthProvider.findTransaction.mockResolvedValue(
    new TransactionModel({
      id: "an id",
      productId: "a product id",
      purchasedAt: new Date(),
    }),
  );

  const filmRepository = new MockFilmRepository();

  filmRepository.countByUserId.mockResolvedValue(10);

  const usecase = new RequestFilmUseCase(
    authProvider,
    appleAuthProvider,
    googleAuthProvider,
    filmRepository,
  );

  it("should be defined", () => {
    expect(usecase).toBeDefined();
  });

  it("should fail for an invalid access token", async () => {
    authProvider.verifyAccessToken.mockResolvedValueOnce(false);

    const accessToken = "an access token";

    const source = "app_store";

    const token = "a token";

    const productId = "a product id";

    const result = await usecase.execute({
      accessToken,
      source,
      token,
      productId,
    });

    if (!result.isException()) {
      fail();
    }

    expect(result.code).toBe(102);

    expect(result.message).toBe("유효하지 않은 인증정보입니다.");
  });

  it("should be ok", async () => {
    const accessToken = "an access token";

    const source = "app_store";

    const token = "a token";

    const productId = "a product id";

    const result = await usecase.execute({
      accessToken,
      source,
      token,
      productId,
    });

    if (!result.isOk()) {
      fail();
    }

    expect(result.value.count).toBeDefined();
  });
});
