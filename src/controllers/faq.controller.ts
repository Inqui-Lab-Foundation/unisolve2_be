import { Request, Response, NextFunction } from "express";
import { constents } from "../configs/constents.config";
import { faqSchema,faqSchemaUpdateSchema } from "../validations/faq.validation";
import ValidationsHolder from "../validations/validationHolder";
import BaseController from "./base.controller";
import dispatcher from '../utils/dispatch.util';
import {faq} from '../models/faq.model';
import { translation } from "../models/translation.model";
import { badRequest } from 'boom';
import { speeches } from '../configs/speeches.config';

export default class FaqController extends BaseController {
    model = "faq";

    protected initializePath(): void {
        this.path = '/faqs';
    }
    protected initializeValidations(): void {
        this.validations =  new ValidationsHolder(faqSchema,faqSchemaUpdateSchema);
    }
    protected initializeRoutes(): void {
        //example route to add 
        // this.router.get(`${this.path}/`, this.getDataNew.bind(this));
        this.router.post(`${this.path}/addfaqandtranslation`, this.addfaq.bind(this));
        this.router.put(`${this.path}/editfaqandtranslation`, this.editfaq.bind(this));
        this.router.delete(`${this.path}/deletefaqandtranslation`, this.deletefaq.bind(this));
        this.router.get(`${this.path}/getbyCategoryid/:id`, this.getbyCategoryid.bind(this));
        super.initializeRoutes();
        
    }
    protected async getbyCategoryid(req: Request, res: Response, next: NextFunction) {  
        try{
            const id = req.params.id;
            if (!id) throw badRequest(speeches.FAQ_CATEGORY);

            const data = await this.crudService.findAll(faq,{
                where : {faq_category_id:id},
                order:[['faq_id','DESC']]
            });
            if (data instanceof Error) {
                throw data;
            }
            return res.status(200).send(dispatcher(res, data, 'success'));
        }catch (err) {
            next(err)
        } 
    }
   
    protected async addfaq(req: Request, res: Response, next: NextFunction) {  
        try{
            let result :any = {};
            if (!req.body.faq_category_id) throw badRequest(speeches.FAQ_CATEGORY);
            if (!req.body.question) throw badRequest(speeches.QUESTION_REQUIRED);
            if (!req.body.answer) throw badRequest(speeches.FAQ_ANSWER);

            const data = await this.crudService.create(faq,req.body);
            if (data instanceof Error) {
                throw data;
            }
            
            let blucktrandata = [
                {'table_name':'faq',
                'coloumn_name':'question',
                'index_no':data.dataValues.faq_id,
                'from_locale':'en',
                'to_locale':'tn',
                'key':req.body.question},
                {'table_name':'faq',
                'coloumn_name':'answer',
                'index_no':data.dataValues.faq_id,
                'from_locale':'en',
                'to_locale':'tn',
                'key':req.body.answer}
            ]

            const tranData = await this.crudService.bulkCreate(translation,blucktrandata);
            if (tranData instanceof Error) {
                throw tranData;
            }

            result['faqdata']=data;
            result['trandata']=tranData;
            return res.status(200).send(dispatcher(res, result, 'success'));
        }catch (err) {
            next(err)
        } 
    }
    protected async editfaq(req: Request, res: Response, next: NextFunction) {  
        try{
            let result :any = {};
            const faqId = req.query.faq_id;
            if (!faqId) throw badRequest(speeches.FAQ_ID);
            if (!req.body.faq_category_id) throw badRequest(speeches.FAQ_CATEGORY);
            if (!req.body.question) throw badRequest(speeches.QUESTION_REQUIRED);
            if (!req.body.answer) throw badRequest(speeches.FAQ_ANSWER);

            const data = await this.crudService.update(faq,req.body,{where:{faq_id:faqId}});
            if (data instanceof Error) {
                throw data;
            }
            const updateQuestion = {'key':req.body.question};
            const updateAnswer = {'key':req.body.answer};

            const QuestionWhere = {where:{table_name:'faq',coloumn_name:'question',index_no:faqId}};
            const AnswerWhere = {where:{table_name:'faq',coloumn_name:'answer',index_no:faqId}};

            const updatetranQst = await this.crudService.update(translation,updateQuestion,QuestionWhere);
            if (updatetranQst instanceof Error) {
                throw updatetranQst;
            }
            const updatetranANS = await this.crudService.update(translation,updateAnswer,AnswerWhere);
            if (updatetranQst instanceof Error) {
                throw updatetranQst;
            }

            result['faqdata']=data;
            result['updatetranQst']=updatetranQst;
            result['updatetranANS']=updatetranANS;
            return res.status(200).send(dispatcher(res, result, 'success'));
        }catch (err) {
            next(err)
        } 
    }
    protected async deletefaq(req: Request, res: Response, next: NextFunction) {  
        try{
            let result :any = {};
            const faqId = req.query.faq_id;
            if (!faqId) throw badRequest(speeches.FAQ_ID);

            const data = await this.crudService.delete(faq,{where:{faq_id:faqId}});
            if (data instanceof Error) {
                throw data;
            }
            const QuestionWhere = {where:{table_name:'faq',coloumn_name:'question',index_no:faqId}};
            const AnswerWhere = {where:{table_name:'faq',coloumn_name:'answer',index_no:faqId}};

            const updatetranQst = await this.crudService.delete(translation,QuestionWhere);
            if (updatetranQst instanceof Error) {
                throw updatetranQst;
            }
            const updatetranANS = await this.crudService.delete(translation,AnswerWhere);
            if (updatetranQst instanceof Error) {
                throw updatetranQst;
            }

            result['faqdata']=data;
            result['updatetranQst']=updatetranQst;
            result['updatetranANS']=updatetranANS;
            return res.status(200).send(dispatcher(res, result, 'success'));
        }catch (err) {
            next(err)
        } 
    }

    protected getData(req: Request, res: Response, next: NextFunction) {
        return super.getData(req,res,next,[],
                    {exclude:constents.SEQUELIZE_FLAGS.DEFAULT_EXCLUDE_SCOPE})
    }
    
}