import { unauthorized } from "boom";
import { NextFunction, Request, Response } from "express";
import dispatcher from "../utils/dispatch.util";

import BaseController from "./base.controller";
import ValidationsHolder from "../validations/validationHolder";
import { courseSchema, courseUpdateSchema } from "../validations/course.validations";
import { course_module } from "../models/course_module.model";
import { course_topic } from "../models/course_topic.model";
import db from "../utils/dbconnection.util"
import { constents } from "../configs/constents.config";
import { speeches } from "../configs/speeches.config";
import { Op } from "sequelize";
import { mentor_course_topic } from "../models/mentor_course_topic.model";
import { mentorCourseSchema, mentorCourseUpdateSchema } from "../validations/mentorCourse.validations";
export default class MentorCourseController extends BaseController {
    model = "mentor_course";

    protected initializePath(): void {
        this.path = '/mentorCourses';
    }
    protected initializeValidations(): void {
        this.validations = new ValidationsHolder(mentorCourseSchema, mentorCourseUpdateSchema);
    }

    protected initializeRoutes(): void {
        //example route to add 
        //this.router.get(`${this.path}/`, this.getData);
        this.router.get(`${this.path}/test`, this.testRoute);
        super.initializeRoutes();

    }
    protected testRoute(req: Request, res: Response, next: NextFunction) {
        // console.log("came here");
        return res.status(200).json(dispatcher(res,"this was a success ....!!!"));
    }
    protected async getData(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        let user_id = res.locals.user_id;
        if (!user_id) {
            throw unauthorized(speeches.UNAUTHORIZED_ACCESS)
        }
        const { id } = req.params;
        const objWhereClauseStatusPart = this.getWhereClauseStatsPart(req);
        let includePart = null
        let orderBypart:any = []
        if(id){
            orderBypart = [
                // [{model: course_module, as: 'course_modules'},{model: course_topic, as: 'course_topics'},'topic_type_order', 'ASC'],
                // db.literal(`\`mentor_course_topics.topic_type_order\` ASC`),
                [mentor_course_topic,'mentor_course_topic_id', 'ASC'],
            ]
            //include only in the get one api not in get all api ...!!
            includePart = [{
                model: mentor_course_topic,
                required:false,
                attributes: [
                    "title",
                    "mentor_course_id",
                    "mentor_course_topic_id",
                    "topic_type_id",
                    "topic_type",
                    [
                        // Note the wrapping parentheses in the call below!
                        db.literal(`(
                            SELECT CASE WHEN EXISTS 
                                (SELECT status 
                                FROM mentor_topic_progress as p 
                                WHERE p.user_id = ${user_id} 
                                AND p.mentor_course_topic_id = \`mentor_course_topics\`.\`mentor_course_topic_id\`) 
                            THEN  
                                (SELECT case p.status when NULL then "INCOMPLETE" ELSE p.status END AS progress 
                                FROM mentor_topic_progress AS p
                                WHERE p.mentor_course_topic_id = \`mentor_course_topics\`.\`mentor_course_topic_id\`
                                AND p.user_id = ${user_id}
                                ORDER BY p.updated_at DESC
                                LIMIT 1)
                            ELSE 
                                '${constents.task_status_flags.default}'
                            END as progress
                        )`),
                        'progress'
                    ],
                    [
                        db.literal(`(
                            SELECT video_duration
                            FROM videos AS ct
                            WHERE
                            ct.video_id = \`mentor_course_topics\`.\`topic_type_id\`
                            AND
                            \`mentor_course_topics\`.\`topic_type\` = "VIDEO"
                        )`),
                        'video_duration'
                    ],
                    [
                        db.literal(`(
                            SELECT 
                            CASE
                                WHEN ct.topic_type = "VIDEO" THEN 1
                                WHEN ct.topic_type = "QUIZ" THEN 2
                                WHEN ct.topic_type = "WORKSHEET" THEN 3
                                WHEN ct.topic_type = "ATTACHMENT" THEN 4
                            END AS topic_type_order
                            FROM mentor_course_topics as ct
                            WHERE ct.mentor_course_topic_id = \`mentor_course_topics\`.\`mentor_course_topic_id\`
                        )`),
                        'topic_type_order'
                    ]
                ],
                where:{
                    [Op.and]:[
                        objWhereClauseStatusPart.whereClauseStatusPart
                    ]
                },
            }]
        }
        return super.getData(req,res,next,[],
            {
                include: [

                    [// Note the wrapping parentheses in the call below!
                        db.literal(`(
                        SELECT COUNT(*)
                        FROM mentor_course_topics AS ct
                        WHERE
                            ${objWhereClauseStatusPart.addWhereClauseStatusPart?"ct."+objWhereClauseStatusPart.whereClauseStatusPartLiteral:objWhereClauseStatusPart.whereClauseStatusPartLiteral}
                        AND
                            ct.mentor_course_id = \`mentor_course\`.\`mentor_course_id\`
                        AND
                            ct.topic_type = \"VIDEO\"
                    )`),
                        'course_videos_count'
                    ]
                ]
            },
            includePart,
            orderBypart
            )

    }
    
