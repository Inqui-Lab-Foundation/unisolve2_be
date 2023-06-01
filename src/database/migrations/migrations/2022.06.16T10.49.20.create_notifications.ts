import { Migration } from '../umzug';
import { DataTypes } from 'sequelize';
import { constents } from '../../../configs/constents.config';

const tableName = "notifications";
export const up: Migration = async ({ context: sequelize }) => {
    await sequelize.getQueryInterface().createTable(tableName, {
        notification_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        notification_type: {
            type: DataTypes.ENUM(...Object.values(constents.notification_types.list)),
            allowNull: false,
            defaultValue: constents.notification_types.default
        },
        target_audience: {
            type: DataTypes.TEXT('long'),
            allowNull: false,
            // defaultValue: 'ALL'
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: constents.notification_types.default_title
        },
        image: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: null
        },
        message: {
            type: DataTypes.TEXT('long'),
            allowNull: false,
            // defaultValue: constents.notification_types.default_message
        },
        read_by: {
            type: DataTypes.TEXT('long'),
            allowNull: true,
            defaultValue: null
        },
        status: {
            type: DataTypes.ENUM(...Object.values(constents.notification_status_flags.list)),
            allowNull: false,
            defaultValue: constents.notification_status_flags.default
        },
        created_by: {
            type: DataTypes.INTEGER,
            allowNull: true
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
    });
};

export const down: Migration = async ({ context: sequelize }) => {
    // await sequelize.getQueryInterface().dropTable(tableName);
	try {
		await sequelize.transaction(async (transaction) => {
		  const options = { transaction };
		  await sequelize.query("SET FOREIGN_KEY_CHECKS = 0", options);
		  await sequelize.query(`DROP TABLE ${tableName}`, options);
		  await sequelize.query("SET FOREIGN_KEY_CHECKS = 1", options);
		});
} catch (error) {
	throw error	  
}
};