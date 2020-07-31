"use strict";

var _AppError = _interopRequireDefault(require("../../../shared/errors/AppError"));

var _FakeUserRepository = _interopRequireDefault(require("../repositories/fakes/FakeUserRepository"));

var _FakeMailProvider = _interopRequireDefault(require("../../../shared/container/providers/MailProvider/fakes/FakeMailProvider"));

var _FakeUserTokenRepository = _interopRequireDefault(require("../repositories/fakes/FakeUserTokenRepository"));

var _ResetForgotPasswordService = _interopRequireDefault(require("./ResetForgotPasswordService"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let fakeUserRepository;
let fakeMailProvider;
let fakeUserTokenRepository;
let resetForgotPassword;
describe('ResetForgorPassword', () => {
  beforeEach(() => {
    fakeUserRepository = new _FakeUserRepository.default();
    fakeMailProvider = new _FakeMailProvider.default();
    fakeUserTokenRepository = new _FakeUserTokenRepository.default();
    resetForgotPassword = new _ResetForgotPasswordService.default(fakeUserRepository, fakeMailProvider, fakeUserTokenRepository);
  });
  it('Should be able to recover the password using email', async () => {
    const sendMail = jest.spyOn(fakeMailProvider, 'sendMail');
    await fakeUserRepository.create({
      email: 'test@gobarber.com',
      name: 'John Doe',
      password: '123456'
    });
    await resetForgotPassword.execute({
      email: 'test@gobarber.com'
    });
    expect(sendMail).toHaveBeenCalled();
  });
  it('Should not be able to recover a non-existing user password', async () => {
    expect(resetForgotPassword.execute({
      email: 'test@gobarber.com'
    })).rejects.toBeInstanceOf(_AppError.default);
  });
  it('Should be able to generate a forgot password token', async () => {
    const generateToken = jest.spyOn(fakeUserTokenRepository, 'generate');
    const user = await fakeUserRepository.create({
      email: 'test@gobarber.com',
      name: 'John Doe',
      password: '123456'
    });
    await resetForgotPassword.execute({
      email: 'test@gobarber.com'
    });
    expect(generateToken).toHaveBeenCalledWith(user.id);
  });
});