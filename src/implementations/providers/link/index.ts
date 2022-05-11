import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { LinkProvider } from "src/declarations/providers/link";

@Injectable()
export class LinkProviderImpl implements LinkProvider {
  constructor(private readonly httpService: HttpService) {}

  async getLink(suffix: string): Promise<string> {
    const prefix = process.env.DYNAMIC_LINK_URI_PREFIX;

    const bundleId = process.env.MOBILE_BUNDLE_ID;

    const appstoreId = process.env.MOBILE_APPSTORE_ID;

    const { shortLink } = await new Promise((resolve, reject) =>
      this.httpService
        .post(
          `https://firebasedynamiclinks.googleapis.com/v1/shortLinks?key=${process.env.FIREBASE_WEB_API_KEY}`,
          {
            dynamicLinkInfo: {
              domainUriPrefix: prefix,
              link: `${prefix}/${suffix}`,
              androidInfo: {
                androidPackageName: bundleId,
              },
              iosInfo: {
                iosBundleId: bundleId,
                iosAppStoreId: appstoreId,
              },
            },
            suffix: {
              option: "UNGUESSABLE",
            },
          },
          {
            headers: {
              "Content-Type": "application/json;charset=utf-8",
            },
          },
        )
        .subscribe({
          next: ({ data }) => resolve(data),
          error: (err) => reject(err),
        }),
    );

    return shortLink;
  }
}
