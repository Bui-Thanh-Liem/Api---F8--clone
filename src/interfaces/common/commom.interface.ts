import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import { IUser } from '../models/user.model';

export interface IDataUser {
  id: string;
  fullname: string;
  email: string;
  birth: string;
  isManager: boolean;
  isDirector: boolean;
}

export interface IResponseLogin {
  user: Partial<IUser>;
  token: string;
}

export interface IGetManyItem<T> {
  totalItems: number;
  items: Array<T>;
}

export interface IBaseResponse<T> {
  message: string;
  data?: T;
  statusCode?: StatusCodes;
  reasonStatusCode?: ReasonPhrases;
}
