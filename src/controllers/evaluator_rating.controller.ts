import { challengeRatingSchema, challengeRatingUpdateSchema } from "../validations/evaluator_rating.validations";
import ValidationsHolder from "../validations/validationHolder";
import BaseController from "./base.controller";

export default class EvaluatorRatingController extends BaseController {

    model = "evaluator_rating";

    protected initializePath(): void {
        this.path = '/evaluatorRating';
    }

    protected initializeValidations(): void {
        this.validations = new ValidationsHolder(challengeRatingSchema, challengeRatingUpdateSchema);
    }

    protected initializeRoutes(): void {
        //example route to add 
        // this.router.post(this.path+"/:id/response", this.submitResponse.bind(this));
        super.initializeRoutes();
    }
};