import compression from 'compression';
import { Request, Response, NextFunction } from "express";
import { get } from "lodash";

/**
 * Don't compress responses with headers.x-no-compression request header
 * @param req Request Object
 * @param res Response Object
 * @returns filtered request and response 
 */
export const  resCompress =  (req:Request, res:Response) => {
  const headerCompression = get(req,'headers.x-no-compression',{});
    if (headerCompression) {
      return false
    }
    // fallback to standard filter function
    return compression.filter(req, res)
  }
