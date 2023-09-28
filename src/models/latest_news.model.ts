import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from 'sequelize';
import db from '../utils/dbconnection.util';
import { constents } from '../configs/constents.config';

export class latest_news extends Model<InferAttributes<latest_news>, InferCreationAttributes<latest_news>> {
    
    declare latest_news_id: CreationOptional<number>;
    declare details: string;
    declare category: string;
    declare url: string;
    declare file_name: string;
    declare status: Enumerator;
    declare new_status: Enumerator;
    declare created_by: number;
    declare created_at: Date;
    declare updated_by: number;
    declare updated_at: Date;
    
    static modelTableName = "latest_news";
    static structure:any =  {
        latest_news_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        details: {
            type: DataTypes.TEXT('long'),
            allowNull: false
        },
        category: {
            type: DataTypes.STRING,
            allowNull: false
        },
        url: {
            type: DataTypes.TEXT('long'),
            allowNull: true
        },
        file_name: {
            type: DataTypes.TEXT('long'),
            allowNull: true
        },
        status: {
            type: DataTypes.ENUM(...Object.values(constents.common_status_flags.list)),
            defaultValue: constents.common_status_flags.default
        },
        new_status :{
            type: DataTypes.ENUM(...Object.values(constents.evaluation_status.list)),
            allowNull: true
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

latest_news.init(
    latest_news.structure,
    {
        sequelize: db,
        tableName: latest_news.modelTableName,
        timestamps: true,
        updatedAt: 'updated_at',
        createdAt: 'created_at',
    }
);