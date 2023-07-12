import validationMiddleware from "../middlewares/validation.middleware";
import CRUDController from "./crud.controller";
import ValidationsHolder from "../validations/validationHolder";
import { NextFunction, Request, Response } from "express";
import dispatcher from "../utils/dispatch.util";
import path from "path";
import fs from 'fs';

export default class BaseController extends CRUDController {
    validations?: ValidationsHolder;

    protected init(): void {
        this.initializeValidations();
        super.init()
    }

    protected initializeValidations(): void {
        this.validations = new ValidationsHolder(null, null);
    }

    protected async loadModel (model: string): Promise<Response | void | any> {
        let modelToFetch = model;
        if(!modelToFetch){
            modelToFetch = this.model;
        }
        const modelClass = await import(`../models/${modelToFetch}.model`);
        return modelClass[modelToFetch];
    }

    protected initializeRoutes(aditionalrouts: any = null): void {
        this.router.get(`${this.path}`, this.getData.bind(this));
        this.router.get(`${this.path}/:id`, this.getData.bind(this));
        this.router.post(`${this.path}`, validationMiddleware(this.validations?.create), this.createData.bind(this));
        this.router.put(`${this.path}/:id`, validationMiddleware(this.validations?.update), this.updateData.bind(this));
        this.router.delete(`${this.path}/:id`, this.deleteData.bind(this));

        this.router.post(`${this.path}/withfile`,validationMiddleware(this.validations?.create), this.createDataWithFile.bind(this));
        this.router.put(`${this.path}/:id/withfile`, validationMiddleware(this.validations?.update),this.updateDataWithFile.bind(this));

        if (aditionalrouts) {
            this.router.use(aditionalrouts);
        }
    }

    protected async copyAllFiles(req:Request,arg_filename_prefix:any=null,...argUploadFilePathRelative:string[]){
        //copy attached file in assets/worksheets/responses and add its path in attachment variable
        let result:any =  {errors:[],attachments:""}
        if(!req.files){
            return result;
        }
        const rawfiles: any = req.files;
        const files: any = Object.values(rawfiles);
        const file_key: any = Object.keys(rawfiles);
        const reqData: any = req.body;
        const errs: any = [];
        let attachments = "";
        for (const file_name of Object.keys(files)) {
            const file = files[file_name];
            let filename = file.path.split(path.sep).pop();
            filename = ""+Date.now()+"_"+filename
            if(arg_filename_prefix!=null){
                filename = arg_filename_prefix+"_"+file.fieldName+"_"+filename
            }
            const targetResourcePath = path.join( ...argUploadFilePathRelative);
            const targetPath = path.join(process.cwd(), 'resources', 'static', 'uploads', targetResourcePath,filename);
            const copyResult:any = await fs.promises.copyFile(file.path, targetPath).catch(err=>{
                errs.push(`Error uploading file: ${file.originalFilename}`);
            })
            if(copyResult instanceof Error) {
                    errs.push(`Error uploading file: ${file.originalFilename}`);
                    // console.log(copyResult)
                    // throw internal(`Error uploading file: ${file.originalFilename}`) 
                    // next(internal(`Error uploading file: ${file.originalFilename}`))  
            } else {
                    
                reqData[file.fieldName] = `/assets/${targetResourcePath}/${filename}`;
                attachments  = attachments+`/assets/${targetResourcePath}/${filename},`
                // console.log(attachments)
            }
        }
        result.errors = errs;
        result.attachments = attachments

        return result;
    }

}