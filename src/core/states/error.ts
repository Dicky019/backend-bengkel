import type { TCodeError, TErrorResponse, TErrors } from "@core/types";
import getStatusName from "@utils/http-utils";

export default class HTTPException<T> extends Error {
  readonly code: TCodeError;

  readonly options: TErrors<T>;

  constructor(code: TCodeError, options: TErrors<T>) {
    super(`HTTP Exception with status ${code}`);
    this.code = code;
    this.options = options;
  }

  getResponse(): TErrorResponse<T> {
    return {
      code: this.code,
      status: getStatusName(this.code),
      errors: this.options.errors,
    };
  }
}
