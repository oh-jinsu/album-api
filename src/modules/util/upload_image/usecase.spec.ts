import { ClaimModel } from "src/declarations/models/claim";
import { ImageModel } from "src/declarations/models/image";
import { MockAuthProvider } from "src/implementations/providers/auth/mock";
import { MockImageRepository } from "src/implementations/repositories/image/mock";
import { UploadImageUseCase } from "./usecase";

describe("test the upload image usecase", () => {
  const authProvider = new MockAuthProvider();

  authProvider.verifyAccessToken.mockResolvedValue(true);

  authProvider.extractClaim.mockResolvedValue(
    new ClaimModel({
      id: "an id",
      grade: "member",
    }),
  );

  const imageRepository = new MockImageRepository();

  imageRepository.save.mockImplementation(
    async ({ userId }) =>
      new ImageModel({
        id: "an id",
        userId: userId,
        createdAt: new Date(),
      }),
  );

  const usecase = new UploadImageUseCase(authProvider, imageRepository);

  it("should be defined", () => {
    expect(usecase).toBeDefined();
  });

  it("should fail for an invalid access token", async () => {
    authProvider.verifyAccessToken.mockResolvedValueOnce(false);

    const accessToken = "an access token";

    const buffer = Buffer.from([]);

    const mimetype = "image/jpeg";

    const result = await usecase.execute({ accessToken, buffer, mimetype });

    if (!result.isException()) {
      fail();
    }

    expect(result.code).toBe(102);

    expect(result.message).toBe("유효하지 않은 인증정보입니다.");
  });

  it("should return an image uri", async () => {
    const accessToken = "an access token";

    const buffer = Buffer.from([]);

    const mimetype = "image/jpeg";

    const result = await usecase.execute({ accessToken, buffer, mimetype });

    if (!result.isOk()) {
      fail();
    }

    expect(result.value.id).toBeDefined();
    expect(result.value.createdAt).toBeDefined();
  });
});
