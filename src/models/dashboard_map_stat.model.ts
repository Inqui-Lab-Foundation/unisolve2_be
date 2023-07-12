import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from 'sequelize';
import { constents } from '../configs/constents.config';
import db from '../utils/dbconnection.util';

export class dashboard_map_stat extends Model<InferAttributes<dashboard_map_stat>, InferCreationAttributes<dashboard_map_stat>> {
    declare dashboard_map_stat_id: CreationOptional<number>;
    declare district_name: string;
    declare overall_schools: string;
    declare reg_schools: string;
    declare schools_with_teams: string;
    declare teams: string;
    declare ideas: string;
    declare students: string;
    declare status: Enumerator;
    declare created_by: number;
    declare created_at: Date;
    declare updated_by: number;
    declare updated_at: Date;
}

dashboard_map_stat.init(
    {
        dashboard_map_stat_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        district_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        overall_schools: {
            type: DataTypes.STRING,
            allowNull: false
        },
        reg_schools: {
            type: DataTypes.STRING,
            allowNull: false
        },
        schools_with_teams:{
            type: DataTypes.STRING,
            allowNull: false
        },
        teams: {
            type: DataTypes.STRING,
            allowNull: false
        },
        ideas: {
            type: DataTypes.STRING,
            allowNull: false
        },
        students: {
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
    },
    {
        sequelize: db,
        tableName: 'dashboard_map_stats',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
);
