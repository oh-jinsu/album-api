import { LinkProvider } from "src/declarations/providers/link";

export class MockLinkProvider implements LinkProvider {
  getLink = jest.fn<Promise<string>, [string]>();
}
