import { instructionsSchema, instructionsUpdateSchema } from "../validations/instructions.validations";
import ValidationsHolder from "../validations/validationHolder";
import BaseController from "./base.controller";

export default class InstructionController extends BaseController {

    model = "instructions";

    protected initializePath(): void {
        this.path = '/instructions';
    }
    protected initializeValidations(): void {
        this.validations = new ValidationsHolder(instructionsSchema, instructionsUpdateSchema);
    }
    protected initializeRoutes(): void {
        //example route to add 
        // this.router.get(`${this.path}/`, this.getDataNew.bind(this));
        super.initializeRoutes();
    }
}