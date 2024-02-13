import { describe, test, expect } from "bun:test";
import { User } from "@prisma/client";

import getStatusName from "@utils/http-utils";
import logger from "@utils/logger";

import { TErrorResponse, TSuccessResponse } from "@core/types";
import { HttpStatus } from "@core/enum";

import type { TAuthError } from "@features/auth";

import { authUtil, fetchTest, userCheck } from "../test_utils";

const baseUrl = "auth/me";

const TokenExpired =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImIyNWExMDdkLWE0MTItNGI0ZS1hMjdkLTNmOTcxODVkMDU0NiIsIm5hbWUiOiJMdWNpbGxlIFR1cm5lciIsImVtYWlsIjoiR3V5X0Nvbm5lbGx5NjhAaG90bWFpbC5jb20iLCJub21vclRlbGVwaG9uZSI6Iis2MiAyMTAtNDcwLTg3NzUiLCJyb2xlIjoiYWRtaW4iLCJpbWFnZSI6bnVsbCwiY3JlYXRlZEF0IjoiMjAyNC0wMS0xNVQwNTowNjoxNi43OTZaIiwidXBkYXRlZEF0IjoiMjAyNC0wMS0xNVQwNTowNjoxNi43OTZaIiwiaWF0IjoxNzA1NjMwMjQ0LCJleHAiOjE3MDU4ODk0NDR9.M7LtC6xsWAHdYgNHI0fRVGmh7kLn9huF4xKJTjLoGqQ";

const getMy = async (token?: string) => {
  const res = await fetchTest(baseUrl, {
    method: "GET",
    token,
  });
  return res.json();
};

describe("AUTH", () => {
  describe(`MY POST /${baseUrl}`, () => {
    // START Success
    test("Success ---> 200", async () => {
      const { code, data, status } = (await getMy(
        authUtil.token,
      )) as TSuccessResponse<User>;

      logger.info({ data });

      expect(code).toEqual(HttpStatus.OK);
      expect(status).toEqual(getStatusName(HttpStatus.OK));
      expect(data).toEqual(expect.objectContaining(userCheck));
    });
    // END Success
    // START Error 404
    // const authError = {
    //   email: ["Email tidak ada"],
    //   password: ["Password anda salah"],
    // };

    test("Error No Token  ---> 401", async () => {
      const { code, errors, status } = (await getMy(
        undefined,
      )) as TErrorResponse<TAuthError>;

      logger.warn({ errors });

      expect(code).toEqual(HttpStatus.UNAUTHORIZED);
      expect(status).toEqual(getStatusName(HttpStatus.UNAUTHORIZED));
      expect(errors).toEqual(
        expect.objectContaining({ auth: ["Anda Belum Login"] }),
      );
    });

    test("Error Token Expire ---> 401", async () => {
      const { code, errors, status } = (await getMy(
        TokenExpired,
      )) as TErrorResponse<TAuthError>;

      logger.warn({ errors });

      expect(code).toEqual(HttpStatus.UNAUTHORIZED);
      expect(status).toEqual(getStatusName(HttpStatus.UNAUTHORIZED));
      expect(errors).toEqual(
        expect.objectContaining({ token: ["Token expire"] }),
      );
    });

    // END Error 404
  });
});
