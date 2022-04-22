import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ProviderResult } from 'src/core/enums/results/provider';
import { AppleClaim } from 'src/declarations/models/apple_claim';
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

  verify(idToken: string): Promise<ProviderResult<boolean>> {
    return this.forProduction.verify(idToken);
  }

  extractClaim(idToken: string): Promise<ProviderResult<AppleClaim>> {
    return this.forProduction.extractClaim(idToken);
  }
}
