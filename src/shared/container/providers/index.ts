import { container } from 'tsyringe';
import mailConfig from '@config/mail';

import IStorageProvider from './StorageProvider/models/IStorageProvider';
import DiskStorageProvider from './StorageProvider/implementations/DiskImplementationProvider';

import IMailProvider from './MailProvider/Models/IMailProvider';
import EtherealMailProvider from './MailProvider/Implementations/EtherealMailProvider';
import SESMailProvider from './MailProvider/Implementations/SESMailProvider';


import IMailTemplateProvider from './MailTemplateProvider/models/IMailTemplateProvider';
import HandlebarsMailTemplateProvider from './MailTemplateProvider/implementations/HandlebarsMailTemplateProvider';

container.registerSingleton<IStorageProvider>(
  'StorageProvider',
  DiskStorageProvider,

);

container.registerSingleton<IMailTemplateProvider>(
  'MailTemplateProvider',
  HandlebarsMailTemplateProvider,
);

container.registerInstance<IMailProvider>(
  'MailProvider',
  mailConfig.driver === 'ethereal' 
  ?container.resolve(EtherealMailProvider) 
  : container.resolve(SESMailProvider),
);
