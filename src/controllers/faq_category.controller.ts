import { NextFunction, Request, Response } from "express";
import { Op } from "sequelize";
import { constents } from "../configs/constents.config";
import { speeches } from "../configs/speeches.config";
import { faq } from "../models/faq.model";
import dispatcher from "../utils/dispatch.util";
import { faqCategorySchema, faqCategorySchemaUpdateSchema } from "../validations/faq_category.validations";
import ValidationsHolder from "../validations/validationHolder";
import BaseController from "./base.controller";
import db from "../utils/dbconnection.util"

export default class FaqCategoryController extends BaseController {

    model = "faq_category";

    protected initializePath(): void {
        this.path = '/faqCategories';
    }
    protected initializeValidations(): void {
        this.validations = new ValidationsHolder(faqCategorySchema, faqCategorySchemaUpdateSchema);
    }
    protected initializeRoutes(): void {
        //example route to add 
        //this.router.get(`${this.path}/`, this.getData);
        super.initializeRoutes();
    }

    protected getData(req: Request, res: Response, next: NextFunction) {
        let objWhereClauseStatusPart = this.getWhereClauseStatsPart(req);
        // console.log(objWhereClauseStatusPart)
        return super.getData(req, res, next, [],
            [
                'category_name',
                'faq_category_id',
                // 'status',
                // 'created_at',
                // 'created_by',
                // 'updated_at',
                // 'updated_by',
                [
                    db.literal(`( SELECT COUNT(*) FROM faqs AS s WHERE
                    ${objWhereClauseStatusPart.addWhereClauseStatusPart ? "s." + objWhereClauseStatusPart.whereClauseStatusPartLiteral : objWhereClauseStatusPart.whereClauseStatusPartLiteral}
                    AND s.faq_category_id = \`faq_category\`.\`faq_category_id\`)`), 'faq_count'
                ]
            ], { model: faq, required: false }
        )
    }

    //old deprecated commented out code .. remove it after stablity of above replaced function is accepted..!!
    // protected async getData(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    //     try {
    //         let data: any;
    //         const { model, id } = req.params;
    //         const paramStatus: any = req.query.status;
    //         if (model) {
    //             this.model = model;
    //         };
    //         // pagination
    //         const { page, size, title } = req.query;
    //         let condition = title ? { title: { [Op.like]: `%${title}%` } } : null;
    //         const { limit, offset } = this.getPagination(page, size);
    //         const modelClass = await this.loadModel(model).catch(error => {
    //             next(error)
    //         });
    //         const where: any = {};
    //         let whereClauseStatusPart: any = {};
    //         // if(paramStatus && (paramStatus in constents.common_status_flags.list)){
    //         //     whereClauseStatusPart = {"status":paramStatus}
    //         // }
    //         let whereClauseStatusPartLiteral = "1=1";
    //         let addWhereClauseStatusPart = false
    //         if (paramStatus && (paramStatus in constents.common_status_flags.list)) {
    //             if (paramStatus === 'ALL') {
    //                 whereClauseStatusPart = {};
    //                 addWhereClauseStatusPart = false;
    //             } else {
    //                 whereClauseStatusPart = { "status": paramStatus };
    //                 addWhereClauseStatusPart = true;
    //             }
    //         } else {
    //             whereClauseStatusPart = { "status": "ACTIVE" };
    //             addWhereClauseStatusPart = true;
    //         }
    //         if (id) {
    //             where[`${this.model}_id`] = req.params.id;
    //             data = await this.crudService.findOne(modelClass, {
    //                 where: {
    //                     [Op.and]: [
    //                         whereClauseStatusPart,
    //                         where
    //                     ]
    //                 },
    //                 include: { model: faq, required: false }
    //             });
    //         } else {
    //             try {
    //                 const responseOfFindAndCountAll = await this.crudService.findAndCountAll(modelClass, {
    //                     attributes: [
    //                         'category_name',
    //                         'faq_category_id',
    //                         'status',
    //                         'created_at',
    //                         'created_by',
    //                         'updated_at',
    //                         'updated_by',
    //                         [
    //                             db.literal(`( SELECT COUNT(*) FROM faqs AS s WHERE
    //                             ${addWhereClauseStatusPart ? "s." + whereClauseStatusPartLiteral : whereClauseStatusPartLiteral}
    //                             AND s.faq_category_id = \`faq_category\`.\`faq_category_id\`)`), 'faq_count'
    //                         ]
    //                     ],
    //                     where: {
    //                         [Op.and]: [
    //                             whereClauseStatusPart,
    //                             condition
    //                         ]
    //                     },
    //                     // include: {
    //                     //     model: faq,
    //                     //     required: false
    //                     // },
    //                     limit,
    //                     offset
    //                 })
    //                 const result = this.getPagingData(responseOfFindAndCountAll, page, limit);
    //                 data = result;
    //             } catch (error: any) {
    //                 return res.status(500).send(dispatcher(res,data, 'error'))
    //             }
    //         }
    //         // if (!data) {
    //         //     return res.status(404).send(dispatcher(res,data, 'error'));
    //         // }
    //         if (!data || data instanceof Error) {
    //             res.status(200).send(dispatcher(res,null, "error", speeches.DATA_NOT_FOUND));
    //             // if(data!=null){
    //             //     throw notFound(data.message)
    //             // }else{
    //             //     throw notFound()
    //             // }
    //         }
    //         return res.status(200).send(dispatcher(res,data, 'success'));
    //     } catch (error) {
    //         next(error);
    //     }
    // }
}