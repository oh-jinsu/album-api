import { None, Some } from "src/core/enums/option";
import { AlbumModel } from "src/declarations/models/album";
import { ClaimModel } from "src/declarations/models/claim";
import { PhotoModel } from "src/declarations/models/photo";
import { MockAuthProvider } from "src/implementations/providers/auth/mock";
import { MockAlbumRepository } from "src/implementations/repositories/album/mock";
import { MockImageRepository } from "src/implementations/repositories/image/mock";
import { MockPhotoRepository } from "src/implementations/repositories/photo/mock";
import { CreatePhotoUseCase } from "./usecase";

describe("test the create photo usecase", () => {
  const authProvider = new MockAuthProvider();

  authProvider.verifyAccessToken.mockResolvedValue(true);

  authProvider.extractClaim.mockResolvedValue(new ClaimModel({ id: "an id " }));

  const photoRepository = new MockPhotoRepository();

  photoRepository.save.mockImplementation(
    async ({ userId, albumId, image, description }) =>
      new PhotoModel({
        id: "an id",
        userId,
        albumId,
        image,
        description,
        updatedAt: new Date(),
        createdAt: new Date(),
      }),
  );

  const albumRepository = new MockAlbumRepository();

  albumRepository.findOne.mockImplementation(
    async (id) =>
      new Some(
        new AlbumModel({
          id,
          userId: "an userId",
          title: "a title",
          updatedAt: new Date(),
          createdAt: new Date(),
        }),
      ),
  );

  const imageRepository = new MockImageRepository();

  imageRepository.getPublicImageUri.mockResolvedValue(
    new Some("a public image uri"),
  );

  const usecase = new CreatePhotoUseCase(
    authProvider,
    photoRepository,
    albumRepository,
    imageRepository,
  );

  it("should be defiend", () => {
    expect(usecase).toBeDefined();
  });

  it("should fail for an invalid access token", async () => {
    authProvider.verifyAccessToken.mockResolvedValueOnce(false);

    const params = {
      accessToken: "an access token",
      userId: "an user id",
      albumId: "an album id",
      image: "an image",
      description: "a description",
    };

    const result = await usecase.execute(params);

    if (!result.isException()) {
      fail();
    }

    expect(result.code).toBe(1);

    expect(result.message).toBe("유효하지 않은 인증정보입니다.");
  });

  it("should fail for an absent album", async () => {
    albumRepository.findOne.mockResolvedValueOnce(new None());

    const params = {
      accessToken: "an access token",
      userId: "an user id",
      albumId: "an album id",
      image: "an image",
      description: "a description",
    };

    const result = await usecase.execute(params);

    if (!result.isException()) {
      fail();
    }

    expect(result.code).toBe(2);

    expect(result.message).toBe("앨범을 찾지 못했습니다.");
  });

  it("should fail for an unsaved image", async () => {
    imageRepository.getPublicImageUri.mockResolvedValueOnce(new None());

    const params = {
      accessToken: "an access token",
      userId: "an user id",
      albumId: "an album id",
      image: "an image",
      description: "a description",
    };

    const result = await usecase.execute(params);

    if (!result.isException()) {
      fail();
    }

    expect(result.code).toBe(3);

    expect(result.message).toBe("저장된 이미지를 찾지 못했습니다.");
  });

  it("should be ok", async () => {
    const params = {
      accessToken: "an access token",
      userId: "an user id",
      albumId: "an album id",
      image: "an image",
      description: "a description",
    };

    const result = await usecase.execute(params);

    if (!result.isOk()) {
      fail();
    }

    const { id, publicImageUri, description, updatedAt, createdAt } =
      result.value;

    expect(id).toBeDefined();
    expect(publicImageUri).toBeDefined();
    expect(description).toBeDefined();
    expect(updatedAt).toBeDefined();
    expect(createdAt).toBeDefined();
  });
});