import { CreationOptional, DataTypes, ForeignKey, InferAttributes, InferCreationAttributes, Model } from 'sequelize';
import { constents } from '../configs/constents.config';
import db from '../utils/dbconnection.util';
import { user } from './user.model';

export class quiz_survey_response extends Model<InferAttributes<quiz_survey_response>, InferCreationAttributes<quiz_survey_response>> {
    declare quiz_response_id: CreationOptional<number>;
    declare quiz_survey_id: ForeignKey<number>;
    declare user_id: ForeignKey<number>;
    declare response: string;
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
    // static associate(models: any) {
    //     // define association here
    //     notification.belongsTo(user, { foreignKey: 'created_by', as: 'user' });
    // }
}

quiz_survey_response.init(
    {
        quiz_response_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        quiz_survey_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        response: {
            type: DataTypes.TEXT('long'),
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
        tableName: 'quiz_survey_responses',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
);

quiz_survey_response.belongsTo(user, { foreignKey: 'user_id', constraints: false, scope: { role: 'MENTOR' } });
user.hasOne(quiz_survey_response, { foreignKey: 'user_id', constraints: false });