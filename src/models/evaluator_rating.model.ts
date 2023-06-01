import { CreationOptional, DataTypes, ForeignKey, InferAttributes, InferCreationAttributes, Model } from 'sequelize';
import db from '../utils/dbconnection.util';
import { constents } from '../configs/constents.config';
import { challenge_response } from './challenge_response.model';
import { evaluator } from './evaluator.model';


export class evaluator_rating extends Model<InferAttributes<evaluator_rating>, InferCreationAttributes<evaluator_rating>> {
    declare evaluator_rating_id: CreationOptional<number>;
    declare evaluator_id: ForeignKey<number>;
    declare challenge_response_id: string;
    declare level: Enumerator;
    declare param_1: number;
    declare param_2: number;
    declare param_3: number;
    declare param_4: number;
    declare param_5: number;
    declare comments: string;
    declare overall: number;
    declare submitted_at: Date;
    declare status: Enumerator;
    declare created_by: number;
    declare created_at: Date;
    declare updated_by: number;
    declare updated_at: Date;

    static modelTableName = "evaluator_ratings";
    static structure: any = {
        evaluator_rating_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        evaluator_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        challenge_response_id: {
            type: DataTypes.INTEGER,
            unique: true,
            allowNull: false
        },
        status: {
            type: DataTypes.ENUM(...Object.values(constents.common_status_flags.list)),
            defaultValue: constents.common_status_flags.default
        },
        level: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        param_1: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        param_2: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        param_3: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        param_4: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        param_5: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        comments: {
            type: DataTypes.TEXT('long'),
            allowNull: true
        },
        overall: {
            type: DataTypes.DECIMAL,
            allowNull: true,
            defaultValue: 0
        },
        submitted_at: {
            type: DataTypes.DATE,
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
evaluator_rating.init(
    evaluator_rating.structure,
    {
        sequelize: db,
        tableName: evaluator_rating.modelTableName,
        timestamps: true,
        updatedAt: 'updated_at',
        createdAt: 'created_at',
    }
);

challenge_response.hasMany(evaluator_rating, { foreignKey: 'challenge_response_id', constraints: false })
evaluator_rating.belongsTo(challenge_response, { foreignKey: 'challenge_response_id', constraints: false });
evaluator_rating.belongsTo(evaluator, { foreignKey: 'evaluator_id', constraints: false });
evaluator_rating.hasMany(evaluator, { foreignKey: 'evaluator_id', constraints: false });