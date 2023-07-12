import { CreationOptional, DataTypes, ForeignKey, InferAttributes, InferCreationAttributes, Model } from 'sequelize';
import { constents } from '../configs/constents.config';
import db from '../utils/dbconnection.util';

export class challenge_response extends Model<InferAttributes<challenge_response>, InferCreationAttributes<challenge_response>> {
    declare challenge_response_id: CreationOptional<number>;
    declare challenge_id: ForeignKey<number>;
    declare team_id: ForeignKey<number>;
    declare others: String;
    declare sdg: String;
    declare response: string;
    declare initiated_by: String;
    declare submitted_at: String;
    declare evaluated_by: String;
    declare evaluated_at: Date;
    declare status: Enumerator;
    declare evaluation_status: Enumerator;
    declare rejected_reason: String;
    declare final_result: Enumerator;
    declare district: String;
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

challenge_response.init(
    {
        challenge_response_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        final_result: {
            type: DataTypes.ENUM(...Object.values(constents.final_result_flags.list)),
            defaultValue: constents.final_result_flags.default,
            allowNull: true,
        },
        district: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        challenge_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        others: {
            type: DataTypes.STRING,
            allowNull: true
        },
        sdg: {
            type: DataTypes.STRING,
            allowNull: true
        },
        team_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        response: {
            type: DataTypes.TEXT('long'),
            allowNull: false
        },
        initiated_by: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        submitted_at: {
            type: DataTypes.DATE(),
            allowNull: true
        },
        evaluated_by: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        evaluated_at: {
            type: DataTypes.DATE,
            allowNull: true
        },
        evaluation_status: {
            type: DataTypes.ENUM(...Object.values(constents.evaluation_status.list)),
            allowNull: true
        },
        rejected_reason: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        status: {
            type: DataTypes.ENUM(...Object.values(constents.challenges_flags.list)),
            allowNull: false,
            defaultValue: constents.challenges_flags.default
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
        tableName: 'challenge_responses',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
);