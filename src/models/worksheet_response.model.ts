import { CreationOptional, DataTypes, ForeignKey, InferAttributes, InferCreationAttributes, Model } from 'sequelize';
import { constents } from '../configs/constents.config';
import db from '../utils/dbconnection.util';
import { worksheet } from './worksheet.model';

export class worksheet_response extends Model<InferAttributes<worksheet_response>,InferCreationAttributes<worksheet_response>> {
    declare worksheet_response_id: CreationOptional<number>;
    declare worksheet_id: ForeignKey<number>;
    declare user_id: ForeignKey<number>;
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

worksheet_response.init(
    {
        
        worksheet_response_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        worksheet_id: {
            type: DataTypes.INTEGER,
            allowNull:false
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull:false
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
        tableName: 'worksheet_responses',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
);

worksheet_response.belongsTo(worksheet,{ foreignKey: 'worksheet_id'})
worksheet.hasMany(worksheet_response,{ foreignKey: 'worksheet_id'})
