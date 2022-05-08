import { Some } from "src/core/enums/option";
import { AlbumModel } from "src/declarations/models/album";
import { ClaimModel } from "src/declarations/models/claim";
import { FriendModel } from "src/declarations/models/friend";
import { PhotoModel } from "src/declarations/models/photo";
import { UserModel } from "src/declarations/models/user";
import { MockAuthProvider } from "src/implementations/providers/auth/mock";
import { MockAlbumRepository } from "src/implementations/repositories/album/mock";
import { MockFriendRepository } from "src/implementations/repositories/friend/mock";
import { MockImageRepository } from "src/implementations/repositories/image/mock";
import { MockPhotoRepository } from "src/implementations/repositories/photo/mock";
import { MockUserRepository } from "src/implementations/repositories/user/mock";
import { FindAlbumsUseCase } from "./usecase";

describe("test the find albums usecase", () => {
  const authProvider = new MockAuthProvider();

  authProvider.verifyAccessToken.mockResolvedValue(true);

  authProvider.extractClaim.mockResolvedValue(
    new ClaimModel({ id: "an id", grade: "member" }),
  );

  const albumRepository = new MockAlbumRepository();

  albumRepository.findOne.mockImplementation(
    async (id) =>
      new Some(
        new AlbumModel({
          id,
          title: "a title",
          updatedAt: new Date(),
          createdAt: new Date(),
        }),
      ),
  );

  const photoRepository = new MockPhotoRepository();

  photoRepository.countByAlbumId.mockResolvedValue(10);

  photoRepository.findLatestByAlbumId.mockImplementation(
    async (userId: string) =>
      new Some(
        new PhotoModel({
          id: "an id",
          userId,
          albumId: "an id",
          date: new Date(),
          image: "an image uri",
          description: "a description",
          updatedAt: new Date(),
          createdAt: new Date(),
        }),
      ),
  );

  const friendRepository = new MockFriendRepository();

  friendRepository.findByUserId.mockImplementation(async (userId, limit) => ({
    next: null,
    items: [...Array(limit)].map(
      (_, i) =>
        new FriendModel({
          id: `an id ${i}`,
          userId,
          albumId: "album id",
          createdAt: new Date(),
        }),
    ),
  }));

  friendRepository.findByAlbumId.mockImplementation(async (albumId) =>
    [...Array(3)].map(
      (_, i) =>
        new FriendModel({
          id: `an id ${i.toString()}`,
          userId: `an user id ${i.toString()}`,
          albumId,
          createdAt: new Date(),
        }),
    ),
  );

  const userRepository = new MockUserRepository();

  userRepository.findOne.mockImplementation(
    async (id: string) =>
      new Some(
        new UserModel({
          id,
          name: "a name",
          email: "an email",
          avatar: "an avatar",
          updatedAt: new Date(),
          createdAt: new Date(),
        }),
      ),
  );

  const imageRepository = new MockImageRepository();

  imageRepository.getPublicImageUri.mockResolvedValue(new Some("an image"));

  const usecase = new FindAlbumsUseCase(
    authProvider,
    albumRepository,
    photoRepository,
    friendRepository,
    userRepository,
    imageRepository,
  );

  it("should be defined", () => {
    expect(usecase).toBeDefined();
  });

  it("should fail for an invalid access token", async () => {
    authProvider.verifyAccessToken.mockResolvedValueOnce(false);

    const accessToken = "an access token";

    const limit = 10;

    const cursor = null;

    const result = await usecase.execute({ accessToken, limit, cursor });

    if (!result.isException()) {
      fail();
    }

    expect(result.code).toBe(102);

    expect(result.message).toBe("유효하지 않은 인증정보입니다.");
  });

  it("should fail for an invalid access token", async () => {
    const accessToken = "an access token";

    const limit = 10;

    const cursor = null;

    const result = await usecase.execute({ accessToken, limit, cursor });

    if (!result.isOk()) {
      fail();
    }

    expect(result.value.next).toBeDefined();

    for (const {
      id,
      title,
      coverImageUri,
      photoCount,
      users,
      updatedAt,
      createdAt,
    } of result.value.items) {
      expect(id).toBeDefined();
      expect(title).toBeDefined();
      expect(coverImageUri).toBeDefined();
      expect(photoCount).toBe(10);

      for (const { id, email, name, avatarImageUri, joinedAt } of users) {
        expect(id).toBeDefined();
        expect(email).toBeDefined();
        expect(name).toBeDefined();
        expect(avatarImageUri).toBeDefined();
        expect(joinedAt).toBeDefined();
      }

      expect(updatedAt).toBeDefined();
      expect(createdAt).toBeDefined();
    }
  });
});
