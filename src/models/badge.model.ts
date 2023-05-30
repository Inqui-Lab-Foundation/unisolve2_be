import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from 'sequelize';
import db from '../utils/dbconnection.util';
import { constents } from '../configs/constents.config';


export class badge extends Model<InferAttributes<badge>, InferCreationAttributes<badge>> {
    
    declare badge_id: CreationOptional<number>;
    // declare badge_no: number;
    declare slug: CreationOptional<string>;
    declare name: string;
    declare desc: CreationOptional<string>;
    declare icon: string;
    declare status: CreationOptional<Enumerator>;
    declare created_by: CreationOptional<number>;
    declare created_at: CreationOptional<Date>;
    declare updated_by: CreationOptional<number>;
    declare updated_at: CreationOptional<Date>;
    
    static modelTableName = "badges";
    static structrue:any =  {
        badge_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        // badge_no: {
        //     type: DataTypes.INTEGER
        // },
        slug: {
            type: DataTypes.STRING,
            unique:true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique:true
        },
        desc: {
            type: DataTypes.TEXT('long'),
        },
        icon: {
            type: DataTypes.STRING
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
    static getSlugValue(name:string){
       return name.trim().split(" ").join("_").toLowerCase()
    }

}

badge.init(
    badge.structrue,
    {
        sequelize: db,
        tableName: badge.modelTableName,
        timestamps: true,
        updatedAt: 'updated_at',
        createdAt: 'created_at',
        hooks: {
            beforeCreate: async (argBadge:any) => {
                if (argBadge.name) {
                    argBadge.slug = badge.getSlugValue(argBadge.name);
                }
            },
        }
    }
);