import { DataTypes, InferAttributes, InferCreationAttributes, Model } from 'sequelize';
import { constents } from '../configs/constents.config';
import db from '../utils/dbconnection.util';

export class worksheet extends Model<InferAttributes<worksheet>, InferCreationAttributes<worksheet>> {
    declare worksheet_id: number;
    declare description: string;
    declare attachments: string;
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

worksheet.init(
    {
        worksheet_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        description: {
            type: DataTypes.TEXT('long'),
            allowNull: true
        },
        attachments: {
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
        tableName: 'worksheets',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
);
