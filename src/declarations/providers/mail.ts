export abstract class MailProvider {
  abstract send(to: string, subject: string, text: string): Promise<boolean>;
}
