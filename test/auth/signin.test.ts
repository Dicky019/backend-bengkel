import { describe, test, expect } from "bun:test";

import userFaker from "@fakers/user";
import getStatusName from "@utils/http-utils";
import logger from "@utils/logger";

import { TErrorResponse, TSuccessResponse } from "@core/types";
import { HttpStatus } from "@core/enum";

import { TUser, TUserError } from "@features/user/user.type";

import { UserProps, authUtil, fetchTest, userCheck } from "../test_utils";

const baseUrl = "auth/signin";

const postSignin = async (data: UserProps = {}) => {
  const res = await fetchTest(baseUrl, {
    method: "POST",
    data,
  });
  return res.json();
};

describe("AUTH", () => {
  describe(`REGISTER POST /${baseUrl}`, () => {
    // START Success
    test("Success ---> 200", async () => {
      const user = userFaker();
      const { code, data, status } = (await postSignin({
        ...user,
        password: authUtil.user.password,
      })) as TSuccessResponse<TUser>;

      authUtil.user = {
        ...authUtil.user,
        email: data.email ?? "",
      };
      logger.info({ data, authUtil });

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
    test("Error validation ---> 400", async () => {
      const { code, errors, status } =
        (await postSignin()) as TErrorResponse<TUserError>;

      logger.info({ errors, authUtil });

      expect(code).toEqual(HttpStatus.BAD_REQUEST);
      expect(status).toEqual(getStatusName(HttpStatus.BAD_REQUEST));
      expect(errors).toEqual(
        expect.objectContaining({
          name: ["Required"],
          email: ["Required"],
          password: ["Required"],
          nomorTelephone: ["Required"],
          role: ["Required"],
        }),
      );
    });

    test("Error validation ---> 400", async () => {
      const { code, errors, status } = (await postSignin({
        email: "",
        name: "",
        nomorTelephone: "",
        password: "",
        role: "motir",
      })) as TErrorResponse<TUserError>;

      logger.info({ errors, authUtil });

      expect(code).toEqual(HttpStatus.BAD_REQUEST);
      expect(status).toEqual(getStatusName(HttpStatus.BAD_REQUEST));
      expect(errors).toEqual(
        expect.objectContaining({
          name: ["Nama harus diisi", "Nama minimal 3 karakter"],
          email: ["Email harus diisi", "Email tidak valid"],
          password: ["Password harus diisi", "Password minimal 8 karakter"],
          nomorTelephone: [
            "No.telephone harus diisi",
            "No.telephone tidak valid",
          ],
        }),
      );
    });

    // END Error 404
  });
});
