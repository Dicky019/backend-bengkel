import { beforeAll, afterAll } from "bun:test";
import { prisma } from "~/db";
import { logger } from "~/utils/logger";

beforeAll(async () => {
  // global setup
  await prisma.$connect();
  logger.info("START TEST --->>>>");
});

afterAll(async () => {
  // global teardown
  await prisma.$disconnect();
  logger.info("END TEST --->>>>");
});
