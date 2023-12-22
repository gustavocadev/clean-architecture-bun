import { Request, Response } from 'express';
import { CustomError, RegisterUserDto } from '../../domain';
import { AuthRepository } from '../../domain/repositories/auth.repository';

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

    this.authRepository
      .register(registerUserDto!)
      .then((user) => {
        res.json({ user });
      })
      .catch((error) => this.handleError(error, res));
  };

  loginUser = (req: Request, res: Response) => {
    console.log(req.body);
    res.json({
      message: 'Login controller route',
    });
  };
}
