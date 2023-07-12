import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from 'sequelize';
import db from '../utils/dbconnection.util';
import { constents } from '../configs/constents.config';

export class instructions extends Model<InferAttributes<instructions>, InferCreationAttributes<instructions>> {
    
    declare instructions_id: CreationOptional<number>;
    declare slug: string;
    declare instructions: string;
    declare status: Enumerator;
    declare created_by: number;
    declare created_at: Date;
    declare updated_by: number;
    declare updated_at: Date;
    
    static modelTableName = "instructions";
    static structure:any =  {
        instructions_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        slug: {
            type: DataTypes.STRING,
            allowNull: true
        },
        instructions: {
            type: DataTypes.TEXT('long'),
            allowNull: true
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

instructions.init(
    instructions.structure,
    {
        sequelize: db,
        tableName: instructions.modelTableName,
        timestamps: true,
        updatedAt: 'updated_at',
        createdAt: 'created_at',
    }
);