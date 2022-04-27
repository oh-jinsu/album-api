import { Body, Controller, Post } from "@nestjs/common";
import { IsString } from "class-validator";
import { Adapter } from "src/core/adapter";
import { SignUpWithGoogleUseCase } from "./usecase";

export class RequestBody {
  @IsString()
  id_token: string;
}

@Controller("auth/signup/google")
export class SignUpWithGoogleAdapter extends Adapter {
  constructor(private readonly usecase: SignUpWithGoogleUseCase) {
    super();
  }

  @Post()
  async receive(@Body() { id_token: idToken }: RequestBody) {
    const result = await this.usecase.execute({ idToken });

    return this.response(result);
  }

  override getExceptionStatus(code: number): number {
    switch (code) {
      case 1:
        return 400;
      case 2:
        return 409;
      default:
        return 500;
    }
  }
}
