import { describe, test } from "bun:test";

import logger from "@utils/logger";

import { authUtil, fetchTest } from "../test_utils";

const url = "auth/refresh";

const postRefresh = async () => {
  const res = await fetchTest(url, {
    method: "GET",
    token: authUtil.token,
  });
  return res.json();
};

describe("AUTH", () => {
  // START GET /auth/refresh ---> REFRESH
  describe(`REFRESH GET /${url}`, () => {
    // START Success
    test("Success ---> 200", async () => {
      const res = await postRefresh();

      logger.info(res);

      //   authUtil.token = data.token;

      //   expect(code).toEqual(HttpStatus.OK);
      //   expect(status).toEqual(getStatusName(HttpStatus.OK));
      //   expect(data).toEqual(
      //     expect.objectContaining({
      //       user: userCheck,
      //       token: expect.any(String),
      //     }),
      //   );
    });
  });
  // END POST /auth/login ---> LOGIN
});
