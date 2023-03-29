import { StatusCodes } from "http-status-codes"

const errorCodes = {
  userAlreadyExists: 11000
}

const errorHandlerMiddleware = (err, req, res, next) => {
  console.error(err.message)

  const defaultError = {
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || err.msg || "Something went wrong, try again later",
  }

  if (err.name === "ValidationError") {
    defaultError.statusCode = StatusCodes.BAD_REQUEST
    defaultError.msg = Object.values(err.errors)
      .map((item) => item.message)
      .join("; ")
  }
  if(err.code && err.code === errorCodes.userAlreadyExists) {
    defaultError.statusCode = StatusCodes.BAD_REQUEST
    defaultError.msg = `${Object.keys(err.keyValue)} already in use`
  }

  res
    .status(defaultError.statusCode)
    .json({ msg: `${defaultError.msg}` })
};

export default errorHandlerMiddleware
