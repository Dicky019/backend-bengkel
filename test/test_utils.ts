import { expect } from "bun:test";
import { z } from "zod";

import { updateUserSchema } from "@features/user/user.schema";

import env from "@utils/env";

type featchOpsition = {
  data?: object;
  token?: string;
  method?: "GET" | "POST" | "PUT" | "DELETE";
};

export type UserProps = z.infer<typeof updateUserSchema>;

export const authUtil = {
  token:
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImQ5ZWE3ZTMyLTg5ODEtNDIxOS1iNDUzLWFiOWU2MWQyOWIzMyIsIm5hbWUiOiJDYXRoeSBLZWVibGVyLVN0cm9tYW4iLCJlbWFpbCI6IkNhbGUuSGVybWFubkB5YWhvby5jb20iLCJub21vclRlbGVwaG9uZSI6Iis2MiAwNDItNzU4LTI0MDkiLCJyb2xlIjoibW90aXIiLCJpbWFnZSI6bnVsbCwiY3JlYXRlZEF0IjoiMjAyNC0wMS0yMlQwNjoyMDozMi4wNTdaIiwidXBkYXRlZEF0IjoiMjAyNC0wMS0yMlQwNjoyMDozMi4wNTdaIiwiaWF0IjoxNzA1OTA0NDYyLCJleHAiOjE3MDYxNjM2NjJ9.4ygd0uTTM4fYGKZsnCE0Mn7AA4dBRc3RrpNr23t4iIU",
  user: {
    id: "51b94860-1343-474d-92d3-67fb6eff437f",
    password: "password2409",
    email: "Cale.Hermann@yahoo.com",
  },
};

export const userCheck = expect.objectContaining({
  id: expect.any(String),
  name: expect.any(String),
  email: expect.stringContaining("@"),
  nomorTelephone: expect.stringContaining("+62"),
  role: expect.any(String),
  image: expect.nullOrAny(String),
  createdAt: expect.any(String),
  updatedAt: expect.any(String),
});

export const fetchTest = async (
  url: string,

  { data, token, method }: featchOpsition = {
    data: undefined,
    token: undefined,
    method: "GET",
  },
) => {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const baseUrl = `${env.APP_URL}:${env.PORT}`;

  const response = await fetch(`${baseUrl}/${url}`, {
    method, // *GET, POST, PUT, DELETE, etc.
    headers,
    body: data ? JSON.stringify(data) : undefined, // body data type must match "Content-Type" header
  });
  return response;
};
