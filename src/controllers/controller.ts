import { NextFunction, Request, Response } from "express";
import { STATUS_CODES } from "http";

export const createController = () => {
  return {
    root: (req: Request, res: Response) => {
      return res.status(200).redirect("api/docs");
    },
    pageNotFound: (req: Request, res: Response, next: NextFunction) => {
      return res
        .status(404)
        .json({ error: STATUS_CODES[404], message: "Route not found." });
    },
  };
};
