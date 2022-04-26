import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { AppleAuthProvider } from "src/declarations/providers/apple_auth";
import * as NodeRSA from "node-rsa";
import { AppleClaimModel } from "src/declarations/models/apple_claim";

@Injectable()
export class AppleAuthProviderImpl implements AppleAuthProvider {
  constructor(
    private readonly httpService: HttpService,
    private readonly jwtService: JwtService,
  ) {}

  async verify(idToken: string): Promise<boolean> {
    const { keys } = await new Promise<any>((resolve, reject) =>
      this.httpService.get("https://appleid.apple.com/auth/keys").subscribe({
        next: (value) => resolve(value.data),
        error: (error) => reject(error),
      }),
    );

    const { header } = this.jwtService.decode(idToken, {
      complete: true,
      json: true,
    }) as { [key: string]: any };

    const key = keys.find(({ kid }) => kid === header.kid);

    if (!key) {
      return false;
    }

    const rsa = new NodeRSA();

    rsa.importKey({
      n: Buffer.from(key.n, "base64"),
      e: Buffer.from(key.e, "base64"),
    });

    const publicKey = rsa.exportKey("public");

    const algorithms = [header.alg];

    const issuer = "https://appleid.apple.com";

    const audience = process.env.JWT_AUDIENCE;

    try {
      this.jwtService.verify(idToken, {
        publicKey,
        algorithms,
        issuer,
        audience,
      });

      return true;
    } catch {
      return false;
    }
  }

  async extractClaim(idToken: string): Promise<AppleClaimModel> {
    const payload = this.jwtService.decode(idToken, {
      json: true,
    }) as { [key: string]: any };

    const { sub: id, email } = payload;

    const result = new AppleClaimModel({
      id,
      email: email,
    });

    return result;
  }
}
