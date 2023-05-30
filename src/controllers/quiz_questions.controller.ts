import { expression } from "joi";
import { faqSchema,faqSchemaUpdateSchema } from "../validations/faq.validation";
import { quizQuestionSchema, quizQuestionSchemaUpdateSchema } from "../validations/quizQuestions.validations";
import ValidationsHolder from "../validations/validationHolder";
import BaseController from "./base.controller";
import {Request,Response,NextFunction} from "express";
import path from "path";
import fs from "fs";
import dispatcher from "../utils/dispatch.util";
import { speeches } from "../configs/speeches.config";
import { badRequest } from "boom";
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";


export default class QuizQuestionsController extends BaseController {

    model = "quiz_question";

    protected initializePath(): void {
        this.path = '/quizQuestions';
    }
    protected initializeValidations(): void {
        this.validations =  new ValidationsHolder(quizQuestionSchema,quizQuestionSchemaUpdateSchema);
    }
    protected initializeRoutes(): void {
        //example route to add 
        //this.router.get(`${this.path}/`, this.getData);
        super.initializeRoutes();
    }

    protected async createData(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        const {quiz_id,question_no,level} = req.body;
        const filenamePrefix = `quiz_${quiz_id}_q${question_no}_${level}`;
        await this.copyAllFiles(req,filenamePrefix,"images","quiz_imgs");
        return super.createData(req,res,next)
    }

    // protected async createDataWithFile(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    //     try {
    //         const { model } = req.params;
    //         if (model) {
    //             this.model = model;
    //         };
    //         const rawFiles: any = req.files;
    //         const files: any = Object.values(rawFiles);
    //         const reqData: any = req.body;
    //         const errs: any = [];
    //         for (const file_name of Object.keys(files)) {
    //             const file = files[file_name];
    //             const filename = file.path.split(path.sep).pop();
    //             const targetPath = path.join(process.cwd(), 'resources', 'static', 'uploads', 'images', "quiz_ing",filename);
    //             await fs.rename(file.path, targetPath, async (err) => {
    //                 if (err) {
    //                     errs.push(`Error uploading file: ${file.originalFilename}`);
    //                 } else {
    //                     reqData[file.fieldName] = `/posters/${filename}`;
    //                 }
    //             });
    //         }
    //         if (errs.length) {
    //             return res.status(406).send(dispatcher(res,errs, 'error', speeches.NOT_ACCEPTABLE, 406));
    //         }
    //         const modelLoaded = await this.loadModel(model);
    //         const payload = this.autoFillTrackingColumns(req, res, modelLoaded, reqData)
    //         const data = await this.crudService.create(modelLoaded, payload);

    //         // if (!data) {
    //         //     return res.status(404).send(dispatcher(res,data, 'error'));
    //         // }
    //         if (!data || data instanceof Error) {
    //             throw badRequest(data.message)
    //         }
    //         return res.status(201).send(dispatcher(res,data, 'created'));
    //     } catch (error) {
    //         next(error);
    //     }
    // }
}