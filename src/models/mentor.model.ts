import { DataTypes, Model, Attributes, InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';
import bcrypt from 'bcrypt';
import { constents } from '../configs/constents.config';
import db from '../utils/dbconnection.util';
import { notification } from './notification.model';
import { baseConfig } from '../configs/base.config';
import { user } from './user.model';
import { organization } from './organization.model';
import { student } from './student.model';


export class mentor extends Model<InferAttributes<mentor>, InferCreationAttributes<mentor>> {
    declare mentor_id: CreationOptional<number>;
    declare team_id: string;
    declare user_id: number;
    declare reg_status: number;
    declare organization_code: string;
    declare full_name: string;
    declare date_of_birth: Date;
    declare qualification: string;
    declare city: string;
    declare district: string;
    declare state: string;
    declare country: string;
    declare mobile: string;
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
    static associate(models: any) {
        // define association here
        mentor.hasMany(notification, { sourceKey: 'notification_id', as: 'notifications' });
    }
}

mentor.init(
    {
        mentor_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        reg_status: {
            type: DataTypes.ENUM(...Object.values(constents.res_status.list)),
            defaultValue: constents.res_status.default,
            allowNull: true
        },
        organization_code: {
            type: DataTypes.STRING,
            allowNull: false
        },
        team_id: {
            type: DataTypes.STRING,
        },
        full_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        date_of_birth: {
            type: DataTypes.DATE,
            allowNull: true
        },
        qualification: {
            type: DataTypes.STRING,
            allowNull: false
        },
        city: {
            type: DataTypes.STRING
        },
        district: {
            type: DataTypes.STRING
        },
        state: {
            type: DataTypes.STRING
        },
        country: {
            type: DataTypes.STRING
        },
        mobile: {
            type: DataTypes.STRING,
            unique: true
        },
        otp: {
            type: DataTypes.STRING,
            allowNull: true,
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
    },
    {
        sequelize: db,
        tableName: 'mentors',
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

mentor.belongsTo(user, { foreignKey: 'user_id', constraints: false, scope: { role: 'MENTOR' } });
user.hasOne(mentor, { foreignKey: 'user_id', constraints: false });
mentor.belongsTo(organization, { targetKey: 'organization_code', foreignKey: 'organization_code', constraints: false });
organization.hasOne(mentor, { sourceKey: 'organization_code', foreignKey: 'organization_code', constraints: false });
mentor.belongsTo(student, { targetKey: 'team_id', foreignKey: 'organization_code', constraints: false });
student.hasOne(mentor, { sourceKey: 'team_id', foreignKey: 'organization_code', constraints: false });