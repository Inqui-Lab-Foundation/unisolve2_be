import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from 'sequelize';
import db from '../utils/dbconnection.util';
import { constents } from '../configs/constents.config';


export class translation extends Model<InferAttributes<translation>, InferCreationAttributes<translation>> {
    
    declare translation_id: CreationOptional<number>;
    declare from_locale: string;
    declare to_locale: string;
    declare key: string;
    declare value: string;
    declare status: Enumerator;
    declare created_by: number;
    declare created_at: Date;
    declare updated_by: number;
    declare updated_at: Date;
    
    static modelTableName = "translations";
    static structrue:any =  {
        translation_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        from_locale: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: constents.translations_flags.default_locale
        },
        to_locale: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        key: {
            type: DataTypes.TEXT('long'),
            
        },
        value: {
            type: DataTypes.TEXT('long'),
            
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

translation.init(
   translation.structrue,
    {
        sequelize: db,
        tableName: translation.modelTableName,
        timestamps: true,
        updatedAt: 'updated_at',
        createdAt: 'created_at',
    }
);