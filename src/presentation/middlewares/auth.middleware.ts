import { NextFunction, Request, Response } from 'express';
import { JwtAdapter } from '../../config';
import { UserModel } from '../../data/mongodb';

export class AuthMiddleware {
  static validateJWT = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const authorization = req.header('Authorization');

    if (!authorization)
      return res.status(401).json({ error: 'No token provided' });

    if (!authorization.startsWith('Bearer'))
      return res.status(401).json({ error: 'Invalid token' });

    const token = authorization.split(' ').at(1) ?? '';

    try {
      //  todo:
      const payload = await JwtAdapter.validateToken<{ id: string }>(token);

      if (!payload) return res.status(401).json({ error: 'Invalid token' });

      // todo: esto que hacemos en duro, lo deberiamos hacer a traves de un repositorio
      const user = await UserModel.findById(payload.id);

      if (!user)
        return res
          .status(401)
          .json({ error: 'Invalid token - user not found' });

      req.body.user = user;
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: 'Internal server error' });
    }

    console.log('validating jwt middleware');
    next();
  };
}
