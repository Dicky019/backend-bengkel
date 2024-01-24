import { describe, test, expect } from "bun:test";
import { User } from "@prisma/client";

import { HttpStatus } from "@core/enum";
import { TErrorResponse, TSuccessResponse } from "@core/types";

import getStatusName from "@utils/http-utils";
import logger from "@utils/logger";

import { authUtil, fetchTest, userCheck } from "../test_utils";

const baseUrl = "auth/login";

const postLogin = async (data: { email?: string; password?: string } = {}) => {
  const res = await fetchTest(baseUrl, {
    method: "POST",
    data: {
      email: data?.email ?? "Guy_Connelly68@hotmail.com",
      password: data?.password ?? "password8775",
    },
  });
  return res.json();
};

describe("AUTH", () => {
  // START POST /auth/login ---> LOGIN
  describe(`LOGIN POST /${baseUrl}`, () => {
    // START Success
    test("Success ---> 200", async () => {
      const { user } = authUtil;
      const { code, data, status } = (await postLogin(
        user,
      )) as TSuccessResponse<User>;
      logger.info(data);

      expect(code).toEqual(HttpStatus.OK);
      expect(status).toEqual(getStatusName(HttpStatus.OK));
      expect(data).toEqual(
        expect.objectContaining({
          user: userCheck,
          token: expect.any(String),
        }),
      );
    });
    // END Success
    // START Error 404
    const authError = {
      email: ["Email tidak ada"],
      password: ["Password anda salah"],
    };

    test("Error wrong email ---> 404", async () => {
      const { code, errors, status } = (await postLogin({
        email: "Guy_Connelly68@hotmail.co",
        password: "password123",
      })) as TErrorResponse<User>;
      logger.info(errors);

      expect(code).toEqual(HttpStatus.NOT_FOUND);
      expect(status).toEqual(getStatusName(HttpStatus.NOT_FOUND));
      expect(errors).toEqual(
        expect.objectContaining({ email: authError.email }),
      );
    });

    test("Error wrong password ---> 400", async () => {
      const { code, errors, status } = (await postLogin({
        email: "Guy_Connelly68@hotmail.com",
        password: "password123",
      })) as TErrorResponse<User>;
      logger.info(errors);

      expect(code).toEqual(HttpStatus.BAD_REQUEST);
      expect(status).toEqual(getStatusName(HttpStatus.BAD_REQUEST));
      expect(errors).toEqual(
        expect.objectContaining({ password: authError.password }),
      );
    });

    const authErrorForm = {
      email: ["Email tidak valid"],
      password: ["Password minimal 8 karakter"],
    };

    test("Error validation email & password ---> 400", async () => {
      const { code, errors, status } = (await postLogin({
        email: "",
        password: "",
      })) as TErrorResponse<User>;
      logger.info(errors);

      expect(code).toEqual(HttpStatus.BAD_REQUEST);
      expect(status).toEqual(getStatusName(HttpStatus.BAD_REQUEST));
      expect(errors).toEqual(expect.objectContaining(authErrorForm));
    });

    test("Error validation email ---> 400", async () => {
      const { code, errors, status } = (await postLogin({
        email: "",
        password: "password123",
      })) as TErrorResponse<User>;

      expect(code).toEqual(HttpStatus.BAD_REQUEST);
      expect(status).toEqual(getStatusName(HttpStatus.BAD_REQUEST));
      expect(errors).toEqual(
        expect.objectContaining({ email: authErrorForm.email }),
      );
    });

    test("Error validation password ---> 400", async () => {
      const { code, errors, status } = (await postLogin({
        email: "Guy_Connelly68@hotmail.com",
        password: "",
      })) as TErrorResponse<User>;

      expect(code).toEqual(HttpStatus.BAD_REQUEST);
      expect(status).toEqual(getStatusName(HttpStatus.BAD_REQUEST));
      expect(errors).toEqual(
        expect.objectContaining({ password: authErrorForm.password }),
      );
    });
    // END Error 404
  });
  // END POST /auth/login ---> LOGIN
});
