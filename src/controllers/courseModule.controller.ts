import { courseModuleSchema, courseModuleUpdateSchema } from "../validations/courseModule.validationa";
import ValidationsHolder from "../validations/validationHolder";
import BaseController from "./base.controller";

export default class CourseModulesController extends BaseController {

    model = "course_module";

    protected initializePath(): void {
        this.path = '/courseModules';
    }
    protected initializeValidations(): void {
        this.validations =  new ValidationsHolder(courseModuleSchema,courseModuleUpdateSchema);
    }
    protected initializeRoutes(): void {
        //example route to add 
        //this.router.get(`${this.path}/`, this.getData);
        super.initializeRoutes();
    }
}