import { Body, Controller, Post } from "@nestjs/common";
import { IsString } from "class-validator";
import { Adapter } from "src/core/adapter";
import { SignInWithGoogleUseCase } from "./usecase";

export class RequestBody {
  @IsString()
  id_token: string;
}

@Controller("auth/signin/google")
export class SignInWithGoogleAdapter extends Adapter {
  constructor(
    private readonly signInWithGoogleUseCase: SignInWithGoogleUseCase,
  ) {
    super();
  }

  @Post()
  async receive(@Body() { id_token: idToken }: RequestBody) {
    const result = await this.signInWithGoogleUseCase.execute({ idToken });

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
