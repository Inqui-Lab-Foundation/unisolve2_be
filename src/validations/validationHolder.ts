import Joi from "joi";

export default class ValidationsHolder {
    create: Joi.Schema | null | undefined;
    update: Joi.Schema | null | undefined;

    constructor(create: any | null | undefined, update: any | null | undefined) {
        this.create = create;
        this.update = update;
    }
}