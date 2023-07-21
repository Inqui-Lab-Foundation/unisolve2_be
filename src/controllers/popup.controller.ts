import { popupSchema, popupUpdateSchema } from "../validations/popup.validation";
import ValidationsHolder from "../validations/validationHolder";
import BaseController from "./base.controller";

export default class popupController extends BaseController {

    model = "popup";

    protected initializePath(): void {
        this.path = '/popup';
    }
    protected initializeValidations(): void {
        this.validations = new ValidationsHolder(popupSchema, popupUpdateSchema);
    }
    protected initializeRoutes(): void {
        //example route to add 
        // this.router.get(`${this.path}/`, this.getDataNew.bind(this));
        super.initializeRoutes();
    }
}