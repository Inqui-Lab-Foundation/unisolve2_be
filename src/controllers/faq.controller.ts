import { Request, Response, NextFunction } from "express";
import { constents } from "../configs/constents.config";
import { faqSchema,faqSchemaUpdateSchema } from "../validations/faq.validation";
import ValidationsHolder from "../validations/validationHolder";
import BaseController from "./base.controller";

export default class FaqController extends BaseController {

    model = "faq";

    protected initializePath(): void {
        this.path = '/faqs';
    }
    protected initializeValidations(): void {
        this.validations =  new ValidationsHolder(faqSchema,faqSchemaUpdateSchema);
    }
    protected initializeRoutes(): void {
        //example route to add 
        // this.router.get(`${this.path}/`, this.getDataNew.bind(this));
        super.initializeRoutes();
        
    }

    protected getData(req: Request, res: Response, next: NextFunction) {
        return super.getData(req,res,next,[],
                    {exclude:constents.SEQUELIZE_FLAGS.DEFAULT_EXCLUDE_SCOPE})
    }
    
}