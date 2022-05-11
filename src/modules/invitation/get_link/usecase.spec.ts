import { None, Some } from "src/core/enums/option";
import { AlbumModel } from "src/declarations/models/album";
import { ClaimModel } from "src/declarations/models/claim";
import { FriendModel } from "src/declarations/models/friend";
import { MockAuthProvider } from "src/implementations/providers/auth/mock";
import { MockLinkProvider } from "src/implementations/providers/link/mock";
import { MockAlbumRepository } from "src/implementations/repositories/album/mock";
import { MockFriendRepository } from "src/implementations/repositories/friend/mock";
import { GetInvitationLinkUseCase } from "./usecase";

describe("Try to get invitation link", () => {
  const authProvider = new MockAuthProvider();

  authProvider.verifyAccessToken.mockResolvedValue(true);

  authProvider.extractClaim.mockResolvedValue(
    new ClaimModel({ id: "an id", grade: "member" }),
  );

  const linkProvider = new MockLinkProvider();

  linkProvider.getLink.mockResolvedValue("a link");

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

  const usecase = new GetInvitationLinkUseCase(
    authProvider,
    linkProvider,
    albumRepository,
    friendRepository,
  );

  it("should be defined", () => {
    expect(usecase).toBeDefined();
  });

  it("should fail for an invalid token", async () => {
    authProvider.verifyAccessToken.mockResolvedValueOnce(false);

    const params = {
      accessToken: "accessToken",
      albumId: "an album id",
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
      accessToken: "accessToken",
      albumId: "an album id",
    };

    const result = await usecase.execute(params);

    if (!result.isException()) {
      fail();
    }

    expect(result.code).toBe(104);
    expect(result.message).toBe("권한이 없습니다.");
  });

  it("should fail for an absent album", async () => {
    albumRepository.findOne.mockResolvedValueOnce(new None());

    const params = {
      accessToken: "accessToken",
      albumId: "an album id",
    };

    const result = await usecase.execute(params);

    if (!result.isException()) {
      fail();
    }

    expect(result.code).toBe(1);
    expect(result.message).toBe("앨범을 찾지 못했습니다.");
  });

  it("should fail for accessing other's album", async () => {
    friendRepository.findOne.mockResolvedValueOnce(new None());

    const params = {
      accessToken: "accessToken",
      albumId: "an album id",
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
      accessToken: "accessToken",
      albumId: "an album id",
    };

    const result = await usecase.execute(params);

    if (!result.isOk()) {
      fail();
    }

    expect(result.value.url).toBeDefined();
  });
});
