import { None, Some } from "src/core/enums/option";
import { AlbumModel } from "src/declarations/models/album";
import { ClaimModel } from "src/declarations/models/claim";
import { PhotoModel } from "src/declarations/models/photo";
import { MockAuthProvider } from "src/implementations/providers/auth/mock";
import { MockAlbumRepository } from "src/implementations/repositories/album/mock";
import { MockImageRepository } from "src/implementations/repositories/image/mock";
import { MockPhotoRepository } from "src/implementations/repositories/photo/mock";
import { FindPhotosUseCase } from "./usecase";

describe("Try to find photos", () => {
  const authProvider = new MockAuthProvider();

  authProvider.verifyAccessToken.mockResolvedValue(true);

  authProvider.extractClaim.mockResolvedValue(
    new ClaimModel({
      id: "an user id",
    }),
  );

  const albumRepository = new MockAlbumRepository();

  albumRepository.findOne.mockImplementation(
    async (id) =>
      new Some(
        new AlbumModel({
          id,
          userId: "an user id",
          title: "a title",
          updatedAt: new Date(),
          createdAt: new Date(),
        }),
      ),
  );

  const photoRepository = new MockPhotoRepository();

  photoRepository.findByAlbumId.mockImplementation(async (albumId, limit) => ({
    next: "the next id",
    items: [...Array(limit)].map(
      (_, i) =>
        new PhotoModel({
          id: `an id ${i}`,
          userId: "an user id",
          albumId,
          image: "an image",
          description: "a description",
          updatedAt: new Date(),
          createdAt: new Date(),
        }),
    ),
  }));

  const imageRepository = new MockImageRepository();

  imageRepository.getPublicImageUri.mockResolvedValue(
    new Some("a public image uri"),
  );

  const usecase = new FindPhotosUseCase(
    authProvider,
    albumRepository,
    photoRepository,
    imageRepository,
  );

  it("should be defined", () => {
    expect(usecase).toBeDefined();
  });

  it("should fail for an invalid access token", async () => {
    authProvider.verifyAccessToken.mockResolvedValueOnce(false);

    const params = {
      accessToken: "an access token",
      albumId: "an album id",
      limit: 10,
      cursor: null,
    };

    const result = await usecase.execute(params);

    if (!result.isException()) {
      fail();
    }

    expect(result.code).toBe(102);

    expect(result.message).toBe("유효하지 않은 인증정보입니다.");
  });

  it("should fail for an absent album", async () => {
    albumRepository.findOne.mockResolvedValueOnce(new None());

    const params = {
      accessToken: "an access token",
      albumId: "an album id",
      limit: 10,
      cursor: null,
    };

    const result = await usecase.execute(params);

    if (!result.isException()) {
      fail();
    }

    expect(result.code).toBe(1);

    expect(result.message).toBe("앨범을 찾지 못했습니다.");
  });

  it("should fail for access an album which is not mine", async () => {
    albumRepository.findOne.mockImplementationOnce(
      async (id) =>
        new Some(
          new AlbumModel({
            id,
            userId: "another userId",
            title: "a title",
            updatedAt: new Date(),
            createdAt: new Date(),
          }),
        ),
    );

    const params = {
      accessToken: "an access token",
      albumId: "an album id",
      limit: 10,
      cursor: null,
    };

    const result = await usecase.execute(params);

    if (!result.isException()) {
      fail();
    }

    expect(result.code).toBe(2);

    expect(result.message).toBe("권한이 없습니다.");
  });

  it("should be ok", async () => {
    const params = {
      accessToken: "an access token",
      albumId: "an album id",
      limit: 10,
      cursor: null,
    };

    const result = await usecase.execute(params);

    if (!result.isOk()) {
      fail();
    }

    expect(result.value.next).toBeDefined();

    for (const {
      id,
      publicImageUri,
      description,
      updatedAt,
      createdAt,
    } of result.value.items) {
      expect(id).toBeDefined();
      expect(publicImageUri).toBeDefined();
      expect(description).toBeDefined();
      expect(updatedAt).toBeDefined();
      expect(createdAt).toBeDefined();
    }
  });
});
