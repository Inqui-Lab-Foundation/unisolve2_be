import {  DataTypes, Model } from 'sequelize';
import { constents } from '../configs/constents.config';
import db from '../utils/dbconnection.util';
import { faq_category } from './faq_category.model';


export interface faqAttributes {
    faq_id: number;
    faq_category_id: number;
    question: string;
    answer: string;
    status: Enumerator;
    created_by: number;
    created_at: Date;
    updated_by: number;
    updated_at: Date;
}

export class faq extends Model<faqAttributes> { }

faq.init(
    {
        faq_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        faq_category_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        question: {
            type: DataTypes.TEXT("long"),
            allowNull: false
        },
        answer: {
            type: DataTypes.TEXT("long"),
            allowNull: false
        },
        status: {
            type: DataTypes.ENUM(...Object.values(constents.common_status_flags.list)),
            defaultValue: constents.common_status_flags.default
        },
        created_by: {
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue:null
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
    },
    {
        sequelize: db,
        tableName: 'faqs',
        timestamps: true,
        updatedAt: 'updated_at',
        createdAt: 'created_at',
    }
);

faq.belongsTo(faq_category, { foreignKey: 'faq_category_id'});
faq_category.hasMany(faq, { foreignKey: 'faq_category_id'});