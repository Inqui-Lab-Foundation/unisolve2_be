import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from 'sequelize';
import db from '../utils/dbconnection.util';
import { constents } from '../configs/constents.config';

export class evaluation_process extends Model<InferAttributes<evaluation_process>, InferCreationAttributes<evaluation_process>> {
    declare evaluation_process_id: CreationOptional<number>;
    declare level_name: string;
    declare no_of_evaluation: number;
    declare eval_schema: Enumerator;
    declare district: string;
    declare status: Enumerator;
    declare created_by: number;
    declare created_at: Date;
    declare updated_by: number;
    declare updated_at: Date;

    static modelTableName = "evaluation_process";
    static structure: any = {
        evaluation_process_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        level_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        no_of_evaluation: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        eval_schema: {
            type: DataTypes.ENUM(...Object.values(constents.evaluation_process_status_flags.list)),
            defaultValue: constents.evaluation_process_status_flags.default
        },
        district: {
            type: DataTypes.TEXT('long'),
            allowNull: false
        },
        status: {
            type: DataTypes.ENUM(...Object.values(constents.common_status_flags.list)),
            defaultValue: constents.common_status_flags.list.INACTIVE
        },
        created_by: {
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: null
        },
        created_at: {
            type: DataTypes.DATE,
            allowNull: true,
            defaultValue: DataTypes.NOW,
        },
        updated_by: {
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: null
        },
        updated_at: {
            type: DataTypes.DATE,
            allowNull: true,
            defaultValue: DataTypes.NOW,
            onUpdate: new Date().toLocaleString()
        }
    };
}

evaluation_process.init(
    evaluation_process.structure,
    {
        sequelize: db,
        tableName: evaluation_process.modelTableName,
        timestamps: true,
        updatedAt: 'updated_at',
        createdAt: 'created_at',
    }
);