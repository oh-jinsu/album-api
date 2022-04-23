import { HashProvider } from "src/declarations/providers/hash";

export class MockHashProvider implements HashProvider {
  encode = jest.fn<Promise<string>, [string]>();

  compare = jest.fn<Promise<boolean>, [string, string]>();
}
