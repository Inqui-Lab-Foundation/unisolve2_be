
import { badRequest, unauthorized } from "boom";
import { Request,Response,NextFunction } from "express";
import { speeches } from "../configs/speeches.config";
import dispatcher from "../utils/dispatch.util";
import { mentorTopicProgressSchema, mentorTopicProgressUpdateSchema } from "../validations/mentorTopicProgress.validations";
import { userTopicProgressSchema, userTopicProgressUpdateSchema,  } from "../validations/userTopicProgress.validations";
import ValidationsHolder from "../validations/validationHolder";
import BaseController from "./base.controller";

export default class MentorTopicProgressController extends BaseController {

    model = "mentor_topic_progress";

    protected initializePath(): void {
        this.path = '/mentorTopicProgress';
    }
    protected initializeValidations(): void {
        this.validations =  new ValidationsHolder(mentorTopicProgressSchema,mentorTopicProgressUpdateSchema);
    }
    protected initializeRoutes(): void {
        //example route to add 
        //this.router.get(this.path+"/", this.getData);
        super.initializeRoutes();
    }

    protected async createData(req: Request, res: Response, next: NextFunction) : Promise<Response | void>{
        try {
            const { model } = req.params;
            const {mentor_course_topic_id} = req.body;
            if (model) {
                this.model = model;
            };
            let user_id = res.locals.user_id;
            if (!user_id) {
                throw unauthorized(speeches.UNAUTHORIZED_ACCESS)
            }
            
            const modelLoaded = await this.loadModel(model);
            // console.log(modelLoaded)
            // for( let key in modelLoaded.rawAttributes ){
            //     console.log('Field: ', key); // this is name of the field
            //     console.log('TypeField: ', modelLoaded.rawAttributes[key].type.key); // Sequelize type of field
            // }
            //check if the topic progress already exists then don't create a new entry
            const topicProgressAlreadyPresent = await modelLoaded.findOne({
                where:{
                    user_id:user_id,
                    mentor_course_topic_id:mentor_course_topic_id
            }})
            // console.log(topicProgressAlreadyPresent)
            if( topicProgressAlreadyPresent instanceof Error){
                throw topicProgressAlreadyPresent
            }
            
            let payload = this.autoFillTrackingColumns(req, res, modelLoaded)
            payload.user_id = user_id;
            let data = {}
            let msg = "OK";
            if(topicProgressAlreadyPresent){
                const alreadyPresentStatus = topicProgressAlreadyPresent.dataValues.status;
                if(alreadyPresentStatus.toLowerCase() !=payload.status.toLowerCase()){
                    data = await this.crudService.updateAndFind(modelLoaded, payload,{
                        where:{
                            user_id:user_id,
                            mentor_course_topic_id:mentor_course_topic_id
                        }
                    });
                }else{
                    data = topicProgressAlreadyPresent
                    msg = "topic status was already "+alreadyPresentStatus
                }
            }else{
                data = await this.crudService.create(modelLoaded, payload);    
            }
            // if (!data) {
            //     return res.status(404).send(dispatcher(res,data, 'error'));
            // }
            if ( data instanceof Error) {
                throw badRequest(data.message)
            }
            if (!data) {
                throw badRequest("sorry return data is empty.")
            }
            return res.status(201).send(dispatcher(res,data, 'created',msg));
        } catch (error) {
            next(error);
        }
    }
} 
