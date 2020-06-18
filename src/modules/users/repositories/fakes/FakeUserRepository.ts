import User from '@modules/users/infra/typeorm/entities/User';
import IUsersRepository from '@modules/users/repositories/IUserRepository';
import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';
import { uuid } from 'uuidv4';

class UsersRepository implements IUsersRepository {
  private users: User[] = [];

  public async findByEmail(email: string): Promise<User | undefined> {
    const findUser = this.users.find(user => user.email === email);

    return findUser;
  }

  public async findById(id: string): Promise<User | undefined> {
    const findUser = this.users.find(user => user.id === id);

    return findUser;
  }

  public async create(userData: ICreateUserDTO): Promise<User> {
    const user = new User();
    Object.assign(user, { id: uuid(), ...userData });
    this.users.push(user);
    return user;
  }

  public async updateUser(user: User): Promise<User> {
    const findUserIndex = this.users.findIndex(
      findUser => findUser.id === user.id,
    );
    if (findUserIndex) {
      this.users[findUserIndex] = user;
    } else {
      this.users.push(user);
    }
    return user;
  }
}

export default UsersRepository;
