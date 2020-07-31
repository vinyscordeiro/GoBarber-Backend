"use strict";

var _AppError = _interopRequireDefault(require("../../../shared/errors/AppError"));

var _FakeUserRepository = _interopRequireDefault(require("../repositories/fakes/FakeUserRepository"));

var _ShowProfileService = _interopRequireDefault(require("./ShowProfileService"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let fakeUserRepository;
let showProfile;
describe('ShowProfile', () => {
  beforeEach(() => {
    fakeUserRepository = new _FakeUserRepository.default();
    showProfile = new _ShowProfileService.default(fakeUserRepository);
  });
  it('Should be able to show the profile', async () => {
    const user = await fakeUserRepository.create({
      name: 'John Doe',
      email: 'test@gobarber.com',
      password: '123456'
    });
    const profile = await showProfile.execute({
      user_id: user.id
    });
    expect(profile.name).toBe('John Doe');
    expect(profile.email).toBe('test@gobarber.com');
    expect(profile.password).toBe('123456');
  });
  it('Should not be able to show a non-existing profile', async () => {
    await expect(showProfile.execute({
      user_id: 'non-existing-id'
    })).rejects.toBeInstanceOf(_AppError.default);
  });
});