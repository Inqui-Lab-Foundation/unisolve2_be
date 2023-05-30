import HttpStatus from 'http-status-codes';

import buildError from '../utils/build_error';
import { ErrorRequestHandler, NextFunction, Request, Response } from 'express';
import logIt from '../utils/logit.util';
import { constents } from '../configs/constents.config';
import dispatcher from '../utils/dispatch.util';

/**
 * Error response middleware for 404 not found.
 * @param {Object} req
 * @param {Object} res
 */
export function notFound(req:Request, res:Response) {
  res.status(HttpStatus.NOT_FOUND).json({
      code: HttpStatus.NOT_FOUND,
      message: HttpStatus.getStatusText(HttpStatus.NOT_FOUND),
      error: HttpStatus.getStatusText(HttpStatus.NOT_FOUND),
      data:{}
  });
}

/**
 * Method not allowed error middleware. This middleware should be placed at
 * the very bottom of the middleware stack.
 *
 * @param {Object} req
 * @param {Object} res
 */
export function methodNotAllowed(req:Request, res:Response) {
  res.status(HttpStatus.METHOD_NOT_ALLOWED).json({
      code: HttpStatus.METHOD_NOT_ALLOWED,
      message: HttpStatus.getStatusText(HttpStatus.METHOD_NOT_ALLOWED),
      error: HttpStatus.getStatusText(HttpStatus.METHOD_NOT_ALLOWED),
      data:{}
  });
}

/**
 * To handle errors from body parser for cases such as invalid JSON sent through
 * the body (https://github.com/expressjs/body-parser#errors).
 *
 * @param  {Object}   err
 * @param  {Object}   req
 * @param  {Object}   res
 * @param  {Function} next
 */
export const bodyParser: ErrorRequestHandler = async (err: any, req: Request, res: Response, next: NextFunction) => {
  await logIt(constents.log_levels.list.ERROR, `${err.message}: ${err}`, req, res);

  res.status(err.status).json({
      code: err.status,
      message: HttpStatus.getStatusText(err.status),
      error: HttpStatus.getStatusText(err.status),
      data:{}
  });
}

/**
 * Generic error response middleware for validation and internal server errors.
 *
 * @param  {Object}   err
 * @param  {Object}   req
 * @param  {Object}   res
 * @param  {Function} next
 */
export const genericErrorHandler: ErrorRequestHandler = async (err: any, req: Request, res: Response, next: NextFunction) => {
  await logIt(constents.log_levels.list.ERROR, `${err.message}: ${err}`, req, res);
  const error = buildError(err);
  res.status(error.code).send(dispatcher(res,null, 'error',error.message,error.code))
}
