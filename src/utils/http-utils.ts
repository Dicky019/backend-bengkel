import { THttpStatusValue } from "@core/types/state";
import { HttpStatus } from "@core/enum";
import logger from "./logger";

// type HttpStatusName = keyof typeof HttpStatus;

function getStatusName(status: THttpStatusValue): string {
  const statusName = (
    Object.keys(HttpStatus) as Array<keyof typeof HttpStatus>
  ).find((key) => HttpStatus[key] === status);
  logger.info(statusName);
  return (statusName ?? "-").replaceAll("_", " ");
}

export default getStatusName;
