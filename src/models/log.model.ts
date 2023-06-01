import { DataTypes, Model } from 'sequelize';
import { constents } from '../configs/constents.config';
import ILogAttributes from '../interfaces/log.model.interface';
import db from '../utils/dbconnection.util';
import {  course_module } from './course_module.model';

export class log extends Model<ILogAttributes> {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models: any) {
        // define association here
        log.hasMany(course_module,{foreignKey: 'course_id', as: 'courseModules'});
    }
}


log.init(
    {
        log_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        log_type: {
            type: DataTypes.ENUM(...Object.values(constents.log_levels.list)),
            allowNull: false,
            defaultValue: constents.log_levels.default
        },
        date: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        },
        message: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: 'OK'
        },
        ip: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        method: {
            type: DataTypes.ENUM(...Object.values(constents.http_methods.list)),
            allowNull: true
        },
        route: {
            type: DataTypes.TEXT('long'),
            allowNull: false
        },
        status_code:{
            type: DataTypes.ENUM(...constents.status_codes.list),
            allowNull: false,
            defaultValue: constents.status_codes.default
        },
        token: {
            type: DataTypes.TEXT('long'),
            allowNull: true
        },
        headers: {
            type: DataTypes.TEXT('long'),
            allowNull: true
        },
        req_body: {
            type: DataTypes.TEXT('long'),
            allowNull: true
        },
        res_body: {
            type: DataTypes.TEXT('long'),
            allowNull: true
        },
        user_details: {
            type: DataTypes.TEXT('long'),
            allowNull: true
        },
        logged_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        }
    },
    {
        sequelize: db,
        tableName: 'logs',
        timestamps: true,
        createdAt: 'logged_at',
        updatedAt: false
    }
);
