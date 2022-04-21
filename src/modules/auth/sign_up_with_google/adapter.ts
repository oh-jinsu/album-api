import { Body, Controller, Post } from '@nestjs/common';
import { SignUpWithGoogleUseCase } from './usecase';

interface RequestBody {
  idToken: string;
}

@Controller('signup')
export class SignUpWithGoogleAdapter {
  constructor(
    private readonly signUpWithGoogleUseCase: SignUpWithGoogleUseCase,
  ) {}

  @Post()
  async receive(@Body() { idToken }: RequestBody) {
    return this.signUpWithGoogleUseCase.execute({ idToken });
  }
}
