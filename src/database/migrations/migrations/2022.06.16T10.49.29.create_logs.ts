import { Migration } from '../umzug';
import { DataTypes } from 'sequelize';
import { constents } from '../../../configs/constents.config';

const tableName = "logs";
export const up: Migration = async ({ context: sequelize }) => {
    await sequelize.getQueryInterface().createTable(tableName, {
        log_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        log_type: {
            type: DataTypes.ENUM(...Object.values(constents.log_levels.list)),
            allowNull: false,
            defaultValue: constents.log_levels.default
        },
        date: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        },
        message: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: 'OK'
        },
        ip: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        method: {
            type: DataTypes.ENUM(...Object.values(constents.http_methods.list)),
            allowNull: true
        },
        route: {
            type: DataTypes.TEXT('long'),
            allowNull: false
        },
        status_code: {
            type: DataTypes.ENUM(...constents.status_codes.list),
            allowNull: false,
            defaultValue: constents.status_codes.default
        },
        token: {
            type: DataTypes.TEXT('long'),
            allowNull: true
        },
        headers: {
            type: DataTypes.TEXT('long'),
            allowNull: true
        },
        req_body: {
            type: DataTypes.TEXT('long'),
            allowNull: true
        },
        res_body: {
            type: DataTypes.TEXT('long'),
            allowNull: true
        },
        user_details: {
            type: DataTypes.TEXT('long'),
            allowNull: true
        },
        logged_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
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