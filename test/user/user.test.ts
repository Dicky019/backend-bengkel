// import { expect, test, describe } from "bun:test";

// import {HttpStatus} from "@/core/enum";
// import { UserProps, authUtil, fetchTest, userCheck } from "../test_utils";
// import logger from "@/utils/logger";
// import userFaker from "@/faker/user.faker";

// // TODO: Fungsion for testing
// /**
//  * START Fungsion for testing
//  */

// const updateUser = (id: string, data: UserProps | undefined = undefined) => {
//   const res = fetchTest(`users/${id}`, {
//     method: "PUT",
//     authRole: "admin",
//     data: userFaker(data),
//   });
//   return res;
// };

// const deleteUser = (id: string) => {
//   const res = fetchTest(`users/${id}`, {
//     method: "DELETE",
//     authRole: "admin",
//   });
//   return res;
// };

// /**
//  * END Fungsion for testing
//  */

// // TODO: GET USERS
// /**
//  * Test suite for GET /users endpoint
//  */
// describe("USER", () => {
//   describe("GET ALL", () => {
//     const getAllTest = async () => {
//       const res = await fetchTest("users", { authRole: "admin" });
//       const { data } = (await res.json()) as {
//         code: number;
//         data: object;
//         meta: object;
//       };
//       logger.debug(data);

//       // expect(data.code).toEqual(HttpStatus.OK);
//       expect(data).toEqual(expect.arrayContaining([userCheck]));
//     };
//     test("GET /users --> array users", getAllTest);

//     test("GET:REDIS /users --> array users", getAllTest);
//   });

//   // TODO: GET BY ID
//   /**
//    * Test suite for GET /users/:id endpoint
//    */
//   describe("GET BY ID", () => {
//     const getUserByIdSucces = async () => {
//       const {
//         user: { id },
//       } = authUtil;
//       const res = await fetchTest(`/users/${id}`, {
//         authRole: "admin",
//       });
//       const { code, data } = (await res.json()) as {
//         code: number;
//         data: object;
//       };
//       logger.info({ data, code });

//       expect(code).toEqual(HttpStatus.OK);
//       expect(data).toEqual(userCheck);
//     };

//     test("GET /users/id --> get user", getUserByIdSucces);

//     test("GET:REDDIS /users/id --> get user", getUserByIdSucces);

//     test("GET /users/id --> get user error : id not fount", async () => {
//       const id = "863e4643-dc96-4f72-9efb-fdddbf016e5f";
//       const res = await fetchTest(`users/${id}`, { authRole: "admin" });

//       expect(res.status).toEqual(HttpStatus.NOT_FOUND);
//     });
//   });

//   // TODO: POST CREATE
//   /**
//    * Test suite for POST /users endpoint
//    */

//   // TODO: TES PUT
//   /**
//    * Test suite for PUT /users/:id endpoint
//    */
//   describe("UPDATE BY ID", () => {
//     test("PUT /users/id --> update user", async () => {
//       const res = await updateUser(authUtil.user.id);

//       expect(res.status).toEqual(HttpStatus.OK);
//     });

//     test("PUT /users/id --> update user error : id not fount", async () => {
//       const res = await updateUser("863e4643-dc96-4f72-9efb-fdddbf016e5f");

//       expect(res.status).toEqual(HttpStatus.NOT_FOUND);
//     });

//     test("PUT /users/id --> update user error : validation", async () => {
//       const res = await updateUser(authUtil.user.id, {
//         email: "",
//         name: "",
//         nomorTelephone: "adasdsa",
//         role: "pengendara",
//       });

//       expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
//     });
//   });

//   // TODO: TES DELETE
//   /**
//    * Test suite for DELETE /users/:id endpoint
//    */

//   describe("DELETE BY ID ", () => {
//     test("DELETE /users/id --> delete user", async () => {
//       const res = await deleteUser(authUtil.user.id);

//       expect(res.status).toEqual(HttpStatus.OK);
//     });

//     test("DELETE /users/id --> delete user error : id not fount", async () => {
//       // id: "863e4643-dc96-4f72-9efb-fdddbf016e5f",
//       const res = await deleteUser("863e4643-dc96-4f72-9efb-fdddbf016e5f");

//       expect(res.status).toEqual(HttpStatus.NOT_FOUND);
//     });
//   });
// });
