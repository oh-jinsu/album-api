import { None, Some } from "src/core/enums/option";
import { AlbumModel } from "src/declarations/models/album";
import { ClaimModel } from "src/declarations/models/claim";
import { FriendModel } from "src/declarations/models/friend";
import { PhotoModel } from "src/declarations/models/photo";
import { MockAuthProvider } from "src/implementations/providers/auth/mock";
import { MockAlbumRepository } from "src/implementations/repositories/album/mock";
import { MockFriendRepository } from "src/implementations/repositories/friend/mock";
import { MockImageRepository } from "src/implementations/repositories/image/mock";
import { MockPhotoRepository } from "src/implementations/repositories/photo/mock";
import { ExitAlbumUseCase } from "./usecase";

describe("try to exit an album", () => {
  const authProvider = new MockAuthProvider();

  authProvider.verifyAccessToken.mockResolvedValue(true);

  authProvider.extractClaim.mockResolvedValue(
    new ClaimModel({ id: "an user id", grade: "member" }),
  );

  const albumRepository = new MockAlbumRepository();

  albumRepository.findOne.mockImplementation(
    async (id: string) =>
      new Some(
        new AlbumModel({
          id,
          title: "a title",
          updatedAt: new Date(),
          createdAt: new Date(),
        }),
      ),
  );

  albumRepository.delete.mockResolvedValue(null);

  const friendRepository = new MockFriendRepository();

  friendRepository.findOne.mockImplementation(
    async (userId, albumId) =>
      new Some(
        new FriendModel({
          id: "an id",
          userId,
          albumId,
          createdAt: new Date(),
        }),
      ),
  );

  friendRepository.findByAlbumId.mockImplementation(async (albumId) => [
    new FriendModel({
      id: "an id",
      userId: "another id",
      albumId,
      createdAt: new Date(),
    }),
  ]);

  friendRepository.delete.mockResolvedValue(null);

  const photoRepository = new MockPhotoRepository();

  photoRepository.findByAlbumId.mockImplementation(async (albumId) => ({
    next: null,
    items: [...Array(10)].map(
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

  photoRepository.delete.mockResolvedValue(null);

  const imageRepository = new MockImageRepository();

  imageRepository.delete.mockResolvedValue(null);

  const usecase = new ExitAlbumUseCase(
    authProvider,
    albumRepository,
    photoRepository,
    friendRepository,
    imageRepository,
  );

  it("should be defined", () => {
    expect(usecase).toBeDefined();
  });

  it("should fail for an invalid access token", async () => {
    authProvider.verifyAccessToken.mockResolvedValueOnce(false);

    const accessToken = "an access token";

    const albumId = "an album id";

    const result = await usecase.execute({ accessToken, albumId });

    if (!result.isException()) {
      fail();
    }

    expect(result.code).toBe(102);

    expect(result.message).toBe("유효하지 않은 인증정보입니다.");
  });

  it("should fail for an absent album", async () => {
    albumRepository.findOne.mockResolvedValueOnce(new None());

    const accessToken = "an access token";

    const albumId = "an album id";

    const result = await usecase.execute({ accessToken, albumId });

    if (!result.isException()) {
      fail();
    }

    expect(result.code).toBe(1);

    expect(result.message).toBe("앨범을 찾지 못했습니다.");
  });

  it("should fail for an absent user", async () => {
    friendRepository.findOne.mockResolvedValueOnce(new None());

    const accessToken = "an access token";

    const albumId = "an album id";

    const result = await usecase.execute({ accessToken, albumId });

    if (!result.isException()) {
      fail();
    }

    expect(result.code).toBe(2);

    expect(result.message).toBe("권한이 없습니다.");
  });

  it("should be ok", async () => {
    const accessToken = "an access token";

    const albumId = "an album id";

    const result = await usecase.execute({ accessToken, albumId });

    if (!result.isOk()) {
      fail();
    }

    expect(result.value).toBeNull();
  });

  it("should be ok when deleting the album", async () => {
    friendRepository.findByAlbumId.mockResolvedValue([]);

    const accessToken = "an access token";

    const albumId = "an album id";

    const result = await usecase.execute({ accessToken, albumId });

    if (!result.isOk()) {
      fail();
    }

    expect(result.value).toBeNull();
  });
});
