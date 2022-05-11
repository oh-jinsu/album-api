import { MailProvider } from "src/declarations/providers/mail";
import { createTransport } from "nodemailer";

export class MailProviderImpl implements MailProvider {
  send(to: string, subject: string, text: string): Promise<boolean> {
    return new Promise((resolve) => {
      const transporter = createTransport({
        service: process.env.MAIL_SERVICE,
        auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASSWORD,
        },
      });

      const options = {
        from: process.env.MAIL_USER,
        to,
        subject,
        text,
      };

      transporter.sendMail(options, (error) => {
        if (error) {
          resolve(false);
        } else {
          resolve(true);
        }
      });
    });
  }
}
