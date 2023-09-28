import HttpStatus from 'http-status-codes';
import { JsonWebTokenError, NotBeforeError, TokenExpiredError } from 'jsonwebtoken';

import { unknown, ZodError } from 'zod';
import {BaseError as SequelizeBaseError}  from 'sequelize';
import HttpException from './exceptions/http.exception';

/**
 * Build error response for validation errors.
 * @param  {Error} error
 * @returns {Object} modified error
 */
export default function buildError(err:any) {
  // Validation errors
  if(err instanceof ZodError){
    let error_details = "";
    if(err.issues){
      error_details = JSON.stringify(err.issues);
    }
    return {
      code: HttpStatus.BAD_REQUEST,
      message: HttpStatus.getStatusText(HttpStatus.BAD_REQUEST),
      data:{},
      error:error_details
    };
  }
  if (err.isJoi) {
    return {
      code: HttpStatus.BAD_REQUEST,
      message: HttpStatus.getStatusText(HttpStatus.BAD_REQUEST),
      data:{},
      error:
        err.details 
        // &&
        // err.details.map(err => {
        //   return {
        //     message: err.message,
        //     param: err.path.join('.')
        //   };
        // })
    };
  }
  
  if(err instanceof SequelizeBaseError){
    let msg=err.name;
    //@ts-ignore
    if(err.errors && err.errors.length>0){
      //@ts-ignore
      msg = err.errors[0].message;
    }
    return {
      code: HttpStatus.METHOD_FAILURE,
      message: msg,
      data:{},
      error:err,
    };
  }
  // HTTP errors
  if (err.isBoom) {
    return {
      code: err.output.statusCode,
      message: err.output.payload.message || err.output.payload.error,
      data:{},
      error:err.output.payload.message || err.output.payload.error,
    };
  }
  if(err instanceof JsonWebTokenError || err instanceof NotBeforeError || err instanceof TokenExpiredError) {
    return {
      code: HttpStatus.UNAUTHORIZED,
      message: HttpStatus.getStatusText(HttpStatus.UNAUTHORIZED),
      data:{},
      error:err.message
    };
  }

  if( err instanceof HttpException){
    return {
      code: err.status,
      message: err.message,
      data:{},
      error:err.data
    };
  }
   let errStatus = HttpStatus.INTERNAL_SERVER_ERROR;
   if(err.hasOwnProperty('status') && err.status != undefined){
      errStatus = err.status;
   }if(err.hasOwnProperty('status_code') && err.status_code != undefined){
    errStatus = err.status_code;
  }if(err.hasOwnProperty('code') && err.code != undefined){
    errStatus = err.code;
   }

   let errMsg = HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR);
    if(err.hasOwnProperty('message')&& err.message != undefined){
      errMsg = err.message;
    }else if(err.hasOwnProperty('msg')&& err.msg != undefined){
      errMsg = err.msg;
    }
  // Return INTERNAL_SERVER_ERROR for all other cases
  return {
    code:  errStatus,
    message: errMsg,
    data:{},
    error:errMsg,
  };
}
