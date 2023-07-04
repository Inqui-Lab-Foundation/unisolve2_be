import { Op } from "sequelize";
import { resource } from "../models/resource.model";
import BaseController from "./base.controller";
import { Request, Response, NextFunction } from 'express';
import { notFound } from "boom";
import dispatcher from "../utils/dispatch.util";
import ValidationsHolder from "../validations/validationHolder";
import {resourceSchema, resourceUpdateSchema} from '../validations/resource.validations';
import   {PutObjectCommand,
  S3Client
} from "@aws-sdk/client-s3";
import fs from 'fs';

export default class ResourceController extends BaseController {

    model = "resource";

    protected initializePath(): void {
        this.path = '/resource';
    }
    protected initializeValidations(): void {
        this.validations =  new ValidationsHolder(resourceSchema,resourceUpdateSchema);
    }
    protected initializeRoutes(): void {
        this.router.get(`${this.path}/list`, this.getMentorResources.bind(this));
        this.router.post(`${this.path}/resourceFileUpload`,this.handleAttachment.bind(this));
        super.initializeRoutes();
    }
    protected async getMentorResources(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try{
            let data: any;
            const paramRole: any  = req.query.role;
            const paramStatus: any = req.query.status;
            const whereClauseRolePart = { "role": paramRole }
            data = await this.crudService.findAll(resource, {
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
            let s3 = new S3Client({
                apiVersion: '2006-03-01',
                region: process.env.AWS_REGION,
                credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "" }
            });
            if (!req.files) {
                return result;
            }
            let file_name_prefix: any;
            if (process.env.DB_HOST?.includes("prod")) {
                file_name_prefix = `resources`
            } else {
                file_name_prefix = `resources/stage`
            }
            for (const file_name of Object.keys(files)) {
                const file = files[file_name];
                const readFile: any = await fs.readFileSync(file.path);
                if (readFile instanceof Error) {
                    errs.push(`Error uploading file: ${file.originalFilename} err: ${readFile}`)
                }
                file.originalFilename = `${file_name_prefix}/${file.originalFilename}`;
                let params = {
                    Bucket: 'unisole-assets',
                    Key: file.originalFilename,
                    Body: readFile
                };
                let options: any = { partSize: 20 * 1024 * 1024, queueSize: 2 };
                await s3.send(new PutObjectCommand(params), options)
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