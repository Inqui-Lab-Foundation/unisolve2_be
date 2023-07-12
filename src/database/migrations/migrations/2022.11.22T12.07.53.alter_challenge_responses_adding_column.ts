import { Migration } from '../umzug';
import { DataTypes } from 'sequelize';
import { constents } from '../../../configs/constents.config';

// you can put some table-specific imports/code here
export const tableName = "challenge_responses";
export const up: Migration = async ({ context: sequelize }) => {
	// await sequelize.query(`raise fail('up migration not implemented')`); //call direct sql 
	//or below implementation 
	await sequelize.getQueryInterface().addColumn(tableName, 'others', {
		type: DataTypes.STRING,
		allowNull: true,
	});
	await sequelize.getQueryInterface().removeColumn(tableName, 'idea_name')
};

export const down: Migration = async ({ context: sequelize }) => {
	// 	await sequelize.query(`raise fail('down migration not implemented')`); //call direct sql 
	//or below implementation 
	// await sequelize.getQueryInterface().dropTable(tableName);
	try {
		await sequelize.getQueryInterface().removeColumn(tableName, 'others');
	} catch (error) {
		throw error
	}
};