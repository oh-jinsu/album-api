import { Body, Controller, Post } from "@nestjs/common";
import { Throttle } from "@nestjs/throttler";
import { IsString } from "class-validator";
import { Adapter } from "src/core/adapter";
import { SignUpWithAppleUseCase } from "./usecase";

export class RequestBody {
  @IsString()
  id_token: string;
}

@Throttle(1, 0.1)
@Controller("auth/signup/apple")
export class SignUpWithAppleAdapter extends Adapter {
  constructor(private readonly useCase: SignUpWithAppleUseCase) {
    super();
  }

  @Post()
  async receive(@Body() { id_token: idToken }: RequestBody) {
    const result = await this.useCase.execute({ idToken });

    return this.response(result);
  }

  override getExceptionStatus(code: number): number {
    switch (code) {
      case 1:
        return 401;
      case 2:
        return 409;
      default:
        return 500;
    }
  }
}
