import AppError from '@shared/errors/AppError';

import FakeUserRepository from '@modules/users/repositories/fakes/FakeUserRepository';
import FakeMailProvider from '@shared/container/providers/MailProvider/fakes/FakeMailProvider';
import FakeUserTokenRepository from '@modules/users/repositories/fakes/FakeUserTokenRepository';
import ResetForgotPasswordService from './ResetForgotPasswordService';

let fakeUserRepository: FakeUserRepository;
let fakeMailProvider: FakeMailProvider;
let fakeUserTokenRepository: FakeUserTokenRepository;
let resetForgotPassword: ResetForgotPasswordService;

describe('ResetForgorPassword', () => {
  beforeEach(() => {
    fakeUserRepository = new FakeUserRepository();
    fakeMailProvider = new FakeMailProvider();
    fakeUserTokenRepository = new FakeUserTokenRepository();

    resetForgotPassword = new ResetForgotPasswordService(
      fakeUserRepository,
      fakeMailProvider,
      fakeUserTokenRepository,
    );
  });

  it('Should be able to recover the password using email', async () => {
    const sendMail = jest.spyOn(fakeMailProvider, 'sendMail');

    await fakeUserRepository.create({
      email: 'test@gobarber.com',
      name: 'John Doe',
      password: '123456',
    });

    await resetForgotPassword.execute({
      email: 'test@gobarber.com',
    });

    expect(sendMail).toHaveBeenCalled();
  });

  it('Should not be able to recover a non-existing user password', async () => {
    expect(
      resetForgotPassword.execute({
        email: 'test@gobarber.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
  it('Should be able to generate a forgot password token', async () => {
    const generateToken = jest.spyOn(fakeUserTokenRepository, 'generate');

    const user = await fakeUserRepository.create({
      email: 'test@gobarber.com',
      name: 'John Doe',
      password: '123456',
    });

    await resetForgotPassword.execute({
      email: 'test@gobarber.com',
    });

    expect(generateToken).toHaveBeenCalledWith(user.id);
  });
});
