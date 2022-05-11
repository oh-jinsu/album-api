import { MailProvider } from "src/declarations/providers/mail";

export class MockMailProvider implements MailProvider {
  send = jest.fn<Promise<boolean>, [string, string, string]>();
}
