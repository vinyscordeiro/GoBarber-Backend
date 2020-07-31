"use strict";

var _FakeUserRepository = _interopRequireDefault(require("../repositories/fakes/FakeUserRepository"));

var _AppError = _interopRequireDefault(require("../../../shared/errors/AppError"));

var _FakeCacheProvider = _interopRequireDefault(require("../../../shared/container/providers/CacheProvider/fakes/FakeCacheProvider"));

var _CreateUserService = _interopRequireDefault(require("./CreateUserService"));

var _FakeHashProvider = _interopRequireDefault(require("../providers/HashProvider/fakes/FakeHashProvider"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let fakeUserRepository;
let fakeHashProvider;
let fakeCacheProvider;
let createUser;
describe('CreateUser', () => {
  beforeEach(() => {
    fakeUserRepository = new _FakeUserRepository.default();
    fakeHashProvider = new _FakeHashProvider.default();
    fakeCacheProvider = new _FakeCacheProvider.default();
    createUser = new _CreateUserService.default(fakeUserRepository, fakeHashProvider, fakeCacheProvider);
  });
  it('Should be able to create a new User', async () => {
    const user = await createUser.execute({
      email: 'test@gobarber.com',
      name: 'John Doe',
      password: '123456'
    });
    expect(user).toHaveProperty('id');
  });
  it('Should not be able to create a new User with the same email from another', async () => {
    await createUser.execute({
      email: 'test@gobarber.com',
      name: 'John Doe',
      password: '1234567'
    });
    await expect(createUser.execute({
      email: 'test@gobarber.com',
      name: 'John Doe Second',
      password: '1234567'
    })).rejects.toBeInstanceOf(_AppError.default);
  });
});