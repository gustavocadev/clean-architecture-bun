import { CustomError, RegisterUserDto } from '../..';
import { JwtAdapter } from '../../../config';
import { AuthRepository } from '../../repositories/auth.repository';

type UserToken = {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
};

interface RegisterUserUseCase {
  execute(registerUserDto: RegisterUserDto): Promise<UserToken>;
}

type SignToken = (payload: Object, duration?: string) => Promise<string | null>;

export class RegisterUser implements RegisterUserUseCase {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly signToken: SignToken = JwtAdapter.generateToken
  ) {}

  async execute(registerUserDto: RegisterUserDto): Promise<UserToken> {
    // crear el usuario
    const { email, id, name, password } = await this.authRepository.register(
      registerUserDto
    );
    // token
    const token = await this.signToken({ id }, '2h');

    if (!token) throw CustomError.internalServerError(`Error signing token`);

    return {
      token,
      user: {
        id,
        name,
        email,
      },
    };
  }
}
