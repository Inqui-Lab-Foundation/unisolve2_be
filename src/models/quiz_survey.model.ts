import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from 'sequelize';
import { constents } from '../configs/constents.config';
import db from '../utils/dbconnection.util';

export class quiz_survey extends Model<InferAttributes<quiz_survey>,InferCreationAttributes<quiz_survey>> {
    declare quiz_survey_id: CreationOptional<number>;
    declare no_of_questions: number;
    declare role: string;
    declare name: string;
    declare description: string;
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

quiz_survey.init(
    {
        quiz_survey_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        no_of_questions: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        role: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue:constents.user_role_flags.default
        },
        name: {
            type: DataTypes.STRING,
            allowNull: true
        },
        description: {
            type: DataTypes.STRING,
            allowNull: true
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
        tableName: 'quiz_surveys',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
);
