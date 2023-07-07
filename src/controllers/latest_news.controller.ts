import { Op } from "sequelize";
import { latest_news } from "../models/latest_news.model";
import BaseController from "./base.controller";
import { Request, Response, NextFunction } from 'express';
import { notFound } from "boom";
import dispatcher from "../utils/dispatch.util";
import ValidationsHolder from "../validations/validationHolder";
import {latest_newsSchema, latest_newsUpdateSchema} from '../validations/latest_news.validation';
import { S3 } from "aws-sdk";
import fs from 'fs';

export default class LatestNewsController extends BaseController {

    model = "latest_news";

    protected initializePath(): void {
        this.path = '/latest_news';
    }
    protected initializeValidations(): void {
        this.validations =  new ValidationsHolder(latest_newsSchema,latest_newsUpdateSchema);
    }
    protected initializeRoutes(): void {
        this.router.get(`${this.path}/list`, this.getlist.bind(this));
        this.router.post(`${this.path}/latestnewsFileUpload`,this.handleAttachment.bind(this));
        super.initializeRoutes();
    }
    protected async getlist(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try{
            let data: any;
            const paramCategory: any  = req.query.category;
            const paramStatus: any = req.query.status;
            const whereClauseRolePart = { "category": paramCategory }
            data = await this.crudService.findAll(latest_news, {
                where: {
                    [Op.and]: [whereClauseRolePart]
                },
            });
            if (!data || data instanceof Error) {
                if (data != null) {
                    throw notFound(data.message)
                } else {
                    throw notFound()
                }
            }
            return res.status(200).send(dispatcher(res, data, 'success'));
        }
        catch(err){
            next(err)
        }
    }
    protected async handleAttachment(req: Request, res: Response, next: NextFunction) {
        try {
            const rawfiles: any = req.files;
            const files: any = Object.values(rawfiles);
            const errs: any = [];
            let attachments: any = [];
            let result: any = {};
            let s3 = new S3({
                apiVersion: '2006-03-01',
                region: process.env.AWS_REGION,
                accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
            });
            if (!req.files) {
                return result;
            }
            let file_name_prefix: any;
            if (process.env.DB_HOST?.includes("prod")) {
                file_name_prefix = `LatestNews`
            } else if(process.env.DB_HOST?.includes("dev")) {
                file_name_prefix = `LatestNews/dev`
            }
            else {
                file_name_prefix = `LatestNews/stage`
            }
            for (const file_name of Object.keys(files)) {
                const file = files[file_name];
                const readFile: any = await fs.readFileSync(file.path);
                if (readFile instanceof Error) {
                    errs.push(`Error uploading file: ${file.originalFilename} err: ${readFile}`)
                }
                file.originalFilename = `${file_name_prefix}/${file.originalFilename}`;
                let params = {
                    Bucket: `${process.env.BUCKET}`,
                    Key: file.originalFilename,
                    Body: readFile
                };
                let options: any = { partSize: 20 * 1024 * 1024, queueSize: 2 };
                await s3.upload(params, options).promise()
                    .then((data: any) => { attachments.push(data.Location) })
                    .catch((err: any) => { errs.push(`Error uploading file: ${file.originalFilename}, err: ${err.message}`) })
                result['attachments'] = attachments;
                result['errors'] = errs;
            }
            res.status(200).send(dispatcher(res, result));
        } catch (err) {
            next(err)
        }
    }
}