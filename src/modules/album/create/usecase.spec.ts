import { AlbumModel } from "src/declarations/models/album";
import { Claim } from "src/declarations/models/claim";
import { MockAuthProvider } from "src/implementations/providers/auth/mock";
import { MockAlbumRepository } from "src/implementations/repositories/album/mock";
import { CreateAlbumUseCase } from "./usecase";

describe("test the create album usecase", () => {
  const authProvider = new MockAuthProvider();

  authProvider.verifyAccessToken.mockResolvedValue(true);

  authProvider.extractClaim.mockResolvedValue(new Claim({ id: "an id " }));

  const albumRepository = new MockAlbumRepository();

  albumRepository.save.mockImplementation(
    async ({ userId, title }) =>
      new AlbumModel({
        id: "an id",
        userId,
        title,
        updatedAt: new Date(),
        createdAt: new Date(),
      }),
  );

  const usecase = new CreateAlbumUseCase(authProvider, albumRepository);

  it("should be defined", () => {
    expect(usecase).toBeDefined();
  });

  it("should fail for an invalid access token", async () => {
    authProvider.verifyAccessToken.mockResolvedValueOnce(false);

    const accessToken = "an access token";

    const title = "a title";

    const result = await usecase.execute({ accessToken, title });

    if (!result.isException()) {
      fail();
    }

    expect(result.code).toBe(1);

    expect(result.message).toBe("유효하지 않은 인증정보입니다.");
  });

  it("should fail for an invalid access token", async () => {
    const accessToken = "an access token";

    const title = "a title";

    const result = await usecase.execute({ accessToken, title });

    if (!result.isOk()) {
      fail();
    }

    expect(result.value.id).toBeDefined();

    expect(result.value.title).toBeDefined();

    expect(result.value.createdAt).toBeDefined();
  });
});