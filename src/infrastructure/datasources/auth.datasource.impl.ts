import { UserMapper } from '..';
import { BcryptAdapter } from '../../config';
import { UserModel } from '../../data/mongodb';
import {
  AuthDatasource,
  CustomError,
  RegisterUserDto,
  UserEntity,
} from '../../domain';
import { LoginUserDto } from '../../domain/dtos/auth/login-user.dto';

type HashFunction = (password: string) => Promise<string>;
type CompareFunction = (password: string, hashed: string) => Promise<boolean>;

// Es la implementacion porque aqui es donde usaremos los metodos de la libreria de base de datos, tambien se puede usar para injectar dependencias como el hash y el compare
export class AuthDatasourceImpl implements AuthDatasource {
  constructor(
    private readonly hashPassword: HashFunction = BcryptAdapter.hash,
    private readonly comparePassword: CompareFunction = BcryptAdapter.compare
  ) {}

  async register(registerUserDto: RegisterUserDto): Promise<UserEntity> {
    const { email, name, password } = registerUserDto;

    try {
      // 1. Verify if email is already registered
      const exists = await UserModel.findOne({ email });
      if (exists) {
        // the msg should be generic because we don't want to give info about the email, cus hackers can use this info to hack the account
        throw CustomError.badRequest('Email already registered');
      }

      // 2. hash password
      const user = await UserModel.create({
        email,
        name,
        password: await this.hashPassword(password),
      });

      await user.save();

      // 3. Mapping the answer from the database to the entity
      // todo: aqui falta un mapper

      return UserMapper.userEntityFromObject(user);
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }

      throw CustomError.internalServerError();
    }
  }

  async login(loginUserDto: LoginUserDto): Promise<UserEntity> {
    const { email, password } = loginUserDto;

    try {
      // find user
      const user = await UserModel.findOne({ email });
      if (!user) {
        throw CustomError.badRequest('Email not registered');
      }

      // validate password
      const isValid = await this.comparePassword(password, user.password);
      if (!isValid) {
        throw CustomError.badRequest('Invalid password');
      }

      return UserMapper.userEntityFromObject(user);
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }

      throw CustomError.internalServerError();
    }
  }
}
