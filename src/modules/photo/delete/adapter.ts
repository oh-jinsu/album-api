import { Controller, Delete, Param } from "@nestjs/common";
import { Throttle } from "@nestjs/throttler";
import { Adapter } from "src/core/adapter";
import { AccessToken } from "src/core/decorators/access_token";
import { DeletePhotoUseCase } from "./usecase";

@Throttle(1, 0.1)
@Controller("photo")
export class DeletePhotoAdapter extends Adapter {
  constructor(private readonly usecase: DeletePhotoUseCase) {
    super();
  }

  @Delete(":id")
  async receive(@AccessToken() accessToken: string, @Param("id") id: string) {
    const result = await this.usecase.execute({
      accessToken,
      id,
    });

    return this.response(result);
  }

  protected override getExceptionStatus(code: number): number {
    switch (code) {
      case 1:
        return 404;
      case 2:
        return 403;
      default:
        return 500;
    }
  }
}
