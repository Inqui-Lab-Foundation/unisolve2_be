
import { Request, Response, NextFunction } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";
import { constents } from "../configs/constents.config";
import { badgeSchema, badgeUpdateSchema } from "../validations/badges.validations";
import ValidationsHolder from "../validations/validationHolder";
import BaseController from "./base.controller";

export default class BadgeController extends BaseController {

    model = "badge";

    protected initializePath(): void {
        this.path = '/badges';
    }
    protected initializeValidations(): void {
        this.validations =  new ValidationsHolder(badgeSchema,badgeUpdateSchema);
    }
    protected initializeRoutes(): void {
        //example route to add 
        //this.router.get(`${this.path}/`, this.getData);
        super.initializeRoutes();
    };
    protected  async createData(req: Request, res: Response, next: NextFunction) {
        const copy = await this.copyAllFiles(req, "badge", "images", "badges");
        return super.createData(req, res, next);
    }

    protected getData(req: Request, res: Response, next: NextFunction) {
        return super.getData(req,res,next,[],
                    {exclude:constents.SEQUELIZE_FLAGS.DEFAULT_EXCLUDE_SCOPE})
    }
}