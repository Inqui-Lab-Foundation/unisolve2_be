import { CreationOptional, DataTypes, ForeignKey, InferAttributes, InferCreationAttributes, Model } from 'sequelize';
import { constents } from '../configs/constents.config';
import db from '../utils/dbconnection.util';
import { challenge } from './challenge.model';

export class challenge_question extends Model<InferAttributes<challenge_question>, InferCreationAttributes<challenge_question>> {
    declare challenge_question_id: CreationOptional<number>;
    declare challenge_id: ForeignKey<number>;
    declare question_no: number;
    declare word_limit: number;
    declare question: string;
    declare description: string;
    declare option_a: string;
    declare option_b: string;
    declare option_c: string;
    declare option_d: string;
    declare correct_ans: string;
    declare type: Enumerator;
    declare status: Enumerator;
    declare created_by: number;
    declare created_at: Date;
    declare updated_by: number;
    declare updated_at: Date;
}

challenge_question.init(
    {
        challenge_question_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        challenge_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        question_no: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        question: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        option_a: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        option_b: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        option_c: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        option_d: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        correct_ans: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        word_limit: {
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: 100
        },
        type: {
            type: DataTypes.ENUM(...Object.values(constents.quiz_question_type_flags.list)),
            allowNull: false,
            defaultValue: constents.quiz_question_type_flags.default
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
        tableName: 'challenge_questions',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
);

challenge_question.belongsTo(challenge, { foreignKey: 'challenge_id' })
challenge.hasMany(challenge_question, { foreignKey: 'challenge_id' })
