import { NextFunction, Request, Response } from "express";
import { Op } from "sequelize";
import { constents } from "../configs/constents.config";
import { speeches } from "../configs/speeches.config";
import { faq } from "../models/faq.model";
import dispatcher from "../utils/dispatch.util";
import { faqCategorySchema, faqCategorySchemaUpdateSchema } from "../validations/faq_category.validations";
import ValidationsHolder from "../validations/validationHolder";
import BaseController from "./base.controller";
import db from "../utils/dbconnection.util";
import { supportTicketsReplies, supportTicketsRepliesUpdateSchema } from "../validations/supportTicketReplies.validation";
import { badRequest } from "boom";


export default class SupportTicketRepliesController extends BaseController {
    model = "support_ticket_reply";
    protected initializePath(): void {
        this.path = "/supportTicketsReply";
    };
    protected initializeValidations(): void {
        this.validations = new ValidationsHolder(supportTicketsReplies, supportTicketsRepliesUpdateSchema);
    };
    protected initializeRoutes(): void {
        //example route to add
        super.initializeRoutes();
    };
};