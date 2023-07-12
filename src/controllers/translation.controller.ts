import { badRequest } from "boom";
import { Request,Response,NextFunction } from "express";
import { constents } from "../configs/constents.config";
import TranslationService from "../services/translation.service";
import dispatcher from "../utils/dispatch.util";
import TranslationsProvider from "../utils/translations/translationProvider";

import { courseModuleSchema, courseModuleUpdateSchema } from "../validations/courseModule.validationa";
import { translationSchema, translationUpdateSchema } from "../validations/translation.validations";
import ValidationsHolder from "../validations/validationHolder";
import BaseController from "./base.controller";

export default class TranslationController extends BaseController {

    model = "translation";

    protected initializePath(): void {
        this.path = '/translations';
    }
    protected initializeValidations(): void {
        this.validations =  new ValidationsHolder(translationSchema,translationUpdateSchema);
    }
    protected initializeRoutes(): void {
        //example route to add 
        this.router.get(`${this.path}/refresh`, this.refreshTranslation.bind(this));
        this.router.get(`${this.path}/key`, this.getTrasnlationKey.bind(this));
        this.router.post(`${this.path}/translate-refresh`, this.translationRefresh.bind(this));
        super.initializeRoutes();
    }
    protected async getTrasnlationKey(req:Request,res:Response,next:NextFunction){
        try{
            const value:any = req.query.val
            if(!value){
                throw badRequest();
            }
            const result =  TranslationsProvider.getTranslationKeyForValue(res.locals.translationService.getCurrentLocale(),value)
            // console.log("translatedObjKey",result)
            res.locals.translationService.setCurrentLocale(constents.translations_flags.default_locale)
            res.status(200).send(dispatcher(res,result,"success"))
        }catch(err){
            next(err)
        }
    }
    protected async refreshTranslation(req:Request,res:Response,next:NextFunction){
        try{
            const service = new TranslationService();
            await service.refreshDataFromDb();
            res.status(201).send(dispatcher(res,"data refrehsed succesfully", 'success'));
        }catch(err){
            next(err)
        }
    }

    protected async translationRefresh(req:Request,res:Response,next:NextFunction)
    {
        console.log("Req ",req)
        let translateTable = req.body?.translateTable ? req.body?.translateTable : '*';
        
        try{
            const service = new TranslationService();
           let ser =  await service.translationRefresh(translateTable);
            // res.status(201).send(dispatcher(res,ser, 'success'));
            res.status(201).send(ser);
        }catch(err){
            console.log("🚀 ~ file: translation.controller.ts ~ line 63 ~ TranslationController ~ err", err)
            next(err)
        }
    }
}