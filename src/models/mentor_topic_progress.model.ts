
import { CreationOptional, DataTypes, ForeignKey, InferAttributes, InferCreationAttributes, Model } from 'sequelize';
import db from '../utils/dbconnection.util';
import { course_topic } from './course_topic.model';
import { user } from './user.model';
import { constents } from '../configs/constents.config';
import { mentor_course_topic } from "../models/mentor_course_topic.model";
import { mentor } from './mentor.model';

export class mentor_topic_progress extends Model<InferAttributes<mentor_topic_progress>, InferCreationAttributes<mentor_topic_progress>> {
    declare mentor_topic_progress_id: CreationOptional<number>;
    declare user_id: ForeignKey<number>;
    declare mentor_course_topic_id: ForeignKey<number>;
    declare status: Enumerator;
    declare created_by: number;
    declare created_at: Date;
    declare updated_by: number;
    declare updated_at: Date;

    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The "models/index" file will call this method automatically.
     */
    static associate(models: any) {
        // define association here
        // course.hasMany(models, { foreignKey: "course_id", as: "courseModules" });
    }


}
mentor_topic_progress.init(
    {
        mentor_topic_progress_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        mentor_course_topic_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        status: {
            type: DataTypes.ENUM(...Object.values(constents.task_status_flags.list)),
            defaultValue: constents.task_status_flags.default
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
    },
    {
        sequelize: db,
        tableName: 'mentor_topic_progress',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
);

//TODO:call associate method is any association is defined
mentor_topic_progress.belongsTo(mentor_course_topic, { foreignKey: 'mentor_course_topic_id' })
mentor_course_topic.hasMany(mentor_topic_progress, { foreignKey: 'user_id', as: 'progress' })
mentor_topic_progress.belongsTo(user, { foreignKey: 'user_id' })
user.hasMany(mentor_topic_progress, { foreignKey: 'user_id' })
mentor_topic_progress.belongsTo(mentor, { targetKey: 'user_id', foreignKey: 'user_id' })
mentor.hasMany(mentor_topic_progress, { sourceKey: 'user_id', foreignKey: 'user_id' })
