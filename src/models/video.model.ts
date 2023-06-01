import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from 'sequelize';
import db from '../utils/dbconnection.util';
import { constents } from '../configs/constents.config';


export class video extends Model<InferAttributes<video>, InferCreationAttributes<video>> {

    declare video_id: CreationOptional<number>;
    declare video_stream_id: string;
    declare video_duration: string;
    declare status: Enumerator;
    declare created_by: number;
    declare created_at: Date;
    declare updated_by: number;
    declare updated_at: Date;

}

video.init(
    {
        video_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        video_stream_id: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        video_duration: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: '-1'
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
    },
    {
        sequelize: db,
        tableName: 'videos',
        timestamps: true,
        updatedAt: 'updated_at',
        createdAt: 'created_at',
    }
);