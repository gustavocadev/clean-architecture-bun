import { AuthDatasource, RegisterUserDto, UserEntity } from '../../domain';
import { AuthRepository } from '../../domain/repositories/auth.repository';

export class AuthRepositoryImpl implements AuthRepository {
  constructor(private readonly authDatasource: AuthDatasource) {}

  register(registerUserDto: RegisterUserDto): Promise<UserEntity> {
    return this.authDatasource.register(registerUserDto);
  }
}
