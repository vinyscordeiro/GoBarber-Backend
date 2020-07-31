"use strict";

var _FakeUserRepository = _interopRequireDefault(require("../repositories/fakes/FakeUserRepository"));

var _FakeUserTokenRepository = _interopRequireDefault(require("../repositories/fakes/FakeUserTokenRepository"));

var _AppError = _interopRequireDefault(require("../../../shared/errors/AppError"));

var _ResetPasswordService = _interopRequireDefault(require("./ResetPasswordService"));

var _FakeHashProvider = _interopRequireDefault(require("../providers/HashProvider/fakes/FakeHashProvider"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let fakeUserRepository;
let fakeUserTokenRepository;
let resetPassword;
let fakeHashProvider;
describe('ResetPassword', () => {
  beforeEach(() => {
    fakeUserRepository = new _FakeUserRepository.default();
    fakeUserTokenRepository = new _FakeUserTokenRepository.default();
    fakeHashProvider = new _FakeHashProvider.default();
    resetPassword = new _ResetPasswordService.default(fakeUserRepository, fakeUserTokenRepository, fakeHashProvider);
  });
  it('Should be able to reset the password ', async () => {
    const user = await fakeUserRepository.create({
      email: 'test@gobarber.com',
      name: 'John Doe',
      password: '123456'
    });
    const {
      token
    } = await fakeUserTokenRepository.generate(user.id);
    const generateHash = jest.spyOn(fakeHashProvider, 'generateHash');
    await resetPassword.execute({
      token,
      password: '765432'
    });
    const updatedUser = await fakeUserRepository.findById(user.id);
    expect(generateHash).toHaveBeenCalledWith('765432');
    expect(updatedUser === null || updatedUser === void 0 ? void 0 : updatedUser.password).toBe('765432');
  });
  it('Should not be able to reset the password with non-existing token ', async () => {
    expect(resetPassword.execute({
      token: 'non-existing token',
      password: '123456'
    })).rejects.toBeInstanceOf(_AppError.default);
  });
  it('Should not be able to reset the password with non-existing user ', async () => {
    const {
      token
    } = await fakeUserTokenRepository.generate('non-existing-user');
    expect(resetPassword.execute({
      token,
      password: '123456'
    })).rejects.toBeInstanceOf(_AppError.default);
  });
  it('Should not be able to reset the password after surpass 2 hours of token generation ', async () => {
    const user = await fakeUserRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456'
    });
    const {
      token
    } = await fakeUserTokenRepository.generate(user.id);
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      const customDate = new Date();
      return customDate.setHours(customDate.getHours() + 3);
    });
    expect(resetPassword.execute({
      token,
      password: '123456'
    })).rejects.toBeInstanceOf(_AppError.default);
  });
});