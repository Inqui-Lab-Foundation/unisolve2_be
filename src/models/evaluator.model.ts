import { DataTypes, Model, Attributes, InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';
import bcrypt from 'bcrypt';
import { constents } from '../configs/constents.config';
import db from '../utils/dbconnection.util';
import { notification } from './notification.model';
import { baseConfig } from '../configs/base.config';
import { user } from './user.model';

export class evaluator extends Model<InferAttributes<evaluator>, InferCreationAttributes<evaluator>> {
    declare evaluator_id: CreationOptional<number>;
    declare user_id: string;
    declare full_name: string;
    declare mobile: string;
    declare district: string;
    declare status: Enumerator;
    declare created_by: number;
    declare created_at: Date;
    declare updated_by: number;
    declare updated_at: Date;

    static modelTableName = 'evaluators';
    static structure: any = {
        evaluator_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        full_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        district: {
            type: DataTypes.STRING
        },
        mobile: {
            type: DataTypes.STRING,
            unique: true
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
    static associate(models: any) {
        // define association here
        evaluator.hasMany(notification, { sourceKey: 'notification_id', as: 'notifications' });
    }
}

evaluator.init(
    evaluator.structure,
    {
        sequelize: db,
        tableName: evaluator.modelTableName,
        timestamps: true,
        updatedAt: 'updated_at',
        createdAt: 'created_at',
        hooks: {
            beforeCreate: async (user: any) => {
                if (user.password) {
                    user.password = await bcrypt.hashSync(user.password, process.env.SALT || baseConfig.SALT);
                }
            },
            beforeUpdate: async (user) => {
                if (user.password) {
                    user.password = await bcrypt.hashSync(user.password, process.env.SALT || baseConfig.SALT);
                }
            }
        }
    }
);

evaluator.belongsTo(user, { foreignKey: 'user_id', constraints: false });
user.hasOne(evaluator, { foreignKey: 'user_id', constraints: false, scope: { role: 'EVALUATOR' } });