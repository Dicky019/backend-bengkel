import { testClient } from "hono/testing";
import { expect, test, describe } from "bun:test";
import {
  getUserByIdRouter,
  getUsersRouter,
  updateUserRouter,
  deleteUserRouter,
  createUserRouter,
} from "./user.controller";
import { HttpStatus } from "~/utils/http-utils";
import { faker } from "@faker-js/faker";
import { logger } from "~/utils/logger";

let id = "dd823200-9c26-43b3-b340-62968771410d";

describe("GET ALL", () => {
  const getAllTest = async () => {
    const res = await testClient(getUsersRouter).index.$get();
    const { code, data } = await res.json();
    logger.debug(data);

    expect(code).toEqual(HttpStatus.OK);
    expect(data).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(String),
          name: expect.any(String),
          email: expect.stringContaining("@"),
          nomorTelephone: expect.stringContaining("+62"),
          role: expect.any(String),
          image: null,
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        }),
      ])
    );
  };
  test("GET /users --> array users", getAllTest);

  test("GET:REDIS /users --> array users", getAllTest);
});

describe("GET BY ID", () => {
  const getUserById = async () => {
    const res = await testClient(getUserByIdRouter)[":id"].$get({
      param: {
        id: id,
      },
    });

    expect(res.status).toEqual(HttpStatus.OK);
  };

  test("GET /users/id --> get user", getUserById);

  test("GET:REDDIS /users/id --> get user", getUserById);

  test("GET /users/id --> get user", async () => {
    const res = await testClient(getUserByIdRouter)[":id"].$get({
      param: {
        id: "863e4643-dc96-4f72-9efb-fdddbf016e5f",
      },
    });

    expect(res.status).toEqual(HttpStatus.NOT_FOUND);
  });
});

describe("POST USER", () => {
  test("POST /users --> create user", async () => {
    const user = userfaker();
    const res = await testClient(createUserRouter).index.$post({
      json: user,
    });
    const { code, data } = await res.json();

    logger.debug(data);
    id = data.id;

    expect(code).toEqual(HttpStatus.OK);
    expect(data.email).toEqual(user.email);
    expect(data.name).toEqual(user.name);
    expect(data.nomorTelephone).toEqual(user.nomorTelephone);
    expect(data.role).toEqual(user.role);
  });

  test("POST /users --> create error : same email & nomorTelephone", async () => {
    const user = userfaker();
    const res = await testClient(createUserRouter).index.$post({
      json: {
        email: "Chaz66@hotmail.com",
        nomorTelephone: "+62 580-227-2956",
        name: user.name,
        role: user.role,
      },
    });

    expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
  });

  test("POST /users --> create error : same email", async () => {
    const user = userfaker();
    const res = await testClient(createUserRouter).index.$post({
      json: {
        email: "Chaz66@hotmail.com",
        nomorTelephone: user.nomorTelephone,
        name: user.name,
        role: user.role,
      },
    });

    expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
  });

  test("POST /users --> create error : same nomorTelephone", async () => {
    const user = userfaker();
    const res = await testClient(createUserRouter).index.$post({
      json: {
        email: user.email,
        nomorTelephone: "+62 147-651-8821",
        name: user.name,
        role: user.role,
      },
    });

    expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
  });

  test("POST /users --> create error : validation", async () => {
    const res = await testClient(createUserRouter).index.$post({
      json: {
        email: "",
        nomorTelephone: "adasdsa",
        name: "",
        role: "pengendara",
      },
    });

    expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
  });
});

describe("UPDATE USER", () => {
  test("PUT /users/id --> update user", async () => {
    const user = userfaker();
    const res = await testClient(updateUserRouter)[":id"].$put({
      json: user,
      param: {
        id: id,
      },
    });

    expect(res.status).toEqual(HttpStatus.OK);
  });
  test("PUT /users/id --> update user error : id not fount", async () => {
    const user = userfaker();
    const res = await testClient(updateUserRouter)[":id"].$put({
      json: user,
      param: {
        id: "863e4643-dc96-4f72-9efb-fdddbf016e5f",
      },
    });

    expect(res.status).toEqual(HttpStatus.NOT_FOUND);
  });

  test("PUT /users/id --> update user error : validation", async () => {
    const res = await testClient(updateUserRouter)[":id"].$put({
      json: {
        email: "",
        nomorTelephone: "adasdsa",
        name: "",
        role: "pengendara",
      },
      param: {
        id,
      },
    });

    expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
  });
});

describe("DELETE USER", () => {
  test("DELETE /users/id --> delete user", async () => {
    const res = await testClient(deleteUserRouter)[":id"].$delete({
      param: {
        id: id,
      },
    });

    expect(res.status).toEqual(HttpStatus.OK);
  });
  test("DELETE /users/id --> delete user error : id not fount", async () => {
    const res = await testClient(deleteUserRouter)[":id"].$delete({
      param: {
        id: "863e4643-dc96-4f72-9efb-fdddbf016e5f",
      },
    });

    expect(res.status).toEqual(HttpStatus.NOT_FOUND);
  });
});

const userfaker = () => {
  const numberPhone = faker.helpers.fromRegExp(
    "+62 [0-9]{3}-[0-9]{3}-[0-9]{4}"
  ); // +62 813-444-5555,

  const role = faker.helpers.enumValue({
    pengendara: "pengendara",
    motir: "motir",
  } as const);

  return {
    email: faker.internet.email(),
    name: faker.person.fullName(),
    nomorTelephone: numberPhone,
    role: role,
  };
};
