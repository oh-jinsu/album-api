import { None, Some } from "src/core/enums/option";
import { ClaimModel } from "src/declarations/models/claim";
import { PhotoModel } from "src/declarations/models/photo";
import { MockAuthProvider } from "src/implementations/providers/auth/mock";
import { MockImageRepository } from "src/implementations/repositories/image/mock";
import { MockPhotoRepository } from "src/implementations/repositories/photo/mock";
import { DeletePhotoUseCase } from "./usecase";

describe("Try to test delete a photo", () => {
  const authProvider = new MockAuthProvider();

  authProvider.verifyAccessToken.mockResolvedValue(true);

  authProvider.extractClaim.mockResolvedValue(
    new ClaimModel({ id: "an user id", grade: "member" }),
  );

  const photoRepository = new MockPhotoRepository();

  photoRepository.findOne.mockImplementation(
    async (id) =>
      new Some(
        new PhotoModel({
          id,
          userId: "an user id",
          albumId: "an album id",
          image: "an image",
          description: "a description",
          date: new Date(),
          updatedAt: new Date(),
          createdAt: new Date(),
        }),
      ),
  );

  photoRepository.delete.mockResolvedValue(null);

  const imageRepository = new MockImageRepository();

  imageRepository.delete.mockResolvedValue(null);

  const usecase = new DeletePhotoUseCase(
    authProvider,
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
      id: "an id",
    };

    const result = await usecase.execute(params);

    if (!result.isException()) {
      fail();
    }

    expect(result.code).toBe(102);

    expect(result.message).toBe("유효하지 않은 인증정보입니다.");
  });

  it("should fail to access other's photo", async () => {
    photoRepository.findOne.mockResolvedValueOnce(new None());

    const params = {
      accessToken: "an access token",
      id: "an id",
    };

    const result = await usecase.execute(params);

    if (!result.isException()) {
      fail();
    }

    expect(result.code).toBe(1);

    expect(result.message).toBe("사진을 찾지 못했습니다.");
  });

  it("should fail to access other's photo", async () => {
    authProvider.extractClaim.mockResolvedValueOnce(
      new ClaimModel({
        id: "another id",
        grade: "member",
      }),
    );

    const params = {
      accessToken: "an access token",
      id: "an id",
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
      id: "an id",
    };

    const result = await usecase.execute(params);

    if (!result.isOk()) {
      fail();
    }

    expect(result.value).toBeNull();
  });
});
