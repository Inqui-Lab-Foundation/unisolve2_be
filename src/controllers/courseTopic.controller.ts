
import { courseTopicSchema, courseTopicUpdateSchema } from "../validations/courseTopic.validations";
import ValidationsHolder from "../validations/validationHolder";
import BaseController from "./base.controller";

export default class CourseTopicController extends BaseController {

    model = "course_topic";

    protected initializePath(): void {
        this.path = '/courseTopics';
    }
    protected initializeValidations(): void {
        this.validations =  new ValidationsHolder(courseTopicSchema,courseTopicUpdateSchema);
    }
    protected initializeRoutes(): void {
        //example route to add 
        //this.router.get(this.path+"/", this.getData);
        super.initializeRoutes();
    }
} 
