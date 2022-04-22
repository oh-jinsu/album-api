import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  ProviderError,
  ProviderOk,
  ProviderResult,
} from 'src/core/enums/results/provider';
import { AppleAuthProvider } from 'src/declarations/providers/apple_auth';
import * as NodeRSA from 'node-rsa';

@Injectable()
export class AppleAuthProviderImpl implements AppleAuthProvider {
  constructor(
    private readonly httpService: HttpService,
    private readonly jwtService: JwtService,
  ) {}

  async verify(idToken: string): Promise<ProviderResult<never>> {
    const { keys } = await new Promise((resolve, reject) =>
      this.httpService.get('https://appleid.apple.com/auth/keys').subscribe({
        next: (value) => resolve(value.data),
        error: (error) => reject(error),
      }),
    );

    const { header } = this.jwtService.decode(idToken, {
      complete: true,
      json: true,
    }) as { [key: string]: any };

    const key = keys.find(({ kid }) => kid === header.kid);

    const rsa = new NodeRSA();

    rsa.importKey({
      n: Buffer.from(key.n, 'base64'),
      e: Buffer.from(key.e, 'base64'),
    });

    const publicKey = rsa.exportKey('public');

    const algorithms = [header.alg];

    const issuer = 'https://appleid.apple.com';

    const audience = process.env.JWT_AUDIENCE;

    try {
      this.jwtService.verify(idToken, {
        publicKey,
        algorithms,
        issuer,
        audience,
      });

      return new ProviderOk(null);
    } catch {
      return new ProviderError('invalid id token');
    }
  }

  async extractEmail(idToken: string): Promise<ProviderResult<string>> {
    try {
      const payload = this.jwtService.decode(idToken, {
        json: true,
      }) as { [key: string]: unknown };

      const { email } = payload;

      return new ProviderOk(email);
    } catch {
      return new ProviderError('failed to decode');
    }
  }
}
