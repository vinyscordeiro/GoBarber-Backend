import { injectable, inject } from 'tsyringe';

import User from '@modules/users/infra/typeorm/entities/User';
import AppError from '@shared/errors/AppError';
import IUserRepository from '@modules/users/repositories/IUserRepository';
import IHashProvider from '@modules/users/providers/HashProvider/models/IHashProvider';

interface IRequest {
  user_id: string;
  name: string;
  email: string;
  old_password?: string;
  password?: string;
}

@injectable()
class UpdateProfileService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUserRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  public async execute({
    user_id,
    name,
    email,
    password,
    old_password,
  }: IRequest): Promise<User> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError('User Not found');
    }

    const userEmail = await this.usersRepository.findByEmail(email);

    if (userEmail && userEmail.id !== user_id) {
      throw new AppError('Email already used');
    }

    user.name = name;
    user.email = email;
    if (password && !old_password) {
      throw new AppError('Old password is necessary to update your password');
    }

    if (password && old_password) {
      const checkOldPassword = await this.hashProvider.compareHash(
        old_password,
        user.password,
      );
      if (!checkOldPassword) {
        throw new AppError('Old Password does not match');
      }
      user.password = await this.hashProvider.generateHash(password);
    }

    await this.usersRepository.updateUser(user);

    return user;
  }
}
export default UpdateProfileService;
