import { ErrorRequestHandler, RequestHandler } from "express";

export const handleError: ErrorRequestHandler = (error, req, res, next) => {
  return res.status(error.status).json({
    error: error.response,
    message: error.message,
    code: error.code || 0,
  });
};

export const logRequests: RequestHandler = (req, res, next) => {
  if (req.method === "GET")
    console.log(
      `Method: ${req.method} | To: ${req.path} | Query: ${JSON.stringify(
        req.query
      )}`
    );
  else {
    console.log(`Method: ${req.method} | To: ${req.path}`);
  }
  next();
};
