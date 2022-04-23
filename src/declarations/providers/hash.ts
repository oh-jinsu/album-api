export abstract class HashProvider {
  abstract encode(value: string): Promise<string>;

  abstract compare(value: string, hashed: string): Promise<boolean>;
}
