

import { badData, badRequest, internal, notFound, unauthorized } from "boom";
import { NextFunction, Request, Response } from "express";
import { invalid } from "joi";
import { Op } from "sequelize";
import { constents } from "../configs/constents.config";
import { speeches } from "../configs/speeches.config";
import validationMiddleware from "../middlewares/validation.middleware";
import { quiz_survey_question } from "../models/quiz_survey_question.model";
import { quiz_survey_response } from "../models/quiz_survey_response.model";
import dispatcher from "../utils/dispatch.util";
import {  quizSchema, quizSubmitResponseSchema, quizSubmitResponsesSchema, quizUpdateSchema } from "../validations/quiz_survey.validations";
import ValidationsHolder from "../validations/validationHolder";
import BaseController from "./base.controller";
import db from "../utils/dbconnection.util";
import { quiz_survey } from "../models/quiz_survey.model";
import { mentor } from "../models/mentor.model";
import { organization } from "../models/organization.model";
import { user } from "../models/user.model";
import { student } from "../models/student.model";
export default class QuizSurveyController extends BaseController {

    model = "quiz_survey";

    protected initializePath(): void {
        this.path = '/quizSurveys';
    }
    protected initializeValidations(): void {
        this.validations =  new ValidationsHolder(quizSchema,quizUpdateSchema);
    }
    protected initializeRoutes(): void {
        //example route to add 
        this.router.get(this.path+"/:id/nextQuestion/",this.getNextQuestion.bind(this));
        this.router.post(this.path+"/:id/response/",validationMiddleware(quizSubmitResponseSchema),this.submitResponseSingle.bind(this));
        this.router.post(this.path+"/:id/responses/",validationMiddleware(quizSubmitResponsesSchema),this.submitResponses.bind(this));

        this.router.get(this.path+"/:quiz_survey_id/surveyStatus",this.getQuizSurveyStatus.bind(this));

        super.initializeRoutes();
    }
    protected async getQuizSurveyStatus(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try{
            const {quiz_survey_id} = req.params

            const quizSureyResult = await quiz_survey.findOne({where:{
                quiz_survey_id:quiz_survey_id
            }})
            if(!quizSureyResult){
                throw badRequest(speeches.INVALID_DATA)
            }
            if(quizSureyResult instanceof Error){
                throw quizSureyResult
            }
            let quizSurveyStatusParam:any = req.query.quizSurveyStatus;
            if(!quizSurveyStatusParam || !(quizSurveyStatusParam in constents.quiz_survey_status_flags.list)){
                quizSurveyStatusParam=constents.quiz_survey_status_flags.default
            }
            let condition = {}
            const userIdsObjWithQuizCompletedArr = await quiz_survey_response.findAll({
                attributes:[
                    "user_id"
                ],
                raw:true,
                where:{
                    quiz_survey_id : quiz_survey_id,
                }
            })

            if(userIdsObjWithQuizCompletedArr instanceof Error){
                throw userIdsObjWithQuizCompletedArr
            }

            const userIdsWithQuizCompletedArr=userIdsObjWithQuizCompletedArr.map((element)=>{
                return element.user_id
            });
            // console.log("userIdsWithQuizCompletedArr",userIdsWithQuizCompletedArr)
            if(quizSurveyStatusParam == constents.quiz_survey_status_flags.list["COMPLETED"]){
                condition = {
                    user_id:{
                        [Op.in]:userIdsWithQuizCompletedArr
                    }
                }
            }else if(quizSurveyStatusParam == constents.quiz_survey_status_flags.list["INCOMPLETE"]){
                condition = {
                    user_id:{
                        [Op.notIn]:userIdsWithQuizCompletedArr
                    }
                }
            }
            // console.log("condition",condition)
            let roleParam:any = req.query.role;
            if(!roleParam || !(roleParam in constents.user_role_flags.list)){
                roleParam=constents.user_role_flags.list["MENTOR"]
            }
            let roleBasedModelToBeUsed:any = mentor;
            let roleBasedIncludeArrToBeUsed:any = [
                {model:organization},
                {model:user},
            ];
            if(roleParam!=constents.user_role_flags.list["MENTOR"]){
                roleBasedModelToBeUsed = student
                roleBasedIncludeArrToBeUsed = [
                    {model:user},
                ];
            }

            const { page, size, status } = req.query;
            
            // condition = status ? { status: { [Op.like]: `%${status}%` } } : null;
            const { limit, offset } = this.getPagination(page, size);

            const paramStatus:any = req.query.status;
            let whereClauseStatusPart: any = {};
            let whereClauseStatusPartLiteral = "1=1";
            let addWhereClauseStatusPart = false
            if (paramStatus && (paramStatus in constents.common_status_flags.list)) {
                if (paramStatus === 'ALL') {
                    whereClauseStatusPart = {};
                    addWhereClauseStatusPart = false;
                } else {
                    whereClauseStatusPart = { "status": paramStatus };
                    addWhereClauseStatusPart = true;
                }
            } else {
                whereClauseStatusPart = { "status": "ACTIVE" };
                addWhereClauseStatusPart = true;
            }
            // console.log("came here",roleBasedModelToBeUsed)
            const mentorsResult = await roleBasedModelToBeUsed.findAll({
                attributes:{ 
                    include:[
                        [
                            // Note the wrapping parentheses in the call below!
                            db.literal(`(
                                SELECT CASE WHEN EXISTS 
                                    (SELECT user_id 
                                    FROM quiz_survey_responses as qsp 
                                    WHERE qsp.user_id = \`${roleBasedModelToBeUsed.name}\`.\`user_id\`
                                    AND qsp.quiz_survey_id = ${quiz_survey_id}) 
                                THEN  
                                    "COMPLETED"
                                ELSE 
                                    "INCOMPLETE"
                                END as quiz_survey_status
                            )`),
                            'quiz_survey_status'
                        ],
                    ]
                },
                where: {
                    [Op.and]: [
                        whereClauseStatusPart,
                        condition
                    ]
                },
                include:roleBasedIncludeArrToBeUsed,
                limit,offset
            });
            // console.log("mentorsResult",mentorsResult)

            if(!mentorsResult){
                throw notFound(speeches.DATA_NOT_FOUND)
            }
            if(mentorsResult instanceof Error){
                throw mentorsResult
            }
            res.status(200).send(dispatcher(res,mentorsResult,"success"))
        }catch(err){
            console.log(err)
            next(err)
        }

    }
    protected async getData(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            let user_id = res.locals.user_id;
            if (!user_id) {
                throw unauthorized(speeches.UNAUTHORIZED_ACCESS)
            }
            let role:any = req.query.role;
            
            if(role && !Object.keys(constents.user_role_flags.list).includes(role)){
                role = "MENTOR"
            }
            let data: any;
            const { model, id } = req.params;
            const paramStatus: any = req.query.status;
            if (model) {
                this.model = model;
            };
            // pagination
            const { page, size, title } = req.query;
            let condition:any = {};
            if(title){
                condition.title =  { [Op.like]: `%${title}%` } 
            }
            if(role){
                condition.role = role;
            }
            const { limit, offset } = this.getPagination(page, size);
            const modelClass = await this.loadModel(model).catch(error => {
                next(error)
            });
            const where: any = {};
            let whereClauseStatusPart: any = {};
            let whereClauseStatusPartLiteral = "1=1";
            let addWhereClauseStatusPart = false
            if (paramStatus && (paramStatus in constents.common_status_flags.list)) {
                if (paramStatus === 'ALL') {
                    whereClauseStatusPart = {};
                    addWhereClauseStatusPart = false;
                } else {
                    whereClauseStatusPart = { "status": paramStatus };
                    addWhereClauseStatusPart = true;
                }
            } else {
                whereClauseStatusPart = { "status": "ACTIVE" };
                addWhereClauseStatusPart = true;
            }
            if (id) {
                where[`${this.model}_id`] = req.params.id;
                data = await this.crudService.findOne(modelClass, {
                    attributes:[
                        "quiz_survey_id",
                        "no_of_questions",
                        "role",
                        "name",
                        "description",
                        [
                            // Note the wrapping parentheses in the call below!
                            db.literal(`(
                                SELECT CASE WHEN EXISTS 
                                    (SELECT status 
                                    FROM quiz_survey_responses as p 
                                    WHERE p.user_id = ${user_id} 
                                    AND p.quiz_survey_id = \`quiz_survey\`.\`quiz_survey_id\`) 
                                THEN  
                                    "COMPLETED"
                                ELSE 
                                    '${constents.task_status_flags.default}'
                                END as progress
                            )`),
                            'progress'
                        ],
                    ],
                    where: {
                        [Op.and]: [
                            whereClauseStatusPart,
                            where,
                            condition
                        ]
                    },
                    
                    include:{
                        required:false,
                        model:quiz_survey_question,
                    }                  
                });
            } else {
                try {
                    const responseOfFindAndCountAll = await this.crudService.findAndCountAll(modelClass, {
                        where: {
                            [Op.and]: [
                                whereClauseStatusPart,
                                condition
                            ]
                        },
                        attributes:[
                            "quiz_survey_id",
                            "no_of_questions",
                            "role",
                            "name",
                            "description",
                            [
                                // Note the wrapping parentheses in the call below!
                                db.literal(`(
                                    SELECT CASE WHEN EXISTS 
                                        (SELECT status 
                                        FROM quiz_survey_responses as p 
                                        WHERE p.user_id = ${user_id} 
                                        AND p.quiz_survey_id = \`quiz_survey\`.\`quiz_survey_id\`) 
                                    THEN  
                                        "COMPLETED"
                                    ELSE 
                                        '${constents.task_status_flags.default}'
                                    END as progress
                                )`),
                                'progress'
                            ]
                        ],
                        include:{
                            required:false,
                            model:quiz_survey_question,
                        },limit, offset
                    })
                    const result = this.getPagingData(responseOfFindAndCountAll, page, limit);
                    data = result;
                } catch (error: any) {
                    console.log(error)
                    next(error)
                }

            }
            // if (!data) {
            //     return res.status(404).send(dispatcher(res,data, 'error'));
            // }
            if (!data || data instanceof Error) {
                if (data != null) {
                    throw notFound(data.message)
                } else {
                    throw notFound()
                }
                res.status(200).send(dispatcher(res,null,"error",speeches.DATA_NOT_FOUND));
                // if(data!=null){
                //     throw 
                (data.message)
                // }else{
                //     throw notFound()
                // }
            }

            //remove unneccesary data 
            //if  survey is completed then dont send back the questions ...!!!
            
            if(data && data.dataValues && data.dataValues.length>0){
                data.dataValues = data.dataValues.map(((quizSurvey:any)=>{
                    if(quizSurvey && quizSurvey.dataValues && quizSurvey.dataValues.progress){
                        if(quizSurvey.dataValues.progress=="COMPLETED"){
                            delete quizSurvey.dataValues.quiz_survey_questions
                        }
                    }
                    console.log(quizSurvey.dataValues)
                    return quizSurvey;
                }))
            }else if(data && data.dataValues){
                if(data && data.dataValues && data.dataValues.progress){
                    if(data.dataValues.progress=="COMPLETED"){
                        delete data.dataValues.quiz_survey_questions
                    }
                }
            }

            return res.status(200).send(dispatcher(res,data, 'success'));
        } catch (error) {
            console.log(error)
            next(error);
        }
    }


    protected async  getNextQuestion(req:Request,res:Response,next:NextFunction): Promise<Response | void> {
        
        const  quiz_survey_id  = req.params.id;
        const  paramStatus :any = req.query.status;
        const user_id =  res.locals.user_id;
        if(!quiz_survey_id){
            throw badRequest(speeches.QUIZ_ID_REQUIRED);
        }
        if(!user_id){
            throw unauthorized(speeches.UNAUTHORIZED_ACCESS);
        }
        //do not check for course topic in this case .... //check if the given quiz is a valid topic
        // const curr_topic =  await this.crudService.findOne(course_topic,{where:{"topic_type_id":quiz_id,"topic_type":"QUIZ"}})
        // if(!curr_topic || curr_topic instanceof Error){
        //     throw badRequest("INVALID TOPIC");
        // }

        const quizRes = await this.crudService.findOne(quiz_survey_response,{where: {quiz_survey_id:quiz_survey_id,user_id:user_id}});
        if(quizRes instanceof Error){
            throw internal(quizRes.message)
        }
        let whereClauseStatusPart:any = {}
        let boolStatusWhereClauseRequired = false
        if(paramStatus && (paramStatus in constents.common_status_flags.list)){
            whereClauseStatusPart = {"status":paramStatus}
            boolStatusWhereClauseRequired = true;
        }

        let level = "HARD"
        let question_no = 1
        let nextQuestion:any=null;
        // console.log(quizRes)
        if(quizRes){
            //TOOO :: implement checking response and based on that change the 
            let user_response:any = {}
            user_response =  JSON.parse(quizRes.dataValues.response);
            // console.log(user_response);
            let questionNosAsweredArray = Object.keys(user_response);
            questionNosAsweredArray = questionNosAsweredArray.sort((a,b) => (Number(a) > Number(b) ? -1 : 1));
            const noOfQuestionsAnswered = Object.keys(user_response).length
            // console.log(noOfQuestionsAnswered)
            const lastQuestionAnsewered = user_response[questionNosAsweredArray[0]]//we have assumed that this length will always have atleast 1 item ; this could potentially be a source of bug, but is not since this should always be true based on above checks ..
            // if(lastQuestionAnsewered.selected_option == lastQuestionAnsewered.correct_answer){
            //     question_no = lastQuestionAnsewered.question_no+1;

            // }else{
                // question_no = lastQuestionAnsewered.question_no;
                question_no = lastQuestionAnsewered.question_no+1;
                if(lastQuestionAnsewered.level == "HARD"){
                    level = "MEDIUM"
                }else if(lastQuestionAnsewered.level == "MEDIUM"){
                    level = "EASY"
                }else if(lastQuestionAnsewered.level == "EASY"){
                    question_no = lastQuestionAnsewered.question_no+1;
                    level = "HARD"
                }
            // }
        }
        
        const nextQuestionsToChooseFrom = await this.crudService.findOne(quiz_survey_question,{where:{
            [Op.and]:[
                whereClauseStatusPart,
                {quiz_survey_id:quiz_survey_id},
                // {level:level},
                {question_no:question_no},
            ]
            
        }})
        
        if(nextQuestionsToChooseFrom instanceof Error){
            throw internal(nextQuestionsToChooseFrom.message)
        }
        if(nextQuestionsToChooseFrom){
            let resultQuestion:any = {}
            let optionsArr = []
            if(nextQuestionsToChooseFrom.dataValues.option_a){
                optionsArr.push(nextQuestionsToChooseFrom.dataValues.option_a)
            }
            if(nextQuestionsToChooseFrom.dataValues.option_b){
                optionsArr.push(nextQuestionsToChooseFrom.dataValues.option_b)
            }
            if(nextQuestionsToChooseFrom.dataValues.option_c){
                optionsArr.push(nextQuestionsToChooseFrom.dataValues.option_c)
            }
            if(nextQuestionsToChooseFrom.dataValues.option_d){
                optionsArr.push(nextQuestionsToChooseFrom.dataValues.option_d)
            }
            if(nextQuestionsToChooseFrom.dataValues.option_e){
                optionsArr.push(nextQuestionsToChooseFrom.dataValues.option_e)
            }
            
            
            resultQuestion["quiz_id"] = nextQuestionsToChooseFrom.dataValues.quiz_id;
            resultQuestion["quiz_question_id"] = nextQuestionsToChooseFrom.dataValues.quiz_question_id;
            resultQuestion["question_no"] = nextQuestionsToChooseFrom.dataValues.question_no;
            resultQuestion["question"] = nextQuestionsToChooseFrom.dataValues.question;
            resultQuestion["question_image"] = nextQuestionsToChooseFrom.dataValues.question_image;
            resultQuestion["options"] = optionsArr;
            resultQuestion["level"] = nextQuestionsToChooseFrom.dataValues.level;
            resultQuestion["type"] = nextQuestionsToChooseFrom.dataValues.type;

            res.status(200).send(dispatcher(res,resultQuestion))
        }else{
            //update worksheet topic progress for this user to completed..!!
            // if(!boolStatusWhereClauseRequired || 
            //     (boolStatusWhereClauseRequired && paramStatus == "ACTIVE")){
            //     const updateProgress =  await this.crudService.create(user_topic_progress,{"user_id":user_id,"course_topic_id":curr_topic.course_topic_id,"status":"COMPLETED"})
            // }
            
            //send response that quiz is completed..!!
            res.status(200).send(dispatcher(res,"Quiz has been completed no more questions to display"))
        }
        
    }

    protected async submitResponseSingle(req:Request,res:Response,next:NextFunction) {
        try{
            
            const  quiz_survey_id  = req.params.id;
            const {quiz_survey_question_id,selected_option} = req.body;
            const user_id =  res.locals.user_id;
            if(!quiz_survey_id){
                throw badRequest(speeches.QUIZ_ID_REQUIRED);
            }
            if(!quiz_survey_question_id){
                throw badRequest(speeches.QUIZ_QUESTION_ID_REQUIRED);
            }
            
            if(!user_id){
                throw unauthorized(speeches.UNAUTHORIZED_ACCESS);
            }

            const result =  await this.insertSingleResponse(user_id,quiz_survey_id,quiz_survey_question_id,selected_option);
            res.status(200).send(dispatcher(res,result))
        }catch(err){
            next(err)
        }
    }

    protected async insertSingleResponse(user_id:any,quiz_survey_id:any,quiz_survey_question_id:any,selected_option:any){
        try{
            const questionAnswered = await this.crudService.findOne(quiz_survey_question,{where: {quiz_survey_question_id:quiz_survey_question_id}});
            if(questionAnswered instanceof Error){
                throw internal(questionAnswered.message)
            }
            if(!questionAnswered){
                throw badData("Invalid Quiz question id")
            }
    
    
            const quizRes = await this.crudService.findOne(quiz_survey_response,{where: {quiz_survey_id:quiz_survey_id,user_id:user_id}});
            if(quizRes instanceof Error){
                throw internal(quizRes.message)
            }          
            // console.log(quizRes);
            let dataToUpsert:any = {}
            dataToUpsert = {quiz_survey_id:quiz_survey_id,user_id:user_id,updated_by:user_id}
    
            let responseObjToAdd:any = {}
            responseObjToAdd = {
                quiz_survey_id:quiz_survey_id,
                selected_option:selected_option,
                question:questionAnswered.dataValues.question,
                // correct_answer:questionAnswered.dataValues.correct_ans,//there is no correct_ans collumn
                // level:questionAnswered.dataValues.level,//there are no level collumn
                question_no:questionAnswered.dataValues.question_no,
                // is_correct:selected_option==questionAnswered.correct_ans//there is no correct_ans collumn
            }
            
            let user_response:any = {}
            if(quizRes){
                // console.log(quizRes.dataValues.response);
                user_response = JSON.parse(quizRes.dataValues.response);
                user_response[questionAnswered.dataValues.question_no] = responseObjToAdd;

                dataToUpsert["response"]=JSON.stringify(user_response);
                
                const resultModel =  await this.crudService.update(quizRes,dataToUpsert,{where:{quiz_survey_id:quiz_survey_id,user_id:user_id}})
                if(resultModel instanceof Error){
                    throw internal(resultModel.message)
                }
                let result:any = {}
                result = resultModel.dataValues
                // result["is_correct"] = responseObjToAdd.is_correct;
                // if(responseObjToAdd.is_correct){
                //     result["msg"] = questionAnswered.dataValues.msg_ans_correct;
                // }else{
                //     result["msg"] = questionAnswered.dataValues.msg_ans_wrong;
                // }
                // result["redirect_to"] = questionAnswered.dataValues.redirect_to;
                return result;
            }else{
                
                user_response[questionAnswered.dataValues.question_no]=responseObjToAdd;

                dataToUpsert["response"]=JSON.stringify(user_response);
                dataToUpsert = {...dataToUpsert,created_by:user_id}

                const resultModel =  await this.crudService.create(quiz_survey_response,dataToUpsert)
                if(resultModel instanceof Error){
                    throw internal(resultModel.message)
                }
                let result:any = {}
                result = resultModel.dataValues
                // result["is_correct"] = responseObjToAdd.is_correct;
                // if(responseObjToAdd.is_correct){
                //     result["msg"] = questionAnswered.dataValues.msg_ans_correct;
                // }else{
                //     result["msg"] = questionAnswered.dataValues.msg_ans_wrong;
                // }
                // result["redirect_to"] = questionAnswered.dataValues.redirect_to;
                return result;
            }

        }catch(err){
            return err;
        }
        
    }

    protected async submitResponses(req:Request,res:Response,next:NextFunction) {
        try{
            
            const  quiz_survey_id  = req.params.id;
            const {responses} = req.body;
            const user_id =  res.locals.user_id;
            if(!quiz_survey_id){
                throw badRequest(speeches.QUIZ_ID_REQUIRED);
            }
            if(!responses){
                throw badRequest(speeches.QUIZ_QUESTION_ID_REQUIRED);
            }

            if(!user_id){
                throw unauthorized(speeches.UNAUTHORIZED_ACCESS);
            }
            const results:any = []
            let result:any={}
            for(const element of responses){
                // console.log(element);
                result =   await this.insertSingleResponse(user_id,quiz_survey_id,element.quiz_survey_question_id,element.selected_option)    
                if(!result|| result instanceof Error){
                    throw badRequest();
                }else{
                    results.push(result);
                }
            }
            // await Promise.all(
            //     responses.map( async (element:any) => {
            //         // console.log(element)
            //         result =   await this.insertSingleResponse(user_id,quiz_survey_id,element.quiz_survey_question_id,element.selected_option)    
            //         if(!result|| result instanceof Error){
            //           throw badRequest();
            //         }else{
            //           results.push(result);
            //         }
            //       }
            //     )
            // );
            res.status(200).send(dispatcher(res,result))

        }catch(err){
            next(err)
        }
    }
} 
