import { ReasonPhrases } from 'http-status-codes';

export class ResponseData<D> {
  data: D | D[];  message: string;
  statusCode: number;
  reasonStatusCode?: ReasonPhrases;

  constructor(
    data: D | D[],
    message: string,
    statusCode: number,
    reasonStatusCode?: ReasonPhrases,
  ) {
    this.data = data;
    this.message = message;
    this.statusCode = statusCode;
    this.reasonStatusCode = reasonStatusCode;

    return this;
  }
}

