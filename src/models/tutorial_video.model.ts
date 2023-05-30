import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from 'sequelize';
import db from '../utils/dbconnection.util';
import { constents } from '../configs/constents.config';


export class tutorial_video extends Model<InferAttributes<tutorial_video>, InferCreationAttributes<tutorial_video>> {
    
    declare tutorial_video_id: CreationOptional<number>;
    declare video_stream_id: CreationOptional<string>;
    declare title: string;
    declare desc: CreationOptional<string>;
    declare status: CreationOptional<Enumerator>;
    declare type: CreationOptional<Enumerator>;
    declare created_by: CreationOptional<number>;
    declare created_at: CreationOptional<Date>;
    declare updated_by: CreationOptional<number>;
    declare updated_at: CreationOptional<Date>;
    
    static modelTableName = "tutorial_videos";
    static structrue:any =  {
        tutorial_video_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        video_stream_id: {
            type: DataTypes.STRING,
            allowNull:false,
        },
        title: {
            type: DataTypes.STRING,
        },
        desc: {
            type: DataTypes.TEXT('long'),
        },
        status: {
            type: DataTypes.ENUM(...Object.values(constents.common_status_flags.list)),
            defaultValue: constents.common_status_flags.default
        },
        type: {
            type: DataTypes.ENUM(...Object.values(constents.tut_videos_type_flags.list)),
            defaultValue: constents.tut_videos_type_flags.default
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

tutorial_video.init(
    tutorial_video.structrue,
    {
        sequelize: db,
        tableName: tutorial_video.modelTableName,
        timestamps: true,
        updatedAt: 'updated_at',
        createdAt: 'created_at'
    }
);