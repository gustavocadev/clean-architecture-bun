import { Request, Response } from 'express';
import {
  CustomError,
  LoginUser,
  RegisterUser,
  RegisterUserDto,
} from '../../domain';
import { AuthRepository } from '../../domain/repositories/auth.repository';
import { JwtAdapter } from '../../config';
import { UserModel } from '../../data/mongodb';
import { LoginUserDto } from '../../domain/dtos/auth/login-user.dto';

export class AuthController {
  constructor(private readonly authRepository: AuthRepository) {}

  private handleError = (error: unknown, res: Response) => {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ error: error.message });
    }

    // if not is an instance of CustomError, then is an internal server error
    console.log(error);

    return res.status(500).json({ error: 'Internal server error' });
  };

  // my use cases
  registerUser = (req: Request, res: Response) => {
    const [error, registerUserDto] = RegisterUserDto.create(req.body);

    if (error) {
      return res.status(400).json({ error });
    }

    new RegisterUser(this.authRepository)
      .execute(registerUserDto!)
      .then((data) => res.json(data))
      .catch((error) => this.handleError(error, res));
  };

  loginUser = (req: Request, res: Response) => {
    const [error, loginUserDto] = LoginUserDto.login(req.body);
    if (error) {
      return res.status(400).json({ error });
    }

    new LoginUser(this.authRepository)
      .execute(loginUserDto!)
      .then((data) => res.json(data))
      .catch((error) => this.handleError(error, res));
  };

  getUsers = (req: Request, res: Response) => {
    UserModel.find()
      .then((users) =>
        res.json({
          // users,
          user: req.body.user,
        })
      )
      .catch((error) =>
        res.json({
          error: 'Internal server error',
        })
      );
  };
}
