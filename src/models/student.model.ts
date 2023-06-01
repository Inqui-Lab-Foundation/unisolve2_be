import { DataTypes, Model, InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';
import bcrypt from 'bcrypt';
import { constents } from '../configs/constents.config';
import db from '../utils/dbconnection.util';
import { notification } from './notification.model';
import { baseConfig } from '../configs/base.config';
import { user } from './user.model';

export class student extends Model<InferAttributes<student>, InferCreationAttributes<student>> {
    declare student_id: CreationOptional<number>;
    declare UUID: string;
    declare user_id: number;
    declare team_id: string;
    declare full_name: string;
    declare date_of_birth: Date;
    declare qualification: string;
    declare institute_name: string;
    declare Age: number;
    declare Grade: string;
    declare Gender: string;
    declare city: string;
    declare district: string;
    declare state: string;
    declare country: string;
    declare badges: string;
    declare certificate: number;
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
        student.hasMany(notification, { sourceKey: 'notification_id', as: 'notifications' });
    }
}

student.init(
    {
        student_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        UUID: {
            type: DataTypes.STRING,
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
        institute_name: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        qualification: {
            type: DataTypes.STRING,
            allowNull: true
        },
        Age: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        Grade: {
            type: DataTypes.STRING,
            allowNull: true
        },
        Gender: {
            type: DataTypes.ENUM(...Object.values(constents.gender_flags.list)),
            defaultValue: constents.gender_flags.default
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
        badges: {
            type: DataTypes.TEXT('long')
        },
        status: {
            type: DataTypes.ENUM(...Object.values(constents.common_status_flags.list)),
            defaultValue: constents.common_status_flags.default
        },
        certificate: {
            type: DataTypes.DATE,
            allowNull: true,
            defaultValue: null
        },
        created_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
        created_by: {
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: null
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
        tableName: 'students',
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

// student.belongsTo(user, { foreignKey: 'user_id', constraints: false });
// user.hasOne(student, { foreignKey: 'user_id', constraints: false, scope: { role: 'STUDENT' } });
student.belongsTo(user, { foreignKey: 'user_id' });
user.hasMany(student, { foreignKey: 'user_id' });
student.belongsTo(user, { foreignKey: 'user_id' });
user.hasMany(student, { foreignKey: 'user_id' });