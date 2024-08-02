import { IBaseResponse } from 'src/interfaces/common/commom.interface';
import { StatusCodes, ReasonPhrases } from 'http-status-codes';

export abstract class Response<T = any> {
  message: string;
  data: T | undefined;
  abstract statusCode: number;
  abstract responseStatusCode: string;

  constructor({ message, data }: IBaseResponse<T>) {
    this.message = message;
    this.data = data;
  }
}

export class ResponseOk<T> extends Response {
  statusCode: number = StatusCodes.OK;
  responseStatusCode: string = ReasonPhrases.OK;

  constructor({ message, data }: IBaseResponse<T>) {
    super({ message, data });
  }
}