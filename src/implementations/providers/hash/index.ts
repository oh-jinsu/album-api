import { HashProvider } from "src/declarations/providers/hash";
import * as bcrypt from "bcrypt";

export class HashProviderImpl implements HashProvider {
  private static readonly saltRounds = 10;

  async encode(value: string): Promise<string> {
    const result = await bcrypt.hash(value, HashProviderImpl.saltRounds);

    return result;
  }

  async compare(value: string, hashed: string): Promise<boolean> {
    const result = await bcrypt.compare(value, hashed);

    return result;
  }
}
