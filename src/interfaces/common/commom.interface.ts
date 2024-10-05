import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import { IUser } from '../models/user.model';
import { ETypeTimer } from 'src/enums/common.enum';

export interface IDataUser {
  id: string;
  fullName: string;
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

