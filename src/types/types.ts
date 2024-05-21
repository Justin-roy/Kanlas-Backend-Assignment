import { NextFunction, Request, Response } from "express";


export interface NewUserRequestBody {
  email: string;
  phone: number;
  password: string;
}

export type ControllerType = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void | Response<any, Record<string, any>>>;