import { DataTypes, Model } from 'sequelize';
import db from '../utils/dbconnection.util';
import { course } from './course.model';
import { courseModuleAttributes } from '../interfaces/model.interface';
import { constents } from '../configs/constents.config';



export class course_module extends Model<courseModuleAttributes> {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    // static associate(models: any) {
    //     // define association here
    //     course_module.belongsTo(models.courses, { foreignKey: 'course_id',targetKey: 'course_id' });
    // }
}

const courseModuleSequelize = course_module.init(
    {
        course_module_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        course_id: {
            type: DataTypes.INTEGER,
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type:  DataTypes.TEXT('long'),
            allowNull: true
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
        tableName: 'course_modules',
        timestamps: true,
        updatedAt: 'updated_at',
        createdAt: 'created_at',
    }
);

course_module.belongsTo(course, { foreignKey: 'course_id'});
course.hasMany(course_module, { foreignKey: 'course_id'});
