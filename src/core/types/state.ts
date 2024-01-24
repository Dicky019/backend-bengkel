import { HttpStatus, HttpStatusError, HttpStatusSuccess } from "@core/enum";

type THttpStatusKeys = keyof typeof HttpStatus;

export type THttpStatusValue = (typeof HttpStatus)[THttpStatusKeys];

export type TCodeError = (typeof HttpStatusError)[keyof typeof HttpStatusError];

export type TErrors<T> = {
  errors: T;
};

export type TErrorResponse<T> = {
  code: TCodeError;
  status: string;
} & TErrors<T>;

export type TCodeSuccess =
  (typeof HttpStatusSuccess)[keyof typeof HttpStatusSuccess];

export type TSuccess<T> = {
  data: T;
  meta?: object;
};

export type TSuccessResponse<T> = {
  code: TCodeSuccess;
  status: string;
} & TSuccess<T>;
