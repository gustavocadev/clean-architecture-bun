import { Request, Response } from 'express';
import { RegisterUserDto } from '../../domain';
import { AuthRepository } from '../../domain/repositories/auth.repository';

export class AuthController {
  constructor(private readonly authRepository: AuthRepository) {}

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
      .catch((error) => {
        res.status(500).json({ error });
      });
  };

  loginUser = (req: Request, res: Response) => {
    console.log(req.body);
    res.json({
      message: 'Login controller route',
    });
  };
}