    // protected async getData(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    //     try {
            
    //         let data: any;
    //         const { model, id } = req.params;
    //         const paramStatus:any = req.query.status
    //         if (model) {
    //             this.model = model;
    //         };
    //         // pagination
    //         const { page, size, title } = req.query;
    //         let condition = title ? { title: { [Op.like]: `%${title}%` } } : null;
    //         const { limit, offset } = this.getPagination(page, size);
    //         const modelClass = await this.loadModel(this.model)
            
            
    //         const where: any = {}; 
    //         let whereClauseStatusPart: any = {};
    //         let whereClauseStatusPartLiteral = "1=1";
    //         let addWhereClauseStatusPart = false
    //         if (paramStatus && (paramStatus in constents.common_status_flags.list)) {
    //             if (paramStatus === 'ALL') {
    //                 whereClauseStatusPart = {};
    //                 addWhereClauseStatusPart = false;
    //             } else {
    //                 whereClauseStatusPart = { "status": paramStatus };
    //                 whereClauseStatusPartLiteral = `status = "${paramStatus}"`
    //                 addWhereClauseStatusPart = true;
    //             }
    //         } else {
    //             whereClauseStatusPart = { "status": "ACTIVE" };
    //             whereClauseStatusPartLiteral = `status = "ACTIVE"`
    //             addWhereClauseStatusPart = true;
    //         }
    //         if (id) {
    //             // where[`${this.model}_id`] = req.params.id;
    //             data = await this.getDetailsData(req, res, modelClass)
    //         } else {
                
    //             // where[`${this.model}_id`] = req.params.id;
    //             // data = await this.crudService.findAll(modelClass);
    //             data = await modelClass.findAll({
    //                 attributes: {
    //                     include: [

    //                         [// Note the wrapping parentheses in the call below!
    //                             db.literal(`(
    //                             SELECT COUNT(*)
    //                             FROM mentor_course_topics AS ct
    //                             WHERE
    //                                 ${addWhereClauseStatusPart?"ct."+whereClauseStatusPartLiteral:whereClauseStatusPartLiteral}
    //                             AND
    //                                 ct.mentor_course_id = \`mentor_course\`.\`mentor_course_id\`
    //                             AND
    //                                 ct.topic_type = \"VIDEO\"
    //                         )`),
    //                             'course_videos_count'
    //                         ]
    //                     ]
    //                 },
    //                 where:{
    //                     [Op.and]: [
    //                         whereClauseStatusPart,
    //                         condition,
    //                         ]
    //                 }
    //             });
    //             data.filter(function (rec: any) {
    //                 delete rec.dataValues.password;
    //                 return rec;
    //             });
    //         }
            
    //         if (!data) {
    //             return res.status(404).send(dispatcher(res,data, 'error'));
    //         }
    //         return res.status(200).send(dispatcher(res,data, 'success'));
    //     } catch (error) {
    //         next(error);
    //     }
    // }

    // async getDetailsData(req: Request, res: Response, modelClass: any) {
    //     let whereClause: any = {};

    //     whereClause[`${this.model}_id`] = req.params.id;
        
