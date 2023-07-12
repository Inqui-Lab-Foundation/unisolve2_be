import {Association, CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model} from 'sequelize';
import { constents } from '../configs/constents.config';
import db from '../utils/dbconnection.util';


export class mentor_course extends Model<InferAttributes<mentor_course>,InferCreationAttributes<mentor_course>> {
    declare mentor_course_id: CreationOptional<number>;
    declare title: string;
    declare description: string;
    declare status: Enumerator;
    declare thumbnail: string;
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

    }
}


mentor_course.init(
    {
        mentor_course_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type:  DataTypes.TEXT('long'),
            allowNull: true
        },
        thumbnail: {
            type: DataTypes.STRING,
            defaultValue:constents.default_image_path
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
        tableName: 'mentor_courses',
        timestamps: true,
        updatedAt: 'updated_at',
        createdAt: 'created_at',
    }
);
//course.associate(course_module);