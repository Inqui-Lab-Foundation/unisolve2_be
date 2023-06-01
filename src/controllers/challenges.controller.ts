import { NextFunction, Request, Response } from "express";
import { constents } from "../configs/constents.config";
import { challenge_question } from "../models/challenge_questions.model";
import ValidationsHolder from "../validations/validationHolder";
import BaseController from "./base.controller";
import { challengeSchema, challengeUpdateSchema } from "../validations/challenge.validations copy";
export default class ChallengeController extends BaseController {

    model = "challenge";

    protected initializePath(): void {
        this.path = '/challenge';
    }
    protected initializeValidations(): void {
        this.validations = new ValidationsHolder(challengeSchema, challengeUpdateSchema);
    }
    protected initializeRoutes(): void {
        super.initializeRoutes();
    }
    protected getData(req: Request, res: Response, next: NextFunction) {
        return super.getData(req, res, next,
            [],
            { exclude: constents.SEQUELIZE_FLAGS.DEFAULT_EXCLUDE_SCOPE_WITHOUT_STATUS_CREATEDATTRS },
            {
                required: false,
                model: challenge_question,
                attributes: { exclude: constents.SEQUELIZE_FLAGS.DEFAULT_EXCLUDE_SCOPE_WITHOUT_STATUS_CREATEDATTRS },

            },
            [[challenge_question, 'question_no', 'ASC']]
        )
    }
}