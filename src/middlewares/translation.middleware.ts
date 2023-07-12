// It will monkey patch the res.send.
// The patch intercepts the send invocation, executes is logic such as atatus.setResponseBody

import { NextFunction, Request,RequestHandler,Response } from "express";
import { constents } from "../configs/constents.config";
import TranslationService from "../services/translation.service";

// then restores the original send function and invokes that to finalize the req/res chain
export const resSendInterceptor = (res:Response, send:any) => (content:any) => {

    // Set response body in Atatus Analytics
    // Atatus is our API analytics tool
    

    // TODO: You can modify your response body as you wish.

    // Invoke the original send function.
    res.send = send;
    send.apply(this, "arguments");

};

export const translationMiddleware = (req:Request,res:Response,next:NextFunction)=>{
    var locale:any = req.query.locale
    
    const trasnlationService = new TranslationService()
    if(!locale || !trasnlationService.getSupportedLocales().includes(locale)){
        locale  = constents.translations_flags.default_locale
    }
    
    trasnlationService.setCurrentLocale(locale);
    
    res.locals.translationService = trasnlationService;
    next()
}