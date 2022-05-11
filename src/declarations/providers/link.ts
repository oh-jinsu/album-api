export abstract class LinkProvider {
  abstract getLink(suffix: string): Promise<string>;
}
