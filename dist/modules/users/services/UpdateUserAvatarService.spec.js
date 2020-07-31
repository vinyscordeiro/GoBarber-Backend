"use strict";

var _FakeStorageProvider = _interopRequireDefault(require("../../../shared/container/providers/StorageProvider/fakes/FakeStorageProvider"));

var _AppError = _interopRequireDefault(require("../../../shared/errors/AppError"));

var _FakeUserRepository = _interopRequireDefault(require("../repositories/fakes/FakeUserRepository"));

var _UpdateUserAvatarService = _interopRequireDefault(require("./UpdateUserAvatarService"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let fakeUserRepository;
let fakeStorageProvider;
let updateUserAvatar;
describe('UpdateUserAvatar', () => {
  beforeEach(() => {
    fakeUserRepository = new _FakeUserRepository.default();
    fakeStorageProvider = new _FakeStorageProvider.default();
    updateUserAvatar = new _UpdateUserAvatarService.default(fakeUserRepository, fakeStorageProvider);
  });
  it('Should be able to change avatar', async () => {
    const user = await fakeUserRepository.create({
      name: 'John Doe',
      email: 'test@gobarber.com',
      password: '123456'
    });
    await updateUserAvatar.execute({
      user_id: user.id,
      avatar_filename: 'avatar.jpg'
    });
    expect(user.avatar).toBe('avatar.jpg');
  });
  it('Should able to delete avatar before updating a new one', async () => {
    const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');
    const user = await fakeUserRepository.create({
      name: 'John Doe',
      email: 'test@gobarber.com',
      password: '123456'
    });
    await updateUserAvatar.execute({
      user_id: user.id,
      avatar_filename: 'avatar.jpg'
    });
    await updateUserAvatar.execute({
      user_id: user.id,
      avatar_filename: 'avatar2.jpg'
    });
    expect(deleteFile).toHaveBeenCalledWith('avatar.jpg');
    expect(user.avatar).toBe('avatar2.jpg');
  });
  it('Should not be able to change avatar without being a user', async () => {
    await expect(updateUserAvatar.execute({
      user_id: 'non-existing-id',
      avatar_filename: 'avatar.jpg'
    })).rejects.toBeInstanceOf(_AppError.default);
  });
});