import { UserProps, authUtil, fetchTest, userCheck } from "test/test_utils";
import { describe, test, expect } from "bun:test";

import userFaker from "@fakers/user";
import logger from "@utils/logger";
import type { TUser, TUserError } from "@features/user";

import { HttpStatus } from "@core/enum";
import type { TErrorResponse, TSuccessResponse } from "@core/types";

const baseUrl = "users";

const createUser = async (data: UserProps | undefined = undefined) => {
  const userData = userFaker(data);
  const res = await fetchTest(baseUrl, {
    method: "POST",
    token: authUtil.token,
    data: userData,
  });
  const json = res.json();
  logger.warn({ userData, json });

  return json;
};

describe("USER", () => {
  describe(`CREATE POST /${baseUrl}`, () => {
    // START SUCCESS
    test("Success ---> 201", async () => {
      const { code, data } = (await createUser()) as TSuccessResponse<TUser>;

      authUtil.user.id = data.id;

      expect(code).toEqual(HttpStatus.CREATED);
      expect(data).toEqual(userCheck);
    });
    // END SUCCESS

    // START ERROR
    test("Error same email & nomorTelephone ---> 400", async () => {
      const { code, errors } = (await createUser({
        email: "Tyson82@yahoo.com",
        nomorTelephone: "+62 256-933-8470",
      })) as TErrorResponse<TUserError>;

      expect(code).toEqual(HttpStatus.BAD_REQUEST);
      expect(errors).toEqual(
        expect.objectContaining({
          email: expect.arrayContaining([expect.any(String)]),
          nomorTelephone: expect.arrayContaining([expect.any(String)]),
        }),
      );
    });

    test("Error same email ---> 400", async () => {
      const { code, errors } = (await createUser({
        email: "Tyson82@yahoo.com",
      })) as TErrorResponse<TUserError>;

      logger.warn(errors);

      expect(code).toEqual(HttpStatus.BAD_REQUEST);
    });

    test("Error same nomorTelephone ---> 400", async () => {
      const json = (await createUser({
        nomorTelephone: "+62 256-933-8470",
      })) as TErrorResponse<TUserError>;

      expect(json.code).toEqual(HttpStatus.BAD_REQUEST);
    });

    test("Error validation ---> 400", async () => {
      const json = (await createUser({
        email: "",
        nomorTelephone: "adasdsa",
        name: "",
        role: "pengendara",
      })) as TErrorResponse<TUserError>;

      expect(json.code).toEqual(HttpStatus.BAD_REQUEST);
    });
    // END ERROR
  });
});
