import { Migration } from '../umzug';
import { DataTypes } from 'sequelize';
import { constents } from '../../../configs/constents.config';
import { user } from '../../../models/user.model';
user

export const tableName = "users";
export const up: Migration = async ({ context: sequelize }) => {
	await sequelize.getQueryInterface().changeColumn(tableName, 'role', {
		type: DataTypes.ENUM(...Object.values(constents.user_role_flags.list)),
		defaultValue: constents.user_role_flags.default
	});
};

export const down: Migration = async ({ context: sequelize }) => {
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