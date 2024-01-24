import { Context } from "hono";
import { HttpStatusSuccess } from "@core/enum";
import { TCodeSuccess, TSuccess } from "@core/types";
import getStatusName from "@utils/http-utils";

export default class HTTPSuccess<T> {
  readonly context: Context;

  readonly code: TCodeSuccess;

  readonly data: TSuccess<T>;

  constructor(
    context: Context,
    { code, ...data }: TSuccess<T> & { code?: TCodeSuccess },
  ) {
    this.context = context;
    this.code = code ?? HttpStatusSuccess.OK;
    this.data = data;
  }

  getResponse() {
    return this.context.json(
      {
        code: this.code,
        status: getStatusName(this.code),
        ...this.data,
      },
      this.code,
    );
  }
}
