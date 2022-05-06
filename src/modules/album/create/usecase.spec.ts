import { None, Some } from "src/core/enums/option";
import { AlbumModel } from "src/declarations/models/album";
import { ClaimModel } from "src/declarations/models/claim";
import { FriendModel } from "src/declarations/models/friend";
import { UserModel } from "src/declarations/models/user";
import { MockAuthProvider } from "src/implementations/providers/auth/mock";
import { MockAlbumRepository } from "src/implementations/repositories/album/mock";
import { MockFriendRepository } from "src/implementations/repositories/friend/mock";
import { MockImageRepository } from "src/implementations/repositories/image/mock";
import { MockPhotoRepository } from "src/implementations/repositories/photo/mock";
import { MockUserRepository } from "src/implementations/repositories/user/mock";
import { CreateAlbumUseCase } from "./usecase";

describe("test the create album usecase", () => {
  const authProvider = new MockAuthProvider();

  authProvider.verifyAccessToken.mockResolvedValue(true);

  authProvider.extractClaim.mockResolvedValue(
    new ClaimModel({ id: "an id", grade: "member" }),
  );

  const albumRepository = new MockAlbumRepository();

  albumRepository.save.mockImplementation(
    async ({ title }) =>
      new AlbumModel({
        id: "an id",
        title,
        updatedAt: new Date(),
        createdAt: new Date(),
      }),
  );

  const photoRepository = new MockPhotoRepository();

  photoRepository.countByAlbumId.mockResolvedValue(0);

  photoRepository.findLatestByAlbumId.mockResolvedValue(new None());

  const friendRepository = new MockFriendRepository();

  friendRepository.save.mockImplementation(
    async ({ userId, albumId }) =>
      new FriendModel({
        id: "an id",
        userId,
        albumId,
        createdAt: new Date(),
      }),
  );

  const userRepository = new MockUserRepository();

  userRepository.findOne.mockImplementation(
    async (id: string) =>
      new Some(
        new UserModel({
          id,
          email: "an email",
          name: "a name",
          avatar: "an avatar",
          updatedAt: new Date(),
          createdAt: new Date(),
        }),
      ),
  );

  const imageRepository = new MockImageRepository();

  imageRepository.getPublicImageUri.mockResolvedValueOnce(
    new Some("an image uri"),
  );

  const usecase = new CreateAlbumUseCase(
    authProvider,
    photoRepository,
    friendRepository,
    albumRepository,
    userRepository,
    imageRepository,
  );

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

    expect(result.code).toBe(102);

    expect(result.message).toBe("유효하지 않은 인증정보입니다.");
  });

  it("should fail for an absent user", async () => {
    userRepository.findOne.mockResolvedValueOnce(new None());

    const accessToken = "an access token";

    const title = "a title";

    const result = await usecase.execute({ accessToken, title });

    if (!result.isException()) {
      fail();
    }

    expect(result.code).toBe(1);

    expect(result.message).toBe("이용자를 찾지 못했습니다.");
  });

  it("should be ok", async () => {
    const accessToken = "an access token";

    const title = "a title";

    const result = await usecase.execute({ accessToken, title });

    if (!result.isOk()) {
      fail();
    }

    expect(result.value.id).toBeDefined();

    expect(result.value.title).toBeDefined();

    expect(result.value.coverImageUri).toBeNull();

    expect(result.value.photoCount).toBe(0);

    for (const { id, email, name, avatarImageUri, joinedAt } of result.value
      .users) {
      expect(id).toBeDefined();
      expect(email).toBeDefined();
      expect(name).toBeDefined();
      expect(avatarImageUri).toBeDefined();
      expect(joinedAt).toBeDefined();
    }

    expect(result.value.updatedAt).toBeDefined();

    expect(result.value.createdAt).toBeDefined();
  });
});
