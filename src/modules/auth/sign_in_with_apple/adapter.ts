import { Body, Controller, Post } from "@nestjs/common";
import { Throttle } from "@nestjs/throttler";
import { IsString } from "class-validator";
import { Adapter } from "src/core/adapter";
import { SignInWithAppleUseCase } from "./usecase";

export class RequestBody {
  @IsString()
  id_token: string;
}

@Throttle(1, 0.1)
@Controller("auth/signin/apple")
export class SignInWithAppleAdapter extends Adapter {
  constructor(private readonly signInWithAppleUseCase: SignInWithAppleUseCase) {
    super();
  }

  @Post()
  async receive(@Body() { id_token: idToken }: RequestBody) {
    const result = await this.signInWithAppleUseCase.execute({ idToken });

    return this.response(result);
  }

  getExceptionStatus(code: number): number {
    switch (code) {
      case 1:
        return 401;
      case 2:
        return 404;
      default:
        return 500;
    }
  }
}
