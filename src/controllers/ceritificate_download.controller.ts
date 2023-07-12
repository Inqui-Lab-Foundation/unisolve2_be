import Boom, { badRequest, notFound } from "boom";
import { NextFunction, Request, Response } from "express";
import { Op } from "sequelize";
import { speeches } from "../configs/speeches.config";
import { certificate_download } from "../models/certificate_download.model";
import db from "../utils/dbconnection.util";
import dispatcher from "../utils/dispatch.util";
import { certificateCreateSchema, certificateUpdateSchema } from "../validations/cerificate_download.validations";
import ValidationsHolder from "../validations/validationHolder";
import BaseController from "./base.controller";
export default class CertificateDownloadController extends BaseController {

    model = 'certificate_download';

    protected initializePath(): void {
        this.path = '/certificate';
    }
    protected initializeValidations(): void {
        this.validations = new ValidationsHolder(certificateCreateSchema, certificateUpdateSchema);
    }
    protected initializeRoutes(): void {
        this.router.get(`${this.path}/mobileCheck`, this.mobileCheckBeforeDownloadingCertificate.bind(this))
        super.initializeRoutes();
    }
    private async mobileCheckBeforeDownloadingCertificate(req: Request, res: Response, next: NextFunction) {
        try {
            const mobile = req.query.mobile;
            const user_id = res.locals.user_id;
            if (!mobile) {
                throw badRequest(speeches.MOBILE_NUMBER_REQUIRED);
            }
            const gettingWithTheHelpOfMobileNumber = await this.crudService.findOne(certificate_download, {
                where: { mobile }
            });
            if (!gettingWithTheHelpOfMobileNumber) {
                throw notFound(speeches.DATA_NOT_FOUND)
            };
            if (gettingWithTheHelpOfMobileNumber instanceof Error) {
                throw gettingWithTheHelpOfMobileNumber;
            };
            return res.status(200).send(dispatcher(res, gettingWithTheHelpOfMobileNumber, 'verified'));
        } catch (error) {
            next(error)
        }
    };
}
