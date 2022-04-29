import {
  BadRequestException,
  Body,
  Controller,
  Post,
  Query,
} from "@nestjs/common";
import { Throttle } from "@nestjs/throttler";
import { IsString } from "class-validator";
import { Adapter } from "src/core/adapter";
import { SignUpWithAppleUseCase } from "./with_apple/usecase";
import { SignUpWithGoogleUseCase } from "./with_google/usecase";

export class RequestBody {
  @IsString()
  id_token: string;
}

@Throttle(1, 0.1)
@Controller("auth/signup")
export class SignUpAdapter extends Adapter {
  constructor(
    private readonly usecaseWithApple: SignUpWithAppleUseCase,
    private readonly usecaseWithGoogle: SignUpWithGoogleUseCase,
  ) {
    super();
  }

  @Post()
  async receive(
    @Query("provider") provider: string,
    @Body() body: RequestBody,
  ) {
    const result = await this.select(provider, body);

    return this.response(result);
  }

  private async select(provider: string, { id_token: idToken }: RequestBody) {
    switch (provider) {
      case "apple":
        return this.usecaseWithApple.execute({ idToken });
      case "google":
        return this.usecaseWithGoogle.execute({ idToken });
      default:
        throw new BadRequestException();
    }
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
