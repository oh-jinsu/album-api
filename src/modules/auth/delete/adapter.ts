import { Controller, Delete } from "@nestjs/common";
import { Adapter } from "src/core/adapter";
import { AccessToken } from "src/core/decorators/access_token";
import { DeleteAuthUseCase } from "./usecase";

@Controller("auth")
export class DeleteAuthAdapter extends Adapter {
  constructor(private readonly usecase: DeleteAuthUseCase) {
    super();
  }

  @Delete()
  async receive(@AccessToken() accessToken: string) {
    const result = await this.usecase.execute({ accessToken });

    return this.response(result);
  }

  protected getExceptionStatus(code: number): number {
    switch (code) {
      default:
        return 500;
    }
  }
}
