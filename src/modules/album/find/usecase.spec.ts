import { Some } from "src/core/enums/option";
import { AlbumModel } from "src/declarations/models/album";
import { ClaimModel } from "src/declarations/models/claim";
import { FriendModel } from "src/declarations/models/friend";
import { PhotoModel } from "src/declarations/models/photo";
import { UserModel } from "src/declarations/models/user";
import { MockAuthProvider } from "src/implementations/providers/auth/mock";
import { MockAlbumRepository } from "src/implementations/repositories/album/mock";
import { MockFriendRepository } from "src/implementations/repositories/friend/mock";
import { MockPhotoRepository } from "src/implementations/repositories/photo/mock";
import { MockUserRepository } from "src/implementations/repositories/user/mock";
import { FindAlbumsUseCase } from "./usecase";

describe("test the find albums usecase", () => {
  const authProvider = new MockAuthProvider();

  authProvider.verifyAccessToken.mockResolvedValue(true);

  authProvider.extractClaim.mockResolvedValue(new ClaimModel({ id: "an id " }));

  const albumRepository = new MockAlbumRepository();

  albumRepository.findByUserId.mockImplementation(async (userId: string) => ({
    next: "an id",
    items: [...Array(10)].map(
      (_, i) =>
        new AlbumModel({
          id: `an id ${i}`,
          userId,
          title: "a title",
          updatedAt: new Date(),
          createdAt: new Date(),
        }),
    ),
  }));

  const photoRepository = new MockPhotoRepository();

  photoRepository.countByAlbumId.mockResolvedValue(10);

  photoRepository.findLatestByAlbumId.mockImplementation(
    async (userId: string) =>
      new Some(
        new PhotoModel({
          id: "an id",
          userId,
          albumId: "an id",
          image: "an image uri",
          description: "a description",
          updatedAt: new Date(),
          createdAt: new Date(),
        }),
      ),
  );

  const friendRepository = new MockFriendRepository();

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
          from: "somewhere",
          email: "an email",
          avatar: "an avatar",
          refreshToken: "a refresh token",
          updatedAt: new Date(),
          createdAt: new Date(),
        }),
      ),
  );

  const usecase = new FindAlbumsUseCase(
    authProvider,
    albumRepository,
    photoRepository,
    friendRepository,
    userRepository,
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

    expect(result.code).toBe(1);

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

    for (const item of result.value.items) {
      for (const value of Object.values(item)) {
        expect(value).toBeDefined();
      }
    }
  });
});
