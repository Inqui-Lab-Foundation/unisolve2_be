import { Migration } from '../umzug';
import { DataTypes } from 'sequelize';
import { constents } from '../../../configs/constents.config';
import { challenge_evaluator_map } from '../../../models/challenege_evaluator_map.model';

// you can put some table-specific imports/code here
export const tableName = challenge_evaluator_map.modelTableName;
const structrue: any = challenge_evaluator_map.structure
export const up: Migration = async ({ context: sequelize }) => {
	await sequelize.getQueryInterface().createTable(tableName, structrue);
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