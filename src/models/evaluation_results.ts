import { CreationOptional, DataTypes, ForeignKey, InferAttributes, InferCreationAttributes, Model } from 'sequelize';
import db from '../utils/dbconnection.util';
import { constents } from '../configs/constents.config';
import { challenge_response } from './challenge_response.model';
import { evaluator_rating } from './evaluator_rating.model';


export class evaluation_results extends Model<InferAttributes<evaluation_results>, InferCreationAttributes<evaluation_results>> {
    declare evaluation_results_id: CreationOptional<number>;
    declare challenge_response_id: string;
    declare level: Enumerator;
    declare status: Enumerator;
    declare created_by: number;
    declare created_at: Date;
    declare updated_by: number;
    declare updated_at: Date;

    static modelTableName = "evaluation_results";
    static structure: any = {
        evaluation_results_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        challenge_response_id: {
            type: DataTypes.INTEGER,
            unique: true,
            allowNull: false
        },
        level: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        status: {
            type: DataTypes.ENUM(...Object.values(constents.common_status_flags.list)),
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
    };
}
evaluation_results.init(
    evaluation_results.structure,
    {
        sequelize: db,
        tableName: evaluation_results.modelTableName,
        timestamps: true,
        updatedAt: 'updated_at',
        createdAt: 'created_at',
    }
);

evaluation_results.hasMany(evaluator_rating, { sourceKey: 'challenge_response_id', foreignKey: 'challenge_response_id', constraints: false })
evaluator_rating.belongsTo(evaluation_results, { foreignKey: 'challenge_response_id', constraints: false });