import { None, Some } from "src/core/enums/option";
import { AlbumModel } from "src/declarations/models/album";
import { ClaimModel } from "src/declarations/models/claim";
import { FriendModel } from "src/declarations/models/friend";
import { InvitationClaimModel } from "src/declarations/models/invitation_claim";
import { PhotoModel } from "src/declarations/models/photo";
import { UserModel } from "src/declarations/models/user";
import { MockAuthProvider } from "src/implementations/providers/auth/mock";
import { MockImageProvider } from "src/implementations/providers/image/mock";
import { MockAlbumRepository } from "src/implementations/repositories/album/mock";
import { MockFriendRepository } from "src/implementations/repositories/friend/mock";
import { MockPhotoRepository } from "src/implementations/repositories/photo/mock";
import { MockUserRepository } from "src/implementations/repositories/user/mock";
import { AcceptInvitationUseCase } from "./usecase";

describe("Try to accept an invitation", () => {
  const authProvider = new MockAuthProvider();

  authProvider.verifyAccessToken.mockResolvedValue(true);

  authProvider.extractClaim.mockResolvedValue(
    new ClaimModel({ id: "an id", grade: "member" }),
  );

  authProvider.verifyInvitationToken.mockResolvedValue(true);

  authProvider.extractInvitationClaim.mockResolvedValue(
    new InvitationClaimModel({
      id: "an id",
      title: "a title",
      owner: "a owner",
    }),
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

  const friendRepository = new MockFriendRepository();

  friendRepository.findOne.mockResolvedValue(new None());

  friendRepository.findByAlbumId.mockImplementation(async (albumId) =>
    [...Array(3)].map(
      (_, i) =>
        new FriendModel({
          id: `an id ${i}`,
          userId: `an user id ${i}`,
          albumId,
          createdAt: new Date(),
        }),
    ),
  );

  friendRepository.save.mockImplementation(
    async ({ userId, albumId }) =>
      new FriendModel({
        id: "an id",
        userId,
        albumId,
        createdAt: new Date(),
      }),
  );

  const photoRepository = new MockPhotoRepository();

  photoRepository.findLatestByAlbumId.mockImplementation(
    async (albumId) =>
      new Some(
        new PhotoModel({
          id: "an id",
          userId: "an user id",
          albumId,
          image: "a image",
          date: new Date(),
          description: "a description",
          updatedAt: new Date(),
          createdAt: new Date(),
        }),
      ),
  );

  photoRepository.countByAlbumId.mockResolvedValue(10);

  const userRepository = new MockUserRepository();

  userRepository.findOne.mockImplementation(
    async (id) =>
      new Some(
        new UserModel({
          id,
          email: "an email",
          name: "the name",
          avatar: "an avatar",
          updatedAt: new Date(),
          createdAt: new Date(),
        }),
      ),
  );

  const imageProvider = new MockImageProvider();

  imageProvider.getPublicImageUri.mockResolvedValue("a public image");

  const usecase = new AcceptInvitationUseCase(
    authProvider,
    albumRepository,
    friendRepository,
    photoRepository,
    userRepository,
    imageProvider,
  );

  it("should be defined", () => {
    expect(usecase).toBeDefined();
  });

  it("should fail for an invalid token", async () => {
    authProvider.verifyAccessToken.mockResolvedValueOnce(false);

    const params = {
      accessToken: "access token",
      invitationToken: "invitation token",
    };

    const result = await usecase.execute(params);

    if (!result.isException()) {
      fail();
    }

    expect(result.code).toBe(102);
    expect(result.message).toBe("유효하지 않은 인증정보입니다.");
  });

  it("should fail because it is not open for a guest", async () => {
    authProvider.extractClaim.mockResolvedValueOnce(
      new ClaimModel({
        id: "an id",
        grade: "guest",
      }),
    );

    const params = {
      accessToken: "access token",
      invitationToken: "invitation token",
    };

    const result = await usecase.execute(params);

    if (!result.isException()) {
      fail();
    }

    expect(result.code).toBe(104);
    expect(result.message).toBe("권한이 없습니다.");
  });

  it("should fail for an invalid invitation token", async () => {
    authProvider.verifyInvitationToken.mockResolvedValueOnce(false);

    const params = {
      accessToken: "access token",
      invitationToken: "invitation token",
    };

    const result = await usecase.execute(params);

    if (!result.isException()) {
      fail();
    }

    expect(result.code).toBe(1);
    expect(result.message).toBe("유효하지 않은 인증정보입니다.");
  });

  it("should fail for an absent user", async () => {
    userRepository.findOne.mockResolvedValueOnce(new None());

    const params = {
      accessToken: "access token",
      invitationToken: "invitation token",
    };

    const result = await usecase.execute(params);

    if (!result.isException()) {
      fail();
    }

    expect(result.code).toBe(2);
    expect(result.message).toBe("이용자를 찾지 못했습니다.");
  });

  it("should fail for an absent album", async () => {
    albumRepository.findOne.mockResolvedValueOnce(new None());

    const params = {
      accessToken: "access token",
      invitationToken: "invitation token",
    };

    const result = await usecase.execute(params);

    if (!result.isException()) {
      fail();
    }

    expect(result.code).toBe(3);
    expect(result.message).toBe("앨범을 찾지 못했습니다.");
  });

  it("should fail for a conflict", async () => {
    friendRepository.findOne.mockImplementationOnce(
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

    const params = {
      accessToken: "access token",
      invitationToken: "invitation token",
    };

    const result = await usecase.execute(params);

    if (!result.isException()) {
      fail();
    }

    expect(result.code).toBe(4);
    expect(result.message).toBe("이미 참여한 앨범입니다.");
  });

  it("should be ok", async () => {
    const params = {
      accessToken: "access token",
      invitationToken: "invitation token",
    };

    const result = await usecase.execute(params);

    if (!result.isOk()) {
      fail();
    }

    expect(result.value.id).toBeDefined();
    expect(result.value.title).toBeDefined();
    expect(result.value.coverImageUri).toBeDefined();
    expect(result.value.photoCount).toBeDefined();

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
