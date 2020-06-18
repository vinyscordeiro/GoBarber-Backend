import FakeUserRepository from '@modules/users/repositories/fakes/FakeUserRepository';
import AppError from '@shared/errors/AppError';
import CreateUserService from './CreateUserService';

describe('CreateUser', () => {
  it('Should be able to create a new User', async () => {
    const fakeUserRepository = new FakeUserRepository();
    const createUser = new CreateUserService(fakeUserRepository);

    const user = await createUser.execute({
      email: 'test@gobarber.com',
      name: 'John Doe',
      password: '123456',
    });

    expect(user).toHaveProperty('id');
  });
  it('Should not be able to create a new User with the same email from another', async () => {
    const fakeUserRepository = new FakeUserRepository();
    const createUser = new CreateUserService(fakeUserRepository);

    createUser.execute({
      email: 'test@gobarber.com',
      name: 'John Doe Second',
      password: '1234567',
    });

    expect(
      createUser.execute({
        email: 'test@gobarber.com',
        name: 'John Doe Second',
        password: '1234567',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
