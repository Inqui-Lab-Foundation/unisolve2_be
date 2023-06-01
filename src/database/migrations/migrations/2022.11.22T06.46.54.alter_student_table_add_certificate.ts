import { Migration } from '../umzug';
import { DataTypes } from 'sequelize';
import { constents } from '../../../configs/constents.config';

// you can put some table-specific imports/code here
export const tableName = "students";
export const columnName = "certificate";
export const up: Migration = async ({ context: sequelize }) => {
	// await sequelize.query(`raise fail('up migration not implemented')`); //call direct sql 
	//or below implementation 
	await sequelize.getQueryInterface().addColumn(tableName, columnName, {
		type: DataTypes.DATE,
		allowNull: true,
		defaultValue: null
	});
};

export const down: Migration = async ({ context: sequelize }) => {
	try {
		await sequelize.getQueryInterface().removeColumn(tableName, columnName);
	} catch (error) {
		throw error
	}
};