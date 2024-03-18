import { Request, Response } from "express";
import { STATUS_CODES } from "http";

export const handleError = (
  error: Error,
  customMessage?: string,
  express?: { req: Request; res: Response; status: number }
) => {
  if (process.env.NODE_ENV === "dev") {
    console.error(`${customMessage ?? "Error Encountered:"}
    Message: ${error?.message ?? error}
    Callstack: ${error?.stack}`);
  } else console.error(STATUS_CODES[500]);

  if (!express) return;

  const { res, status } = express;

  if (status && !res.headersSent)
    return res.status(status).send(STATUS_CODES[status]);
};
