import { Body, Controller, Post } from "@nestjs/common";
import { Adapter } from "src/core/adapter";
import { SignUpWithAppleUseCase } from "./usecase";

interface RequestBody {
  idToken: string;
}

@Controller("auth/signup/apple")
export class SignUpWithAppleAdapter extends Adapter {
  constructor(private readonly useCase: SignUpWithAppleUseCase) {
    super();
  }

  @Post()
  async receive(@Body() { idToken }: RequestBody) {
    const result = await this.useCase.execute({ idToken });

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
