import {
  AuthDatasource,
  CustomError,
  RegisterUserDto,
  UserEntity,
} from '../../domain';

export class AuthDatasourceImpl implements AuthDatasource {
  async register(registerUserDto: RegisterUserDto): Promise<UserEntity> {
    const { email, name, password } = registerUserDto;

    try {
      // 1. Verify if email is already registered

      // 2. hash password

      // 3. Mapping the answer from the database to the entity

      return new UserEntity('1', name, email, password, ['ADMIN_ROLE']);
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }

      throw CustomError.internalServerError();
    }
  }
}
