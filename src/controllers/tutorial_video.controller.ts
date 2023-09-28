
import { NextFunction, Request, Response } from "express";
import { constents } from "../configs/constents.config";
import { badgeSchema, badgeUpdateSchema } from "../validations/badges.validations";
import { tutorialVideosSchema, tutorialVideosUpdateSchema } from "../validations/tutorial_videos.validations";
import ValidationsHolder from "../validations/validationHolder";
import BaseController from "./base.controller";

export default class TutorialVideoController extends BaseController {

    model = "tutorial_video";

    protected initializePath(): void {
        this.path = '/tutorialVideos';
    }
    protected initializeValidations(): void {
        this.validations =  new ValidationsHolder(tutorialVideosSchema,tutorialVideosUpdateSchema);
    }
    protected initializeRoutes(): void {
        //example route to add 
        //this.router.get(`${this.path}/`, this.getData);
        super.initializeRoutes();
    }

    protected getData(req: Request, res: Response, next: NextFunction) {
        return super.getData(req,res,next,[],
                    {exclude:constents.SEQUELIZE_FLAGS.DEFAULT_EXCLUDE_SCOPE})
    }
}