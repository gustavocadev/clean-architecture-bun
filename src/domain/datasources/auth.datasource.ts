import { RegisterUserDto, UserEntity } from '..';
import { LoginUserDto } from '../dtos/auth/login-user.dto';

// to define rules
export abstract class AuthDatasource {
  abstract login(loginUserDto: LoginUserDto): Promise<UserEntity>;

  abstract register(registerUserDto: RegisterUserDto): Promise<UserEntity>;
}
