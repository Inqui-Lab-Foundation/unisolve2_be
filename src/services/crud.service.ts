export default class CRUDService {
    /**
     * Help create entire  from the database
     * @param model String tables name
     * @param input object data to be inserted 
     * @returns object
     */
    async create(model: any, input: any) {
        try {
            const data = await model.create({ ...input });
            if (data) {
                delete data.dataValues.password;
            }
            return data;
        } catch (error: any) {
            return error;
        }
    };
    /**
     * Help create entire  from the database bulk
     * @param model String tables name
     * @param input  object data to be inserted 
     * @returns object
     */
    async bulkCreate(model: any, input: any) {
        try {
            const data = await model.bulkCreate(input);
            return data;
        } catch (error: any) {
            return error;
        }
    };
    /**
     *  Help finding entire  from the database
     * @param model String tables name
     * @param input  object data to be inserted 
     * @returns object
     */
    async findOne(model: any, query: object) {
        try {
            const data = await model.findOne(query);
            if (data) delete data.dataValues.password;
            if (data === null) return false;
            return data;
        } catch (error: any) {
            console.log(error)
            return error;
        }
    };
    /**
     *  Help finding entire from the database with password
     * @param model String tables name
     * @param input  object data to be inserted 
     * @returns object
     */
    async findOnePassword(model: any, query: object) {
        try {
            const data = await model.findOne(query);
            return data;
        } catch (error: any) {
            console.log(error)
            return error.message;
        }
    };
    /**
     *  Help finding all entires from the database
     * @param model String tables name
     * @param input  object data to be inserted 
     * @returns object
     */
    async findAll(model: any, query?: object) {
        try {
            const data = await model.findAll(query);
            data.filter(function (rec: any) {
                delete rec.dataValues.password;
                return rec;
            });
            return data;
        } catch (error: any) {
            return error;
        }
    };
    /**
     *  Help finding all entires and count from the database
     * @param model String tables name
     * @param input  object data to be inserted 
     * @returns object
     */
    async findAndCountAll(model: any, input: object) {
        try {
            const data = await model.findAndCountAll(input);
            if (data == null) return false;
            return data;
        } catch (error: any) {
            return error;
        }
    };
    /**
     *  Help finding by the primary key from database
     * @param model String tables name
     * @param input  object data to be inserted 
     * @returns object
     */
    async findByPk(model: any, input: string) {
        try {
            return await model.findByPk(input);
        } catch (error: any) {
            return error;
        }
    };
    /**
     *  Help finding by the where from the database
     * @param model String tables name
     * @param input  object data to be inserted 
     * @returns object
     */
    async findWhere(model: any, query: object, order: object = []) {
        try {
            return await model.findAll({ logging: console.log, where: query, order: order });
        } catch (error: any) {
            return error;
        }
    };
    /**
     *  Help finding the entries and update from the database
     * @param model String tables name
     * @param input  object data to be inserted 
     * @returns object
     */
    async updateAndFind(model: any, update: object, query: object) {
        try {
            await this.update(model, update, query);
            const data = await this.findOne(model, query);
            if (data) {
                delete data.dataValues.password;
                delete data.dataValues.created_at;
                delete data.dataValues.updated_at;
                delete data.dataValues.created_by;
                delete data.dataValues.updated_by;
            }
            if (data === null) return false;
            return data;
        } catch (error: any) {
            return error;
        }
    }
    /**
         *  Help updating entries and update from the database
         * @param model String tables name
         * @param input  object data to be inserted 
         * @returns object
         */
    async update(model: any, update: object, query: object) {
        try {
            const data = await model.update(update, query);
            return data;
        } catch (error: any) {
            return error;
        }
    };
    /**
         *  Help deleting entries and update from the database
         * @param model String tables name
         * @param input  object data to be inserted 
         * @returns object
         */
    async delete(model: any, query: object) {
        try {
            return await model.destroy(query);
        } catch (error: any) {
            return error;
        }
    };
}
