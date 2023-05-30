import { worksheetSchema, worksheetUpdateSchema } from "../validations/worksheet.validations";
import ValidationsHolder from "../validations/validationHolder";
import BaseController from "./base.controller";
import { NextFunction, Request, Response } from "express";
import { badRequest, internal, notFound, unauthorized } from "boom";
import { S3 } from "aws-sdk";
import { speeches } from "../configs/speeches.config";
import path from "path";
import fs from 'fs';
import db from "../utils/dbconnection.util"
import dispatcher from "../utils/dispatch.util";
import { user_topic_progress } from "../models/user_topic_progress.model";
import { course_topic } from "../models/course_topic.model";
import { constents } from "../configs/constents.config";
import { Op } from "sequelize";
import { worksheet_response } from "../models/worksheet_response.model";
export default class WorksheetController extends BaseController {

    model = "worksheet";

    protected initializePath(): void {
        this.path = '/worksheets';
    }
    protected initializeValidations(): void {
        this.validations =  new ValidationsHolder(worksheetSchema,worksheetUpdateSchema);
    }
    protected initializeRoutes(): void {
        //example route to add 
        this.router.post(this.path+"/:id/response", this.submitResponse.bind(this));

        super.initializeRoutes();
    }

    protected async getData(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            let data: any;
            const { model, id} = req.params;
            const paramStatus:any = req.query.status;
            if (model) {
                this.model = model;
            };
            
            let user_id = res.locals.user_id;
            if (!user_id) {
                throw unauthorized(speeches.UNAUTHORIZED_ACCESS)
            }
            
            // pagination
            const { page, size, title } = req.query;
            let condition = title ? { title: { [Op.like]: `%${title}%` } } : null;
            const { limit, offset } = this.getPagination(page, size);
            const modelClass = await this.loadModel(model).catch(error=>{
                next(error)
            });
            const where: any = {};
            let whereClauseStatusPart: any = {}
            let boolStatusWhereClauseRequired = false;
            if (paramStatus && (paramStatus in constents.common_status_flags.list)) {
                if (paramStatus === 'ALL') {
                    whereClauseStatusPart = {};
                    boolStatusWhereClauseRequired = false;
                } else {
                    whereClauseStatusPart = { "status": paramStatus };
                    boolStatusWhereClauseRequired = true;
                }
            } else {
                whereClauseStatusPart = { "status": "ACTIVE" };
                boolStatusWhereClauseRequired = true;
            }
            if (id) {
                where[`${this.model}_id`] = req.params.id;
                data = await this.crudService.findOne(modelClass, { 
                    where: {
                        [Op.and]: [
                            whereClauseStatusPart,
                            where,
                        ]
                    },
                    attributes:[
                        "worksheet_id",
                        "attachments",
                        "status",
                        "description",
                        "updated_at",
                        [   
                            // Note the wrapping parentheses in the call below!
                            db.literal(`(
                                SELECT CASE WHEN EXISTS 
                                    (SELECT attachments 
                                    FROM worksheet_responses as wr 
                                    WHERE wr.user_id = ${user_id} 
                                    AND wr.worksheet_id = \`worksheet\`.\`worksheet_id\`)
                                THEN  
                                    (SELECT attachments 
                                    FROM worksheet_responses as wr 
                                    WHERE wr.user_id = ${user_id} 
                                    AND wr.worksheet_id = \`worksheet\`.\`worksheet_id\`
                                    ORDER BY wr.updated_at DESC
                                    LIMIT 1)
                                ELSE 
                                    NULL
                                END as response
                            )`),
                            'response'
                        ],
                    ]
                 });
            } else {
                try{
                    const responseOfFindAndCountAll = await this.crudService.findAndCountAll(modelClass, { 
                        where: {
                            [Op.and]: [
                                whereClauseStatusPart,
                                condition
                            ]
                        },
                        attributes:[
                            "worksheet_id",
                            "attachments",
                            "status",
                            "description",
                            "updated_at",
                            [   
                                // Note the wrapping parentheses in the call below!
                                db.literal(`(
                                    SELECT CASE WHEN EXISTS 
                                        (SELECT attachments 
                                        FROM worksheet_responses as wr 
                                        WHERE wr.user_id = ${user_id} 
                                        AND wr.worksheet_id = \`worksheet\`.\`worksheet_id\`) 
                                    THEN  
                                        (SELECT attachments 
                                        FROM worksheet_responses as wr 
                                        WHERE wr.user_id = ${user_id} 
                                        AND wr.worksheet_id = \`worksheet\`.\`worksheet_id\` 
                                        ORDER BY wr.updated_at DESC
                                        LIMIT 1)
                                    ELSE 
                                        NULL
                                    END as response
                                )`),
                                'response'
                            ],
                        ],
                        limit,
                        offset })
                    const result = this.getPagingData(responseOfFindAndCountAll, page, limit);
                    data = result;
                } catch(error:any){
                    return res.status(500).send(dispatcher(res,data, 'error'))
                }
                
            }
            // if (!data) {
            //     return res.status(404).send(dispatcher(res,data, 'error'));
            // }
            if (!data || data instanceof Error) {
                if(data!=null){
                    throw notFound(data.message)
                }else{
                    throw notFound()
                }
            }

            return res.status(200).send(dispatcher(res,data, 'success'));
        } catch (error) {
            next(error);
        }
    }

    protected async submitResponse(req:Request,res:Response,next:NextFunction){
        try{
            const worksheet_id =  req.params.id;
            if(!worksheet_id){
                throw badRequest(speeches.WORKSHEET_ID_REQUIRED);
            }
            const user_id =  res.locals.user_id;
            if(!user_id){
                throw unauthorized(speeches.UNAUTHORIZED_ACCESS);
            }

            //check if the given worksheet is a valid topic
            const curr_workshet_topic =  await this.crudService.findOne(course_topic,{where:{"topic_type_id":worksheet_id,"topic_type":"WORKSHEET"}})
            if(!curr_workshet_topic || curr_workshet_topic instanceof Error){
                throw badRequest("INVALID TOPIC");
            }
            let s3 = new S3({
                apiVersion: '2006-03-01',
                region: process.env.AWS_REGION,
                accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
            });
            //copy attached file in assets/worksheets/responses and add its path in attachment variable
            const rawfiles: any = req.files;
            const files: any = Object.values(rawfiles);
            const file_key: any = Object.keys(rawfiles);
            const reqData: any = req.body;
            const errs: any = [];
            let result: any = {};
            let attachments: any = [];
            let file_name_prefix: any;
            if (process.env.NODE_ENV == "prod") {
                file_name_prefix = `mldv_worksheets`
            } else {
                file_name_prefix = `mldv_worksheets/stage`
            }
            for (const file_name of Object.keys(files)) {
                const file = files[file_name];
                let filename = file.path.split(path.sep).pop();
                // filename = ""+Date.now()+"_"+filename
                filename = "user_id_" + user_id + "_worksheet_id_" + worksheet_id
                const readFile: any = await fs.readFileSync(file.path);
                if (readFile instanceof Error) {
                    errs.push(`Error uploading file: ${file.originalFilename} err: ${readFile}`)
                }
                file.originalFilename = `${file_name_prefix}/${filename}/${file.originalFilename}`;
                let params = {
                    Bucket: 'unisole-assets',
                    Key: file.originalFilename,
                    Body: readFile
                };
                let options: any = { partSize: 20 * 1024 * 1024, queueSize: 2 };
                await s3.upload(params).promise()
                    .then((data: any) => { attachments.push(data.Location) })
                    .catch((err: any) => { errs.push(`Error uploading file: ${file.originalFilename}, err: ${err.message}`) })
                result['attachments'] = attachments;
                result['errors'] = errs;
            }
            // res.status(200).send(dispatcher(res, result));
            // const targetPath = path.join(process.cwd(), 'resources', 'static', 'uploads', 'worksheets', 'responses', filename);
            // const copyResult: any = await fs.promises.copyFile(file.path, targetPath).catch(err => {
            //     errs.push(`Error uploading file: ${file.originalFilename}`);
            // })
            // if (copyResult instanceof Error) {
            //     errs.push(`Error uploading file: ${file.originalFilename}`);
            //     // console.log(copyResult)
            //     // throw internal(`Error uploading file: ${file.originalFilename}`) 
            //     // next(internal(`Error uploading file: ${file.originalFilename}`))  
            // } else {

            //     reqData[file.fieldName] = `/assets/worksheets/responses/${filename}`;
            //     attachments = attachments + `/assets/worksheets/responses/${filename},`
            //     // console.log(attachments)
            // }
            // }
            // if (errs.length) {
            //     return res.status(406).send(dispatcher(res, errs, 'error', speeches.NOT_ACCEPTABLE, 406));
            // }
            const modelLoaded = await this.loadModel("worksheet_response");
            //create an entry in worksheet submission table
            let dataToBeUploaded:any = {};
            dataToBeUploaded["worksheet_id"]= worksheet_id
            dataToBeUploaded["user_id"] = user_id
            dataToBeUploaded["attachments"] = attachments.toString()
            const payload = this.autoFillTrackingColumns(req, res, modelLoaded, dataToBeUploaded)
            const data = await this.crudService.create(modelLoaded, payload);

            //update worksheet topic progress for this user to completed..!!
            const updateProgress =  await this.crudService.create(user_topic_progress,{"user_id":user_id,"course_topic_id":curr_workshet_topic.course_topic_id,"status":"COMPLETED"})
            res.status(200).send(dispatcher(res,data,"success"));
            

        }catch(err){
            next(err)
        }
    }
} 
