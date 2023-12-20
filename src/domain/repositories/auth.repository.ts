import { RegisterUserDto, UserEntity } from '..';

// to define rules
export abstract class AuthRepository {
  // Todo:
  // abstract login(loginUserDto: LoginUserDto): Promise<UserEntity>

  abstract register(registerUserDto: RegisterUserDto): Promise<UserEntity>;
}
