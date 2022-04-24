import { Body, Controller, Post } from "@nestjs/common";
import { IsNotEmpty } from "class-validator";
import { Adapter } from "src/core/adapter";
import { SignInWithAppleUseCase } from "./usecase";

export class RequestBody {
  @IsNotEmpty()
  id_token: string;
}

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
        return 400;
      case 2:
        return 404;
      default:
        return 500;
    }
  }
}
