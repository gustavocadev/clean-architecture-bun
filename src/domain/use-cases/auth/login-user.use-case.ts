import { AuthDatasource, CustomError } from '../..';
import { JwtAdapter } from '../../../config';
import { LoginUserDto } from '../../dtos/auth/login-user.dto';

type GenToken = (payload: Object, duration?: string) => Promise<string | null>;

type UserToken = {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
};

interface LoginUserUseCase {
  execute(loginUserDto: LoginUserDto): Promise<UserToken>;
}

export class LoginUser implements LoginUserUseCase {
  constructor(
    private readonly authDatasource: AuthDatasource,
    private readonly generateToken: GenToken = JwtAdapter.generateToken
  ) {}

  async execute(loginUserDto: LoginUserDto) {
    const { email, id, name, password } = await this.authDatasource.login(
      loginUserDto
    );

    const token = await this.generateToken({ id }, '2h');

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
