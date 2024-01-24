import { expect, beforeAll, afterAll } from "bun:test";
// import { prisma } from "@/db";
import logger from "@utils/logger";

beforeAll(async () => {
  // global setup
  // await prisma.$connect();
  logger.info("START TEST --->>>>");
});

afterAll(async () => {
  // global teardown
  // await prisma.$disconnect();
  logger.info("END TEST --->>>>");
});

declare module "bun:test" {
  interface Expect {
    nullOrAny: (received: unknown) => {
      pass: boolean;
      message: () => string;
    };
  }
}

expect.extend({
  nullOrAny(received, expected) {
    if (received === null) {
      return {
        pass: true,
        message: () =>
          `expected null or instance of ${this.utils.printExpected(
            expected,
          )}, but received ${this.utils.printReceived(received)}`,
      };
    }
    if (expected === String) {
      return {
        pass: typeof received === "string" || received instanceof String,
        message: () =>
          `expected null or instance of ${this.utils.printExpected(
            expected,
          )}, but received ${this.utils.printReceived(received)}`,
      };
    }
    if (expected === Number) {
      return {
        pass: typeof received === "number" || received instanceof Number,
        message: () =>
          `expected null or instance of ${this.utils.printExpected(
            expected,
          )}, but received ${this.utils.printReceived(received)}`,
      };
    }
    if (expected === Function) {
      return {
        pass: typeof received === "function" || received instanceof Function,
        message: () =>
          `expected null or instance of ${this.utils.printExpected(
            expected,
          )}, but received ${this.utils.printReceived(received)}`,
      };
    }
    if (expected === Object) {
      return {
        pass: received !== null && typeof received === "object",
        message: () =>
          `expected null or instance of ${this.utils.printExpected(
            expected,
          )}, but received ${this.utils.printReceived(received)}`,
      };
    }
    if (expected === Boolean) {
      return {
        pass: typeof received === "boolean",
        message: () =>
          `expected null or instance of ${this.utils.printExpected(
            expected,
          )}, but received ${this.utils.printReceived(received)}`,
      };
    }
    /* jshint +W122 */
    return {
      pass: received instanceof expected,
      message: () =>
        `expected null or instance of ${this.utils.printExpected(
          expected,
        )}, but received ${this.utils.printReceived(received)}`,
    };
  },
});