    //     const paramStatus:any = req.query.status;
    //     let whereClauseStatusPart:any = {};
    //     let whereClauseStatusPartLiteral = "1=1";
    //     let addWhereClauseStatusPart = false
    //     if(paramStatus && (paramStatus in constents.common_status_flags.list)){
    //         whereClauseStatusPart = {"status":paramStatus}
    //         whereClauseStatusPartLiteral = `status = "${paramStatus}"`
    //         addWhereClauseStatusPart =true;
    //     }

    //     let user_id = res.locals.user_id;
    //     if (!user_id) {
    //         throw unauthorized(speeches.UNAUTHORIZED_ACCESS)
    //     }
    //     let data = await this.crudService.findOne(modelClass, {
    //         where:whereClause,
             
    //         attributes: {
    //             include: [
                    
    //                 [// Note the wrapping parentheses in the call below!
    //                     db.literal(`(
    //                     SELECT COUNT(*)
    //                     FROM mentor_course_topics AS ct
    //                     WHERE
    //                         ${addWhereClauseStatusPart?"ct."+whereClauseStatusPartLiteral:whereClauseStatusPartLiteral}
    //                     AND
    //                         ct.mentor_course_id = \`mentor_course\`.\`mentor_course_id\`
    //                     AND
    //                         ct.topic_type = \"VIDEO\"
    //                 )`),
    //                     'course_videos_count'
    //                 ]
    //             ]
    //         },
    //         include: [{
    //             model: mentor_course_topic,
    //             required:false,
    //             attributes: [
    //                 "title",
    //                 "mentor_course_id",
    //                 "mentor_course_topic_id",
    //                 "topic_type_id",
    //                 "topic_type",
    //                 [
    //                     // Note the wrapping parentheses in the call below!
    //                     db.literal(`(
    //                         SELECT CASE WHEN EXISTS 
    //                             (SELECT status 
    //                             FROM mentor_topic_progress as p 
    //                             WHERE p.user_id = ${user_id} 
    //                             AND p.mentor_course_topic_id = \`mentor_course_topics\`.\`mentor_course_topic_id\`) 
    //                         THEN  
    //                             (SELECT case p.status when NULL then "INCOMPLETE" ELSE p.status END AS progress 
    //                             FROM mentor_topic_progress AS p
    //                             WHERE p.mentor_course_topic_id = \`mentor_course_topics\`.\`mentor_course_topic_id\`
    //                             AND p.user_id = ${user_id}
    //                             ORDER BY p.updated_at DESC
    //                             LIMIT 1)
    //                         ELSE 
    //                             '${constents.task_status_flags.default}'
    //                         END as progress
    //                     )`),
    //                     'progress'
    //                 ],
    //                 [
    //                     db.literal(`(
    //                         SELECT video_duration
    //                         FROM videos AS ct
    //                         WHERE
    //                         ct.video_id = \`mentor_course_topics\`.\`topic_type_id\`
    //                         AND
    //                         \`mentor_course_topics\`.\`topic_type\` = "VIDEO"
    //                     )`),
    //                     'video_duration'
    //                 ],
    //                 [
    //                     db.literal(`(
    //                         SELECT 
    //                         CASE
    //                             WHEN ct.topic_type = "VIDEO" THEN 1
    //                             WHEN ct.topic_type = "QUIZ" THEN 2
    //                             WHEN ct.topic_type = "WORKSHEET" THEN 3
    //                             WHEN ct.topic_type = "ATTACHMENT" THEN 4
    //                         END AS topic_type_order
    //                         FROM mentor_course_topics as ct
    //                         WHERE ct.mentor_course_topic_id = \`mentor_course_topics\`.\`mentor_course_topic_id\`
    //                     )`),
    //                     'topic_type_order'
    //                 ]
    //             ],
    //             where:{
    //                 [Op.and]:[
    //                     whereClauseStatusPart
    //                 ]
    //             },
    //         }],
    //         order: [
    //             // [{model: course_module, as: 'course_modules'},{model: course_topic, as: 'course_topics'},'topic_type_order', 'ASC'],
    //             // db.literal(`\`mentor_course_topics.topic_type_order\` ASC`),
    //             [mentor_course_topic,'mentor_course_topic_id', 'ASC'],
    //         ],
    //     });
    //     return data;
    // }

}