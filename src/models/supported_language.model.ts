import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from 'sequelize';
import db from '../utils/dbconnection.util';
import { constents } from '../configs/constents.config';


export class supported_language extends Model<InferAttributes<supported_language>, InferCreationAttributes<supported_language>> {
    
    declare supported_language_id: CreationOptional<number>;
    declare locale: string;
    declare status: Enumerator;
    declare created_by: number;
    declare created_at: Date;
    declare updated_by: number;
    declare updated_at: Date;
    
    static modelTableName = "supported_languages";
    static structrue:any =  {
        supported_language_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        locale: {
            type: DataTypes.STRING,
            allowNull: false,
            unique:true
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

supported_language.init(
    supported_language.structrue,
    {
        sequelize: db,
        tableName: supported_language.modelTableName,
        timestamps: true,
        updatedAt: 'updated_at',
        createdAt: 'created_at',
    }
);