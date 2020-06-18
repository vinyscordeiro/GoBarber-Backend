import FakeUserRepository from '@modules/users/repositories/fakes/FakeUserRepository';
import AuthenticateUserService from './AuthenticateUserService';
import CreateUserService from './CreateUserService';

describe('AuthenticateUser', () => {
  it('Should be able to authenticate', async () => {
    const fakeUserRepository = new FakeUserRepository();

    const createUser = new CreateUserService(fakeUserRepository);
    const authenticateUser = new AuthenticateUserService(fakeUserRepository);

    await createUser.execute({
      name: 'John Doe',
      email: 'test2@gobarber.com',
      password: '123456',
    });

    const response = await authenticateUser.execute({
      email: 'test2@gobarber.com',
      password: '123456',
    });

    expect(response).toHaveProperty('token');
  });
});
