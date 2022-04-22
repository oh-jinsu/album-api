import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ProviderResult } from 'src/core/enums/results/provider';
import { AppleAuthProvider } from 'src/declarations/providers/apple_auth';
import { AppleAuthProviderImpl } from '.';

@Injectable()
export class MockAppleAuthProvider implements AppleAuthProvider {
  private readonly forProduction: AppleAuthProviderImpl;

  constructor(
    private readonly httpService: HttpService,
    private readonly jwtService: JwtService,
  ) {
    this.forProduction = new AppleAuthProviderImpl(httpService, jwtService);
  }

  verify(idToken: string): Promise<ProviderResult<never>> {
    return this.forProduction.verify(idToken);
  }

  extractEmail(idToken: string): Promise<ProviderResult<string>> {
    return this.forProduction.extractEmail(idToken);
  }
}
