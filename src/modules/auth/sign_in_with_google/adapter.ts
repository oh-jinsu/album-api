import { Body, Controller, Post } from "@nestjs/common";
import { Adapter } from "src/core/adapter";
import { SignInWithGoogleUseCase } from "./usecase";

interface RequestBody {
  idToken: string;
}

@Controller("auth/signin/google")
export class SignInWithGoogleAdapter extends Adapter {
  constructor(
    private readonly signInWithGoogleUseCase: SignInWithGoogleUseCase,
  ) {
    super();
  }

  @Post()
  async receive(@Body() { idToken }: RequestBody) {
    const result = await this.signInWithGoogleUseCase.execute({ idToken });

    return this.response(result);
  }

  getExceptionStatus(code: number) {
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
