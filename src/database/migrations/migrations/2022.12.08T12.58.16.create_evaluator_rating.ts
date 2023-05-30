import { Migration } from '../umzug';
import { DataTypes } from 'sequelize';
import { constents } from '../../../configs/constents.config';
import { evaluator_rating } from '../../../models/evaluator_rating.model';


// you can put some table-specific imports/code here
export const tableName = evaluator_rating.modelTableName
export const structure = evaluator_rating.structure;
export const up: Migration = async ({ context: sequelize }) => {
	await sequelize.getQueryInterface().createTable(tableName, structure);
};

export const down: Migration = async ({ context: sequelize }) => {
	// 	await sequelize.query(`raise fail('down migration not implemented')`); //call direct sql 
	//or below implementation 
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