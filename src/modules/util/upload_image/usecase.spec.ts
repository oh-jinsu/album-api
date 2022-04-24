import { MockAuthProvider } from "src/implementations/providers/auth/mock";
import { MockImageProvider } from "src/implementations/providers/image/mock";
import { UploadImageUseCase } from "./usecase";

describe("test the upload image usecase", () => {
  const authProvider = new MockAuthProvider();

  authProvider.verifyAccessToken.mockResolvedValue(true);

  const imageProvider = new MockImageProvider();

  imageProvider.put.mockResolvedValue(null);

  imageProvider.get.mockResolvedValue("an image uri");

  const usecase = new UploadImageUseCase(authProvider, imageProvider);

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

    expect(result.code).toBe(1);

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

    expect(result.value.imageUri).toBeDefined();
  });
});
