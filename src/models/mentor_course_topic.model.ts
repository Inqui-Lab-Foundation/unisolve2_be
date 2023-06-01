import {CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model} from 'sequelize';
import { constents } from '../configs/constents.config';
import db from '../utils/dbconnection.util';
import { course_module } from './course_module.model';
import {mentor_course} from "../models/mentor_course.model";

export class mentor_course_topic extends Model<InferAttributes<mentor_course_topic>,InferCreationAttributes<mentor_course_topic>> {

    declare mentor_course_topic_id: CreationOptional<number>;
    declare mentor_course_id: number;
    declare topic_type_id: number;
    declare topic_type: Enumerator;
    declare title: string;
    declare status: Enumerator;
    declare created_by: number;
    declare created_at: Date;
    declare updated_by: number;
    declare updated_at: Date;
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models: any) {
        // define association here
        // course_topic.belongsTo(course_module, { foreignKey: 'course_module_id', as: 'course_topics' });
    }
}


mentor_course_topic.init(
    {
        mentor_course_topic_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        mentor_course_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        topic_type_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: null
        },
        topic_type: {
            type: DataTypes.ENUM(...Object.values(constents.topic_type_flags.list)),
            allowNull: false,
            defaultValue: constents.topic_type_flags.default
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        status: {
            type: DataTypes.ENUM(...Object.values(constents.common_status_flags.list)),
            allowNull: false,
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
        tableName: 'mentor_course_topics',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
);

mentor_course_topic.belongsTo(course_module, { foreignKey: 'mentor_course_id', as: 'mentor_course_topic' });
mentor_course.hasMany(mentor_course_topic, { foreignKey: 'mentor_course_id' });