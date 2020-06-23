import nodemailer, { Transporter } from 'nodemailer';
import IMailProvider from '../Models/IMailProvider';

export default class EtherealMailProvider implements IMailProvider {
  private client: Transporter;

  constructor() {
    nodemailer.createTestAccount().then(account => {
      const transporter = nodemailer.createTransport({
        host: account.smtp.host,
        port: account.smtp.port,
        secure: false, // true for 465, false for other ports
        auth: {
          user: account.user, // generated ethereal user
          pass: account.pass, // generated ethereal password
        },
      });
      this.client = transporter;
    });
  }

  public async sendMail(to: string, body: string): Promise<void> {
    this.client.sendMail({
      from: 'Equipe GoBarber <contacto@gobarber.com>',
      to,
      subject: 'Recuperação de senha',
      text: body,
      html: '<a>Recupere sua senha</a>',
    });
  }
}
