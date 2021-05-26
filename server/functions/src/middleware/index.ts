import { ErrorRequestHandler, RequestHandler } from "express";

export const handleError: ErrorRequestHandler = (error, req, res, next) => {
  console.log(`ERROR: ${error.description}`);
  return res.status(error.status).json({
    error: error.response,
    status: error.status || 500,
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
