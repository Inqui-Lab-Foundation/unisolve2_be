import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, or } from 'sequelize';
import db from '../utils/dbconnection.util';
import { constents } from '../configs/constents.config';


export class organization extends Model<InferAttributes<organization>, InferCreationAttributes<organization>> {
    declare organization_id: CreationOptional<number>;
    declare organization_name: string;
    declare organization_code: string;
    declare city: string;
    declare district: string;
    declare state: string;
    declare country: string;
    declare principal_name: string;
    declare principal_email: string;
    declare principal_mobile: string;
    declare status: Enumerator;
    declare created_by: number;
    declare created_at: Date;
    declare updated_by: number;
    declare updated_at: Date;
}

organization.init({
    organization_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    organization_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    organization_code: {
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
    principal_name: {
        type: DataTypes.STRING
    },
    principal_mobile: {
        type: DataTypes.STRING
    },
    principal_email: {
        type: DataTypes.STRING
    },
    status: {
        type: DataTypes.ENUM(...Object.values(constents.organization_status_flags.list)),
        defaultValue: constents.organization_status_flags.default
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
        tableName: 'organizations',
        timestamps: true,
        updatedAt: 'updated_at',
        createdAt: 'created_at',
    }
);