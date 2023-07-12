import { Migration } from '../umzug';
import { DataTypes } from 'sequelize';
import { constents } from '../../../configs/constents.config';
import { evaluation_process } from '../../../models/evaluation_process.model';

evaluation_process
export const tableName: any = evaluation_process.tableName
export const tableStructure: any = evaluation_process.structure
export const up: Migration = async ({ context: sequelize }) => {
	await sequelize.getQueryInterface().createTable(tableName, tableStructure);
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