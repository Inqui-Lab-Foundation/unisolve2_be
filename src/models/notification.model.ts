import { DataTypes, Model } from 'sequelize';
import { constents } from '../configs/constents.config';
import INotificationAttributes from '../interfaces/notification.model.interface';
import db from '../utils/dbconnection.util';
import { user } from './user.model';

export class notification extends Model<INotificationAttributes> {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models: any) {
        // define association here
        notification.belongsTo(user, { foreignKey: 'created_by', as: 'user' });
    }
}


notification.init(
    {
        notification_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        notification_type: {
            type: DataTypes.ENUM(...Object.values(constents.notification_types.list)),
            allowNull: false,
            defaultValue: constents.notification_types.default
        },
        target_audience: {
            type: DataTypes.TEXT('long'),
            allowNull: false,
            // defaultValue: 'ALL'
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: constents.notification_types.default_title
        },
        image: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: null
        },
        message: {
            type: DataTypes.TEXT('long'),
            allowNull: false,
            // defaultValue: constents.notification_types.default_message
        },
        read_by: {
            type: DataTypes.TEXT('long'),
            allowNull: true,
            defaultValue: null
        },
        status: {
            type: DataTypes.ENUM(...Object.values(constents.notification_status_flags.list)),
            allowNull: false,
            defaultValue: constents.notification_status_flags.default
        },
        created_by: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        created_at:{
            type: DataTypes.DATE,
            allowNull: true,
            defaultValue: DataTypes.NOW,
        },
        updated_by: {
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: null
        },
        updated_at:{
            type: DataTypes.DATE,
            allowNull: true,
            defaultValue: DataTypes.NOW,
            onUpdate: new Date().toLocaleString()
        }
    },
    {
        sequelize: db,
        tableName: 'notifications',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
);
