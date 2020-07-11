import { container } from 'tsyringe';

import mailConfig from '@config/mail';
import IMailProvider from './Models/IMailProvider';

import EtherealMailProvider from './Implementations/EtherealMailProvider';
import SESMailProvider from './Implementations/SESMailProvider';

const providers = {
    ethereal: container.resolve(EtherealMailProvider),
    ses: container.resolve(SESMailProvider),
}

container.registerInstance<IMailProvider>(
    'MailProvider',
    providers[mailConfig.driver],
  );