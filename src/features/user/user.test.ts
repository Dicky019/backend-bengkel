import { testClient } from "hono/testing";
import { expect, test, describe } from "bun:test";
import {
  getUserByIdRouter,
  getUsersRouter,
  updateUserRouter,
  deleteUserRouter,
  createUserRouter,
} from "./user.controller";
import HttpStatus from "~/utils/http-utils";
import { TUpdateUser } from "./user.type";
import { userfaker } from "./user.faker";
import env from "~/utils/env";

let id = "dd823200-9c26-43b3-b340-62968771410d";

const headerToken = {
  headers: {
    authorization: `Bearer ${env.TOKEN_ADMIN}`,
  },
};

// TODO: Fungsion for testing
/**
 * START Fungsion for testing
 */
const getAll = async () => {
  const res = await testClient(getUsersRouter).index.$get(
    undefined,
    headerToken,
  );

  return res;
};

const getbyId = (userId: string) =>
  testClient(getUserByIdRouter)[":id"].$get(
    {
      param: {
        id: userId,
      },
    },
    headerToken,
  );

const createUser = (user: Omit<TUpdateUser, "id">) => {
  const res = testClient(createUserRouter).index.$post(
    {
      json: userfaker(user),
    },
    headerToken,
  );
  return res;
};

const updateUser = (user: TUpdateUser) =>
  testClient(updateUserRouter)[":id"].$put(
    {
      json: userfaker(user),
      param: {
        id: user.id,
      },
    },
    headerToken,
  );

const deleteUser = (userId: string) =>
  testClient(deleteUserRouter)[":id"].$delete(
    {
      param: {
        id: userId,
      },
    },
    headerToken,
  );

/**
 * END Fungsion for testing
 */

// TODO: GET USERS
/**
 * Test suite for GET /users endpoint
 */
describe("GET ALL", () => {
  const getAllTest = async () => {
    const res = await getAll();
    const { code, data } = await res.json();
    // logger.debug(data);

    expect(code).toEqual(HttpStatus.OK);
    expect(data).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(String),
          name: expect.any(String),
          email: expect.stringContaining("@"),
          nomorTelephone: expect.stringContaining("+62"),
          role: expect.any(String),
          image: expect.nullOrAny(String),
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        }),
      ]),
    );
  };
  test("GET /users --> array users", getAllTest);

  test("GET:REDIS /users --> array users", getAllTest);
});

// TODO: GET BY ID
/**
 * Test suite for GET /users/:id endpoint
 */
describe("GET BY ID", () => {
  const getUserByIdSucces = async () => {
    const res = await getbyId(id);
    const { code, data } = await res.json();

    expect(code).toEqual(HttpStatus.OK);
    expect(data).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        name: expect.any(String),
        email: expect.stringContaining("@"),
        nomorTelephone: expect.stringContaining("+62"),
        role: expect.any(String),
        image: data.image,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      }),
    );
  };

  test("GET /users/id --> get user", getUserByIdSucces);

  test("GET:REDDIS /users/id --> get user", getUserByIdSucces);

  test("GET /users/id --> get user error : id not fount", async () => {
    const res = await getbyId("863e4643-dc96-4f72-9efb-fdddbf016e5f");

    expect(res.status).toEqual(HttpStatus.NOT_FOUND);
  });
});

// TODO: POST CREATE
/**
 * Test suite for POST /users endpoint
 */
describe("POST USER", () => {
  test("POST /users --> create user", async () => {
    const user = userfaker();
    const res = await createUser(user);

    const { code, data } = await res.json();

    // logger.debug(data);
    id = data.id;

    expect(code).toEqual(HttpStatus.OK);
    expect(data).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        name: expect.any(String),
        email: expect.stringContaining("@"),
        nomorTelephone: expect.stringContaining("+62"),
        role: expect.any(String),
        image: data.image,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      }),
    );
  });

  test("POST /users --> create error : same email & nomorTelephone", async () => {
    const res = await createUser({
      email: "Chaz66@hotmail.com",
      nomorTelephone: "+62 580-227-2956",
    });

    expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
  });

  test("POST /users --> create error : same email", async () => {
    const res = await createUser({
      email: "Chaz66@hotmail.com",
    });

    expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
  });

  test("POST /users --> create error : same nomorTelephone", async () => {
    const res = await createUser({
      email: "Chaz66@hotmail.com",
    });

    expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
  });

  test("POST /users --> create error : validation", async () => {
    const res = await createUser({
      email: "",
      nomorTelephone: "adasdsa",
      name: "",
      role: "pengendara",
    });

    expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
  });
});

// TODO: TES PUT
/**
 * Test suite for PUT /users/:id endpoint
 */
describe("UPDATE USER", () => {
  test("PUT /users/id --> update user", async () => {
    const res = await updateUser({ id });

    expect(res.status).toEqual(HttpStatus.OK);
  });

  test("PUT /users/id --> update user error : id not fount", async () => {
    const res = await updateUser({
      id: "863e4643-dc96-4f72-9efb-fdddbf016e5f",
    });

    expect(res.status).toEqual(HttpStatus.NOT_FOUND);
  });

  test("PUT /users/id --> update user error : validation", async () => {
    const res = await updateUser({
      id,
      email: "",
      nomorTelephone: "adasdsa",
      name: "",
      role: "pengendara",
    });

    expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
  });
});

// TODO: TES DELETE
/**
 * Test suite for DELETE /users/:id endpoint
 */

describe("DELETE USER", () => {
  test("DELETE /users/id --> delete user", async () => {
    const res = await deleteUser(id);

    expect(res.status).toEqual(HttpStatus.OK);
  });

  test("DELETE /users/id --> delete user error : id not fount", async () => {
    // id: "863e4643-dc96-4f72-9efb-fdddbf016e5f",
    const res = await deleteUser("863e4643-dc96-4f72-9efb-fdddbf016e5f");

    expect(res.status).toEqual(HttpStatus.NOT_FOUND);
  });
});
