import { Request, Response, NextFunction } from 'express';
import UserModel from '../models/user.model';

export const checkPhoneNumber = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { phoneNumber }: { phoneNumber: string } = req.body;
  const userFound = await UserModel.findOne({ phoneNumber });

  if (userFound) {
    return res.status(403).json({
      statusCode: 403,
      message: `phone number: ${phoneNumber} is already used`,
    });
  }

  next();
};