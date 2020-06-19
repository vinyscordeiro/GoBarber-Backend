import { sign } from 'jsonwebtoken';
import { injectable, inject } from 'tsyringe';

import User from '@modules/users/infra/typeorm/entities/User';
import authConfig from '@config/auth';
import AppError from '@shared/errors/AppError';
import IHashProvider from '@modules/users/providers/HashProvider/models/IHashProvider';
import IUserRepository from '../repositories/IUserRepository';

interface IRequest {
  email: string;
  password: string;
}
interface IResponse {
  user: User;
  token: string;
}

@injectable()
class AuthenticateUserService {
  constructor(
    @inject('UserRepository')
    private usersRepository: IUserRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  public async execute({ email, password }: IRequest): Promise<IResponse> {
    const user = await this.usersRepository.findByEmail(email);
    if (!user) {
      throw new AppError('Incorrect email/password combination', 401);
    }

    // user.password é a senha no banco de dados criptografada.
    // password é a variável local que o usuário colocou não criptografada.

    const passMatch = this.hashProvider.compareHash(user.password, password);
    // await compare(password, user.password);
    if (!passMatch) {
      throw new AppError('Incorrect email/password combination', 401);
    }
    // Usuário autenticado
    const { secret, expiresIn } = authConfig.jwt;

    const token = sign({}, secret, {
      subject: user.id,
      expiresIn,
      // Está utilizando a short syntax, ou seja, expiresIn : expiresIn (Variavel).
    });

    return {
      user,
      token,
    };
  }
}

export default AuthenticateUserService;
