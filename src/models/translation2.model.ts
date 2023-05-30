import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from 'sequelize';
import db from '../utils/dbconnection.util';
import { constents } from '../configs/constents.config';


export class translation2 extends Model<InferAttributes<translation2>, InferCreationAttributes<translation2>> {
    
    declare translation_id: CreationOptional<number>;
    declare to_locale: string;
    declare table_name: string;
    declare coloumn_name: string;
    declare index_no: number;
    declare from_locale: string;
    declare key: string;
    declare value: string;
    declare status: Enumerator;
    declare created_by: number;
    declare created_at: Date;
    declare updated_by: number;
    declare updated_at: Date;
    
    static modelTableName = "translations2";
    static structrue:any =  {
        translation_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        table_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        coloumn_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        index_no: {
            type: DataTypes.INTEGER,
            allowNull: false,
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

translation2.init(
   translation2.structrue,
    {
        sequelize: db,
        tableName: translation2.modelTableName,
        timestamps: true,
        updatedAt: 'updated_at',
        createdAt: 'created_at',
    }
);