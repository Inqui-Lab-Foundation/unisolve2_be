import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from 'sequelize';
import db from '../utils/dbconnection.util';
import { constents } from '../configs/constents.config';


export class certificate_download extends Model<InferAttributes<certificate_download>, InferCreationAttributes<certificate_download>> {
    declare certificate_id: CreationOptional<number>;
    declare certificate_type: string;
    declare mobile: string;
    declare faculty_name: string;
    declare organization_name: string;
    declare status: Enumerator;
    declare created_by: number;
    declare created_at: Date;
    declare updated_by: number;
    declare updated_at: Date;

    static modelTableName = "certificate_downloads";
    static structrue: any = {
        certificate_download_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        certificate_type: {
            type: DataTypes.ENUM(...Object.values(constents.certificate_flags.list)),
            allowNull: true,
            defaultValue: constents.certificate_flags.default
        },
        mobile: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false
        },
        faculty_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        organization_name: {
            type: DataTypes.STRING,
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
    };
}

certificate_download.init(
    certificate_download.structrue,
    {
        sequelize: db,
        tableName: certificate_download.modelTableName,
        timestamps: true,
        updatedAt: 'updated_at',
        createdAt: 'created_at',
    }
);